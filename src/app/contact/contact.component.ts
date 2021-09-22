import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { BasketService } from '../services/basket.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ContactComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ContactComponent),
    multi: true
  }]
})
export class ContactComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  isDestroy$ = new Subject();

  noteControl = new FormControl();

  formGroup: FormGroup;

  onChangeFn = (v: any) => { };

  onTouchedFn = () => { };

  onValidatorChangeFn = () => { };

  constructor(
    formBuilder: FormBuilder,
    private basketService: BasketService
  ) {
    this.formGroup = formBuilder.group({
      Name: '',
      Surname: '',
      Email: '',
      Address: '',
      City: '',
      Country: '',
      Phone: ['', Validators.required],
      ZipCode: '',
      Tc: '',
      VoucherNo: '',
      HCRID: ''
    });

    this.formGroup.valueChanges.pipe(
      startWith(this.formGroup.value),
      takeUntil(this.isDestroy$)
    ).subscribe(value => {
      this.onChangeFn(value);
      // this.onValidatorChangeFn();
      const basket = this.basketService.basket;
      for (const [k, v] of Object.entries(value)) {
        if (v === '' || v === null || String(v).trim() === '') {
          continue;
        }
        basket.Profile[k] = v;
        (basket.Items.HotelItems || []).forEach(x => {
          if (Array.isArray(x?.Person) && x.Person.length > 0) {
            x.Person[0][k] = v;
          }
        });
      }
    });
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.formGroup.invalid ? this.formGroup.errors || { required: true } : null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChangeFn = fn;
  }

  writeValue(obj: any): void {
    if (obj && typeof obj === 'object') {
      this.formGroup.patchValue(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formGroup.disable() : this.formGroup.enable();
  }

  ngOnDestroy(): void {
    this.isDestroy$.next();
    this.isDestroy$.complete();
  }

  ngOnInit(): void {
    this.noteControl.valueChanges.pipe(
      takeUntil(this.isDestroy$)
    ).subscribe(note => {
      const basket = this.basketService.basket;
      basket.Profile.Note = note;
    });
  }

}
