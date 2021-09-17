import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn, FormGroup, NG_VALIDATORS, Validator, } from '@angular/forms';

import { auditTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { from, Observable, of, Subject } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { AppLookupConfigModel } from './lookup.model';
import { ApiSelectOptions, ApiService, ApiWhereObject } from '../services/api.service';


@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AppLookupComponent),
    multi: true
  }/* , { provide: NG_VALIDATORS, useExisting: forwardRef(() => AppLookupComponent), multi: true } */],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLookupComponent implements OnInit, ControlValueAccessor, OnChanges, Validator {

  @ViewChild('input') inputEl: ElementRef;

  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

  @Input() label: string;

  @Input() returnField: string;
  @Input() dbLookupConfig: AppLookupConfigModel;
  @Input() keyFormControl: FormControl;

  @Input() rowDataControl: FormControl;
  @Input() color = 'primary';
  @Input() appearance = 'fill';

  @Input() topFormGroup: FormGroup;

  @Output() additionalData = new EventEmitter();

  formControl = new FormControl();

  options: Observable<any[]>;

  private isDisabled = false;
  @Input() set disabled(x: boolean) {
    if (this.isDisabled === x) {
      return;
    }
    this.isDisabled = x;
    this.setDisabledState(x);
  }
  get disabled(): boolean {
    return this.isDisabled;
  }

  valueOnFocus = null;

  selectionFinished = false;

  onChangedFn: (any) => void = () => {
    // tslint:disable-next-line:semicolon
  };
  onTouchedFn: () => void = () => {
    // tslint:disable-next-line:semicolon
  };

  cancelSubject$ = new Subject<void>();

  constructor(
    public cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    public apiService: ApiService
  ) { }

  detectChanges(): void {
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.dbLookupConfig && this.dbLookupConfig.required ?
      control.value === null || (this.keyFormControl && this.keyFormControl.invalid) ? { required: true } : null
      : null;
  }

  ngOnInit(): void {
    this.options = this.formControl.valueChanges.pipe(
      tap((value) => {
        this.selectionFinished = false;
        if (typeof value === 'object') {
          this.setControlValue();
        } else if (value === '') {
          const emptyObject = {};
          emptyObject[this.dbLookupConfig.displayField] = '';
          emptyObject[this.dbLookupConfig.keyField] = null;
          this.formControl.setValue(emptyObject);
        }
      }),
      filter(value =>
        typeof value === 'string' &&
        value.length >= (typeof this.dbLookupConfig.minLength === 'number' ? this.dbLookupConfig.minLength : 0)
      ),
      distinctUntilChanged(),
      tap(x => this.waitingForTime = true),
      auditTime(this.dbLookupConfig.auditTime || 500),
      switchMap((textInput) => {
        this.cancelSubject$.next();
        return this.getOptions(textInput);
      })
    );

    if (this.keyFormControl) {
      this.keyFormControl.valueChanges.subscribe(value => {
        if (
          (value || value === 0) && typeof value === 'object' &&
          (!this.formControl.value || value[this.dbLookupConfig.displayField] !== this.formControl.value[this.dbLookupConfig.displayField])
        ) {
          this.formControl.setValue(value, { emitEvent: false });
        } else if (value === null) {
          this.formControl.setValue(value, { emitEvent: false });
        }
      });
    }
  }

  lookupRequiredValidator(control: AbstractControl): ValidationErrors {
    if (
      (control.value == null) ||
      (control.value && typeof control.value === 'object' && control.value[this.dbLookupConfig.keyField] == null) ||
      (this.keyFormControl && this.keyFormControl.invalid)
    ) {
      return { required: true };
    }
    return null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const validators: ValidatorFn[] = [];

    if (this.dbLookupConfig.required) {
      validators.push(this.lookupRequiredValidator.bind(this));
    }

    if (this.dbLookupConfig.returnField) {
      this.returnField = this.dbLookupConfig.returnField;
    }

    this.formControl.setValidators(validators);
  }

  // tslint:disable-next-line:member-ordering
  waitingForTime = false;
  // tslint:disable-next-line:member-ordering
  getOptionsProgress = 0;
  getOptions(textInput: string | null): Observable<any> {

    this.waitingForTime = false;
    this.getOptionsProgress++;

    let reqPromise: Observable<any> | Promise<any>;

    if (this.dbLookupConfig.request) {
      const req: ApiSelectOptions = JSON.parse(JSON.stringify(this.dbLookupConfig.request));
      if (!req.Where) {
        req.Where = [];
      }
      let val = String(textInput) + '%';
      if (this.dbLookupConfig.searchMode === 'contains') {
        val = '%' + String(textInput) + '%';
      } else if (this.dbLookupConfig.searchMode === 'endsWith') {
        val = '%' + String(textInput);
      } else if (this.dbLookupConfig.searchMode === 'manual') {
        val = String(textInput);
      }
      req.Select = [
        ...[this.dbLookupConfig.displayField, this.dbLookupConfig.keyField],
        ...(this.dbLookupConfig.additionalFields && typeof this.dbLookupConfig.additionalFields === 'object') ? (
          Array.isArray(this.dbLookupConfig.additionalFields) ?
            this.dbLookupConfig.additionalFields : // If additional fields exists and is an array, use directly
            Object.keys(this.dbLookupConfig.additionalFields) // If object, use it's keys
        ) : [] // If additional keys doesn't exists or it's not an object type (array or object) then just discard it and use empty array.
      ];

      req.Where.push({
        Column: this.dbLookupConfig.displayField,
        Operator: 'LIKE',
        Value: val
      } as ApiWhereObject);
      req.Paging = { Current: 1, ItemsPerPage: +this.dbLookupConfig.limit || 10 };
      if (!req.OrderBy) {
        req.OrderBy = [{ Column: this.dbLookupConfig.displayField, Direction: 'ASC' }];
      }
      reqPromise = this.apiService.select$(req).pipe(takeUntil(this.cancelSubject$)).pipe(map(x => {
        return x?.ResultSets?.[0] || [];
      }));
    } else if (typeof this.dbLookupConfig.requestFn === 'function') {
      reqPromise = this.dbLookupConfig.requestFn(textInput, this.cancelSubject$);
    } else {
      reqPromise = of([]);
    }
    return from(reqPromise).pipe(
      tap(() => { this.getOptionsProgress--; }),
      switchMap((results: any[]) => {
        if (this.dbLookupConfig.formatter) {
          results = results.map(
            res => {
              res[this.dbLookupConfig.displayField] = this.dbLookupConfig.formatter(res);
              return res;
            }
          );
        }

        if (this.dbLookupConfig.displayer) {
          results = this.dbLookupConfig.displayer(results);
          results.forEach(x => {
            x['__display'] = this.sanitizer.bypassSecurityTrustHtml(x['__display']);
          });
        }

        /* if (textInput === '') {
          const emptyOption = {};
          emptyOption[this.dbLookupConfig.displayField] = '';
          emptyOption[this.dbLookupConfig.keyField] = null;
          (<Array<any>>results).unshift(emptyOption);
          return of(results);
        } */
        return of(results);
      })
    );
  }

  setControlValue(): void {
    const newValue = this.formControl.value ? this.formControl.value[this.returnField || this.dbLookupConfig.displayField] : null;
    if (this.rowDataControl) {
      this.rowDataControl.setValue(this.formControl.value);
    }
    if (this.keyFormControl || this.returnField) {
      this.onChangedFn(newValue);
    } else {
      this.onChangedFn(this.formControl.value);
    }
    if (this.keyFormControl) {
      const value = this.formControl.value;
      this.keyFormControl.setValue(value);
      if (
        (value || value === 0) &&
        typeof value === 'object' &&
        value.hasOwnProperty(this.dbLookupConfig.keyField)
        // (value[this.dbLookupConfig.keyField] || value[this.dbLookupConfig.keyField] === 0)
      ) {
        this.keyFormControl.setValue(value[this.dbLookupConfig.keyField]);
        this.keyFormControl.markAsDirty();
        this.keyFormControl.markAsTouched();
      }
    }
    if (
      this.topFormGroup &&
      this.dbLookupConfig.additionalFields &&
      typeof this.dbLookupConfig.additionalFields === 'object' &&
      !Array.isArray(this.dbLookupConfig.additionalFields)
    ) {
      const patchObj = {};
      for (const [selectKey, targetKeyStr] of Object.entries(this.dbLookupConfig.additionalFields)) {
        if (this.formControl.value && typeof this.formControl.value === 'object' && this.formControl.value.hasOwnProperty(selectKey)) {
          const targetKeys = String(targetKeyStr).split(',');
          targetKeys.forEach(targetKey => {
            //const dbValue = this.formControl.value[selectKey];
            const formValue = this.topFormGroup.value[(<string>targetKey)];
            if (formValue !== this.formControl.value[selectKey]) {
              patchObj[(<string>targetKey)] = this.formControl.value[selectKey];
            }
          });
        }
      }
      this.topFormGroup.patchValue(patchObj);
    }
  }

  displayFormatter(option: any): string {
    return option && option.hasOwnProperty(this.dbLookupConfig.displayField) ? option[this.dbLookupConfig.displayField] : option;
  }

  registerOnChange(fn: any): void {
    this.onChangedFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    isDisabled ? this.formControl.disable({ emitEvent: false }) : this.formControl.enable({ emitEvent: false });
    if (!this.cdr['destroyed']) {
      this.cdr.detectChanges();
    }
  }

  writeValue(val: any): void {
    this.formControl.setValue(val, { emitEvent: false });
    if (this.formControl.value && this.returnField) {
      this.onChangedFn(this.formControl.value[this.returnField]);
    }
  }

  openGrid(e: MouseEvent): void {
    e.stopPropagation();
    if (typeof this.dbLookupConfig.gridFn === 'function') {
      this.dbLookupConfig.gridFn(this.formControl.value);
    }
  }

  openRecord(e: MouseEvent): void {
    e.stopPropagation();
    if (typeof this.dbLookupConfig.recordFn == 'function') {
      this.dbLookupConfig.recordFn(this.formControl.value);
    }
  }

  focus(): void {
    if (this.inputEl) {
      (this.inputEl.nativeElement as HTMLInputElement).focus();
    }
  }

  onFocus(): void {
    this.selectionFinished = false;
    if (!this.formControl.value && !this.dbLookupConfig.minLength) {
      this.formControl.setValue('');
    }
    this.valueOnFocus = this.formControl.value;
  }

  onBlur(): void {
    this.selectionFinished = true;
    this.onTouchedFn();
    if (this.valueOnFocus === this.formControl.value) {
      return;
    }
    if (typeof this.formControl.value !== 'object') {
      this.formControl.setValue(null, { emitEvent: false });
      this.setControlValue();
    }
  }


  onOptionClick(e: MouseEvent, msg): void {
    e.stopPropagation();
    e.preventDefault();
  }

  optionSelected(ev: MatAutocompleteSelectedEvent): void {
    this.selectionFinished = true;
  }
}
