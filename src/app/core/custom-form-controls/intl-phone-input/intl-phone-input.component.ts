import { Attribute, ChangeDetectorRef, Component, DoCheck, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { BehaviorSubject, Subject, Subscription, merge, zip } from 'rxjs';
import { AppService, TranslateService } from '../../shared';
import { takeUntil } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';
import { Ng2TelInput } from 'ng2-tel-input';

@Component({
  selector: 'ta-core-intl-phone-input',
  templateUrl: './intl-phone-input.component.html',
  styleUrls: ['./intl-phone-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IntlPhoneInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IntlPhoneInputComponent),
      multi: true
    }
  ]
})
export class IntlPhoneInputComponent implements OnInit, OnDestroy, DoCheck, ControlValueAccessor, Validator {

  @Input() formControl = new FormControl('');
  hint = new BehaviorSubject('');
  // error = new BehaviorSubject(false);
  @Input() placeholder;
  @Input() phoneRequired = false;
  @Input() requiredLabel = '';
  @Input() color: ThemePalette = 'primary';
  @Input() formControlName: string;
  @Output() onBlur = new EventEmitter();
  @Input() appearance: string;
  disabled: boolean = false;

  @ViewChild(Ng2TelInput, { static: true }) ng2TelInput: Ng2TelInput;

  val = new BehaviorSubject(null);
  statusRef: Subscription;

  defCountry = new BehaviorSubject('TR');
  isDestroyed = new Subject();
  validatorChangeTriggerFn: () => void;

  onChangeFn = (value: any) => { };
  onTouchedFn = () => { alert(123); };

  constructor(
    public appService: AppService,
    public cdr: ChangeDetectorRef,
    public translateService: TranslateService,
    @Attribute('autocomplete') public autocomplete: string,
    @Optional() public controlContainer: ControlContainer
  ) {
    if (controlContainer && controlContainer.hasOwnProperty('ngSubmit')) {
      controlContainer['ngSubmit'].pipe(takeUntil(this.isDestroyed)).subscribe(vaa => {
        this.formControl.markAsDirty();
        this.formControl.markAsTouched();
        this.formControl.updateValueAndValidity();
      });
    }
    // this.error.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
    //   if (this.validatorChangeTriggerFn) {
    //     this.validatorChangeTriggerFn();
    //   }
    // });
  }

  ngOnInit() {
    if (this.phoneRequired) {
      this.formControl.setValidators(Validators.required);
      this.formControl.updateValueAndValidity();
    }
    // this.appService.defCountry.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
    //     this.defCountry.next(value);
    //     this.cdr.detectChanges();
    // });

    /* if (this.controlContainer && this.controlContainer.control && this.formControlName) {
      const c = this.controlContainer.control.get(this.formControlName);
      if (c) {
        this.formControl = <FormControl>c;
      }
    } */
    // this.formControl.valueChanges.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
    //   if (this.ng2TelInput.ngTelInput.isValidNumber()) {
    //     this.onChangeFn(this.ng2TelInput.ngTelInput.getNumber());
    //     this.error.next(false);
    //   } else if (!this.phoneRequired && (value === null || value === '')) {
    //     this.error.next(false);
    //     this.onChangeFn(null);
    //   } else {
    //     this.onChangeFn(value);
    //     this.error.next(true);
    //   }
    // });
  }

  ngDoCheck() {
    if (this.formControl.touched) {
      return;
    }
    const container = this.controlContainer as any;
    if (this.formControlName && container?.form?.controls[this.formControlName] instanceof AbstractControl) {
      container?.form?.controls[this.formControlName]?.touched && this.formControl.markAsTouched();
    } else if (container?.touched) {
      this.formControl.markAsTouched();
    }
  }

  hasError(e: Event = null) {
    /* if (!e) {
      if (!this.phoneRequired && this.formControl.value === '') {
        return;
      }
      this.formControl.setErrors({ hasError: !e });
      this.error.next(true);
      this.onChangeFn('');
    } else {
      this.error.next(false);
      this.formControl.setErrors(null);
    } */
    const errors = this.formControl.errors;
    if (errors && errors.required) {
      this.hint.next(this.translateService.transform('MSG_REQUIRED'));
    } else if (errors && errors.hasError) {
      this.hint.next(this.translateService.transform('MSG_INVALID_PHONE'));
    } else {
      this.hint.next('');
      this.telInputObject(this.ng2TelInput.ngTelInput);
    }
  }

  getNumber(e: any) {
    /* this.val.next(e); */
    this.onChangeFn(e);
  }

  telInputObject(e: any) {
    if (!e) {
      return;
    }
    e.d.customPlaceholder = (x, y) => {
      const prefix = this.translateService.data['LBL_EXAMPLE'];
      if (prefix) {
        x = prefix + ' ' + x;
      }
      this.hint.next(x);
      return '';
    };
    //   const needed = this.appService.defCountry.getValue();
    //   e.setCountry('us');
    //   e.setCountry(needed);
  }

  ngOnDestroy(): void {
    if (this.statusRef) {
      this.statusRef.unsubscribe();
    }
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  writeValue(obj: any): void {
    if (/* obj &&  */obj !== this.formControl.value) {
      this.formControl.setValue(obj);
    }
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChangeTriggerFn = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    let errors = null;
    if (this.phoneRequired && (control.value === '' || control.value === null)) {
      errors = { 'required': true }
    };
    if ( control.value && this.ng2TelInput.ngTelInput && !this.ng2TelInput.ngTelInput?.isValidNumber(control.value) ) {
      errors = { 'hasError': true }
    };
    this.formControl.setErrors(errors);
    this.hasError();
    return errors;
  }

  onCountryChange(e: any) {
    const a = Object.values(e);
    this.appService.defCountry.next(a[1] as string);
  }
}
