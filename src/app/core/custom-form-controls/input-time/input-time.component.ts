import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'ta-core-input-time',
  templateUrl: './input-time.component.html',
  styleUrls: ['./input-time.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputTimeComponent),
    multi: true
  }]
})
export class InputTimeComponent implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() required: boolean;
  formControl = new FormControl();

  onTouchedFn: () => void;
  onChangedFn: (any) => void;

  disabledStateSet = false;

  constructor() {
  }

  ngOnInit() {
  }

  registerOnChange(fn: any): void {
    this.onChangedFn = fn;
    this.formControl.valueChanges.subscribe(value => {
      if (this.disabledStateSet) {
        this.disabledStateSet = false;
        return;
      }
      const momentTime = moment(value, 'HH:mm');
      if (momentTime.isValid()) {
        this.onChangedFn(momentTime.format('YYYY-MM-DD HH:mm:ss'));
      } else {
        this.onChangedFn(null);
      }
    });
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledStateSet = true;
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  writeValue(obj: any): void {
    if (obj == null) {
      this.formControl.setValue(null);
    } if (typeof obj === 'string' && obj !== '' && moment(obj, moment.ISO_8601, true).isValid()) {
      if (obj.startsWith('1900')) {
        obj = obj.replace('1900', '' + moment().year());
      }
      this.formControl.setValue(moment(obj).format('HH:mm'));
    }
  }

}
