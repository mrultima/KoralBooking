import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BasketService } from '../services/basket.service';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GuestsComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => GuestsComponent),
    multi: true
  }]
})
export class GuestsComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  isDestroy$ = new Subject();

  form = new FormArray([]);

  onChangeFn = (v: any) => { };

  onTouchedFn = () => { };

  onValidatorChangeFn = () => { };

  constructor(
    public basketService: BasketService
  ) { }

  ngOnInit(): void {
    this.basketService.basket$.pipe(
      takeUntil(this.isDestroy$)
    ).subscribe(basket => {
      const items = basket.Items.HotelItems || [];
      for (let i = this.form.controls.length; i < items.length; i++) {
        const formArray = new FormArray(
          Array.from({ length: items[i].Person.length }, (v, k) => this.guestFormGroup(items[i].Person[k]))
        );
        this.form.push(formArray);
      }
      this.onValidatorChangeFn();
    });

    this.basketService.deleted$.pipe(
      takeUntil(this.isDestroy$)
    ).subscribe(deletedIndex => {
      this.form.removeAt(deletedIndex);
      this.onValidatorChangeFn();
    });

    this.form.valueChanges.pipe(
      takeUntil(this.isDestroy$)
    ).subscribe(value => {
      const items = this.basketService.basket.Items.HotelItems;
      value.forEach((v, i) => {
        v.forEach((d, k) => {
          items[i].Person[k] = d;
        });
      });
      this.onChangeFn(value);
    });
  }

  ngOnDestroy(): void {
    this.isDestroy$.next();
    this.isDestroy$.complete();
  }

  guestFormGroup(value?: any): FormGroup {
    const group = new FormGroup({
      Age: new FormControl(),
      BirthDate: new FormControl(),
      Gender: new FormControl(null, Validators.required),
      HesCode: new FormControl(),
      Name: new FormControl(null, Validators.required),
      PassCard: new FormControl(),
      PassDue: new FormControl(),
      PassNo: new FormControl(),
      Phone: new FormControl(),
      RoomNo: new FormControl(),
      Surname: new FormControl(null, Validators.required),
      Type: new FormControl(),
    });
    if (value) {
      group.patchValue(value);
    }
    return group;
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.form.invalid ? this.form.errors || { required: true } : null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChangeFn = fn;
  }

  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      this.form.patchValue(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

}
