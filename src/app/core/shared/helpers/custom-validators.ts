import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export class CustomValidators {

  private static removeError(control: AbstractControl, errorKey) {
    if (control.errors && control.errors[errorKey]) {
      delete control.errors[errorKey];
      if (Object.keys(control.errors).length === 0) {
        control.setErrors(undefined);
      } else {
        control.setErrors(control.errors);
      }
    }
  }

  private static appendError(control, errorKey, errorBody) {
    if (!control.errors) {
      control.setErrors({ [errorKey]: errorBody });
    } else {
      control.errors[errorKey] = errorBody;
      control.setErrors(control.errors);
    }
  }

  static pattern(pattern: string, message: string) {
    const abc = function (control: AbstractControl) {
      if (!control) {
        return;
      }
      const error = Validators.pattern(pattern)(control);
      if (!error) {
        return;
      }
      error.pattern['message'] = message;
      const ret = {
        customPattern: error.pattern
      };
      return ret;
    };

    return abc;
  }

  static match(formControlName1: string, formControlName2: string, message?: string) {
    const abc = function (control: AbstractControl) {
      if (!control || !control.get || typeof control.get !== 'function') {
        return;
      }
      const control1 = control.get(formControlName1);
      const control2 = control.get(formControlName2);
      if (!control1 || !control2) {
        return;
      }

      if (!control1.dirty || !control2.dirty) {
        return;
      }

      if (control1.value === control2.value) {
        CustomValidators.removeError(control1, 'match');
        CustomValidators.removeError(control2, 'match');
        return;
      }
      const err = {
        [formControlName1]: control1.value,
        [formControlName2]: control2.value,
        message: message
      };

      CustomValidators.appendError(control1, 'match', err);
      CustomValidators.appendError(control2, 'match', err);
      return null;
    };
    return abc;
  }

  static phone() {
    const abc = (control: AbstractControl): { [key: string]: any } | null => {
      let isValid = false;

      if (control.value && control.value.length === 13) {
        isValid = true;
      }

      return isValid ? null : { 'invalidPHONE': { value: control.value } };
    };
    return abc;
  }

  static isValueObject(isEmptyStrPassable = false) {
    const abc = (control: AbstractControl): { [key: string]: any } | null => {
      let isValid = false;

      if (control.value != null && typeof control.value === 'object') {
        isValid = true;
      }

      if (isEmptyStrPassable && control.value === '') {
        isValid = true;
      }

      return isValid ? null : { 'invalidValue': { value: control.value } };
    };
    return abc;
  }

  static tc(n = true): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let idNO = 0;
      let isValid = false;

      if (String(control.value).length === 11) {
        for (let i = 0; i < 10; i++) {
          idNO += control.value.substring(i, i + 1) * 1;
        }

        isValid = control.value.substring(10, 11) * 1 === idNO % 10;
      }

      if (!n && (control.value == null || control.value === '')) {
        return null;
      }

      return isValid ? null : { 'invalidTC': { value: control.value } };
    };
  }
}
