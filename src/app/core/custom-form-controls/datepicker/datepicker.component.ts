import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS, ControlContainer
} from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { AppService } from '../../shared';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';




@Component({
  selector: 'ta-core-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() label: string;
  @Input() filter;
  @Input() mode: MatFormFieldAppearance = 'outline';
  @Input() color: ThemePalette = 'primary';
  @Input() hint;
  @Input() age;
  @Input() inDate;
  @Output() valueChanges = new EventEmitter();
  @Input() startView: 'month' | 'year' | 'multi-year' = 'month';


  control = new FormControl();
  statusRef: Subscription;
  ageRef: Subscription;
  error = new BehaviorSubject(false);
  maxDate: BehaviorSubject<Date> = new BehaviorSubject(null);
  minDate: BehaviorSubject<Date> = new BehaviorSubject(null);
  ageValue: BehaviorSubject<any> = new BehaviorSubject(null);

  validatorChangeTriggerFn: () => void;

  constructor(
    public appService: AppService,
    @Optional() controlContainer: ControlContainer
  ) {
    if (controlContainer && controlContainer.hasOwnProperty('ngSubmit')) {
      controlContainer['ngSubmit'].subscribe(vaa => {
        this.control.markAsDirty();
        this.control.markAsTouched();
        this.control.updateValueAndValidity();
      });
    }

    this.error.subscribe(value => {
      if (this.validatorChangeTriggerFn) {
        this.validatorChangeTriggerFn();
      }
    });
  }

  ngOnInit() {
    if (this.filter) {
      this.arrowfilter = this.filter;
    }

    this.ageRef = this.ageValue.subscribe(age => {
      if (age) {
        age = +age;
        const date = this.inDate ? this.inDate : Date.now();
        const startDate = new Date(moment(date).add(-(age + 1), 'year').add(1, 'day').format('YYYY-MM-DD'));
        const endDate = new Date(moment(date).add(-(age !== 120 ? age : 1), 'year').add(-1, 'day').format('YYYY-MM-DD'));
        if (startDate !== this.minDate.getValue()) {
          this.minDate.next(startDate);
          this.maxDate.next(endDate);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.statusRef) {
      this.statusRef.unsubscribe();
    }

    if (this.ageRef) {
      this.ageRef.unsubscribe();
    }
  }

  arrowfilter = (d: Date): boolean => {
    return moment(d).startOf('day').diff(moment().startOf('day')) < 0;
    // tslint:disable-next-line:semicolon
  };

  public onChangeFn(fn: any) {
  }

  public onTouchedFn() {
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
    this.control.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
      fn(value);
      this.valueChanges.emit(value);
    });
  }

  registerOnTouched(fn: any): void {
    if (this.age) {
      this.ageValue.next(this.age);
    } else {
      this.minDate.next(null);
      this.maxDate.next(null);
    }
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  writeValue(obj: any): void {
    this.control.setValue(obj);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.statusRef) {
      this.statusRef = control.statusChanges.subscribe(value => {
        this.control.setErrors(control.errors);
        if (control.touched) {
          this.control.markAsTouched();
        }
      });
    }
    this.control.setValidators(control.validator.bind(this));
    return null;
  }
}
