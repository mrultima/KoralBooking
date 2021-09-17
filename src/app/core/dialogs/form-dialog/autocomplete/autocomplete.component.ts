import { Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors,
  Validator
} from '@angular/forms';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomValidators, AppService } from '../../../shared';
import { FormDialogComponent, FormDialogData } from '../form-dialog.component';


interface FlightAutoCompleteData {
  AIRPORTCODE: string;
  AIRPORTNAME: string;
  CITYCODE: string;
  CITYNAME: string;
  COUNTRYCODE: string;
  COUNTRYNAME: string;
  LOCATIONTYPE: string;
  ORDERID: string;
  RANK: string;
}

@Component({
  selector: 'ta-core-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }

  ]
})

export class AutocompleteComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @ViewChild('autoComplete') autoComplete: ElementRef;
  @ViewChild('mobileTemplate') mobileTemplate: ElementRef;

  @Input() placeholder: string;
  @Input() minLength = 3;
  @Input() smallInput = false;
  @Input() mobile = false;
  @Input() firstAutocomplete: boolean;
  @Input() mode: 'Flight' | 'Transfer' | 'Hotel' = 'Flight';
  @Input() autocompleteFn: (value: string, lang: string, firstAutocomplete?, latlonForTransfer?) => Observable<any>;
  @Input() multi = false;
  validatorChangeTriggerFn: () => void;

  @Input() set focusTrigger(focusTrigger: number) {
    if (focusTrigger) {
      this.autoComplete.nativeElement.focus();
    }
  }

  @Output() autoCompleteClosed = new EventEmitter();
  control = new FormControl(undefined, CustomValidators.isValueObject());
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<any[any]>;
  hint = '';
  // mobileHint: Partial<FlightAutoCompleteData> | Partial<TransferAutoCompleteData>;
  mobileHint: any;
  ltmd: boolean;
  loading = new BehaviorSubject(false);
  dialogRef: MatDialogRef<FormDialogComponent>;
  isDestroyed = new Subject();

  constructor(
    breakpointObserver: BreakpointObserver,
    public appService: AppService,
    public dialog: MatDialog,
  ) {
    breakpointObserver.observe('(max-width: 959px)').subscribe(value => {
        this.ltmd = value.matches;
      }
    );
  }

  ngOnInit() {

    // const initialValue = await this.flightService.flightLocations(this.control.value, this.languageCode, this.portalId).toPromise();
    const that = this;

    // abc
    this.filteredOptions = this.control.valueChanges
      .pipe(
        // startWith(''),
        // map(value => this._filter(value))
        tap(x => {
          that.onChangedFn(x);
        }),
        filter(value => value.length >= that.minLength),
        distinctUntilChanged(),
        debounceTime(300),
        tap(x => this.loading.next(true)),
        switchMap(value => {
          return this.autocompleteFn(
            value,
            this.appService.language.getValue(),
            this.firstAutocomplete
          ).pipe(
            tap(x => this.loading.next(false))
          );
        })
      ) as Observable<any>;

    this.control.valueChanges.subscribe(x => {
      if (x != null && typeof x === 'object') {
        this.hint = x.LOCATIONTYPE === 'C' ? (x.CITYNAME + '(All)') : x.AIRPORTNAME;
        this.mobileHint = x;
        that.onChangedFn(x);
      } else {
        this.hint = '';
        this.mobileHint = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onOptionSelected(e: any) {
    this.autoCompleteClosed.next(true);
  }

  onChangedFn: (any) => void = () => {
    // tslint:disable-next-line:semicolon
  };
  onTouchedFn: () => void = () => {
    // tslint:disable-next-line:semicolon
  };

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChangeTriggerFn = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    control.statusChanges.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
      if (value === 'INVALID') {
        if (!this.control.touched) {
          this.control.markAsDirty();
          this.control.markAsTouched();
          this.control.updateValueAndValidity();
        }
      }
    });
    return null;
  }

  registerOnChange(fn: any): void {
    this.onChangedFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  writeValue(val: any): void {
    this.control.setValue(val);
    // this.onChangedFn(val);
    this.hint = val
      ? (val.LOCATIONTYPE === 'C'
        ? (val.CITYNAME + '(All)')
        : (val.AIRPORTNAME))
      : '';
  }

  displayFn(option: any): string {
    return option ? option.CITYNAME || option.VALUE : '';
  }

  onAutoCompleteClicked() {

    this.dialogRef = this.dialog.open(FormDialogComponent, {
      // height: '100vh',
      width: '90%',
      maxHeight: '100%',
      disableClose: true,
      position: {top: '5vw', bottom: '5vw'},
      maxWidth: '100vw',
      panelClass: 'dialog-without-padding',
      data: {
        mode: this.mode === 'Flight' ? 'flight-autocomplete' : 'transfer-autocomplete',
        header: this.firstAutocomplete ? 'LBL_FROM' : 'LBL_TO',
        placeholder: 'LBL_FLIGHT_PLACEHOLDER',
        value: this.control.value,
        firstAutocomplete: this.firstAutocomplete,
        autoCompleteFn: this.autocompleteFn
      } as FormDialogData
    });

    this.dialogRef.afterClosed().subscribe(value => {
      this.control.setValue(value);
    });
  }
}
