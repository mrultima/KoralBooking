import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Model, ModelFactory } from '@angular-extensions/model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Field } from '../models/basket-model';
import { BasketService } from './basket.service';
import { CustomValidators } from '../helpers/custom-validators';
import { AppService } from './app.service';

export interface BasketContactFields {
  Name: Field;
  Surname: Field;
  Email: Field;
  Address: Field;
  City: Field;
  Country: Field;
  Phone: Field;
  ZipCode: Field;
  Tc: Field;
}

@Injectable({providedIn: 'root'})
export class BasketContactApiService {

  formGroup: FormGroup;

  fields: Model<BasketContactFields>;
  fields$: Observable<BasketContactFields>;
  ekNotVisibility = new BehaviorSubject(false);
  voucherNo = new BehaviorSubject(false);

  constructor(
    private fieldsModelFactory: ModelFactory<BasketContactFields>,
    private basketService: BasketService,
    private appService: AppService
  ) {
    this.fields = this.fieldsModelFactory.create({
      Name: {
        visibility: true,
        validators: ['required']
      },
      Surname: {
        visibility: true,
        validators: ['required']
      },
      Email: {
        visibility: true,
        validators: ['email', 'required']
      },
      Address: {
        visibility: true,
        validators: ['required']
      },
      City: {
        visibility: true,
        validators: ['required']
      },
      Country: {
        visibility: true,
        validators: ['required']
      },
      Phone: {
        visibility: true,
        validators: ['required']
      },
      ZipCode: {
        visibility: true,
        validators: ['required']
      },
      Tc: {
        visibility: true,
        validators: ['required', {name: 'tc'}]
      }
    });
    this.fields$ = this.fields.data$;
    const loginInfo = this.appService.loginUser.getValue();
    this.basketService.basketConfig.subscribe(value => {
      const fields = this.fields.get();
      fields.Name.visibility = value.CONTACT_NAME;
      fields.Surname.visibility = value.CONTACT_SURNAME;
      fields.Email.visibility = value.CONTACT_MAIL;
      fields.Address.visibility = value.CONTACT_ADDRESS;
      fields.City.visibility = value.CONTACT_CITY;
      fields.ZipCode.visibility = value.CONTACT_ZIPCODE;
      fields.Country.visibility = value.CONTACT_COUNTRY;
      fields.Tc.visibility = value.PROFILE_TCCITIZEN_VISIBLE;
      this.ekNotVisibility.next(value.CONTACT_EXTRANOT);
      this.voucherNo.next(loginInfo && value.HOTELVOUCHER_VISIBLE);
      this.fields.set(fields);
    });
  }

  setValidators(fields: BasketContactFields) {
    for (const [fieldName, formControl] of Object.entries(this.formGroup.controls)) {
      if (fields.hasOwnProperty(fieldName) && fields[fieldName].validators.length > 0) {
        if (fields[fieldName].visibility) {
          const result = [];
          for (const validatorName of fields[fieldName].validators) {
            if (validatorName.hasOwnProperty('name')) {
              result.push(CustomValidators[validatorName.name]());
            } else {
              result.push(Validators[validatorName]);
            }
          }
          formControl.setValidators(result);
          formControl.enable();
        } else {
          formControl.disable();
          formControl.clearValidators();
        }
        formControl.updateValueAndValidity();
      }
    }
  }

  // can be extend from parentBasketService?
  pushValidatorTo(fieldName: string, validator: ValidatorFn, fields: BasketContactFields) {
    if (fields.hasOwnProperty(fieldName)) {
      fields[fieldName].validators.push(validator);
    }
  }
}
