import { Directive, ElementRef, Host, OnDestroy, OnInit, Optional, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { TranslateService } from '../services/translate.service';

export interface ErrorCasesFnTypeResult {
  args?: { [k: string]: string };
  key: string;
}

export type ErrorCasesFnType = (a: any) => ErrorCasesFnTypeResult

const errorCases: { [k: string]: string | ErrorCasesFnType } = {
  'required': 'MSG_REQUIRED',
  'email': 'MSG_INVALID_EMAIL',
  'minlength': errBody => {
    return { args: { requiredLength: errBody.requiredLength }, key: 'LBL_MIN_LENGTH' };
  },
  'maxlength': errBody => {
    return { args: { requiredLength: errBody.requiredLength }, key: 'LBL_MAX_LENGTH' };
  },
  'invalidCC': 'MSG_INVALID_CC',
  'invalidTC': 'MSG_INVALID_TC',
  'invalidPHONE': 'MSG_INVALID_PHONE',
  // 'invalidCC': 'Hatalı kimlik numarası girdiniz.',
  // 'invalidCC': 'Invalid credit card number.',
  // 'customPattern': errBody => errBody.message,
  // 'match': errBody => errBody.message ? errBody.message : 'Değerler eşleşmiyor.',
};

export function printErrors(errors: {}): Array<string | ErrorCasesFnTypeResult> {
  const result: Array<string | ErrorCasesFnTypeResult> = [];
  for (const [error, message] of Object.entries(errors)) {
    const res = errorCases[error];
    if (res) {
      if (typeof res === 'function') {
        result.push({ args: res(message).args, key: res(message).key });
      } else {
        result.push({ key: res });
      }
    }
  }
  return result;
}

@Directive({
  selector: '[taCoreError]'
})
export class ErrorDirective implements OnInit, OnDestroy {

  formControl: NgControl;
  isDestroyed = new Subject();

  constructor(
    @Optional() @Host() private parent: MatFormField,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private appService: AppService,
    private translateService: TranslateService,
  ) {

  }

  ngOnInit(): void {
    if (this.parent) {
      if (this.parent._control && this.parent._control.ngControl) {
        this.formControl = this.parent._control.ngControl;
        this.writeErrors();
        this.formControl?.statusChanges?.pipe(takeUntil(this.isDestroyed)).subscribe(status => {
          this.writeErrors();
        });
        this.appService.language.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
          this.writeErrors();
        });
      }
    }
  }

  writeErrors() {
    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', this.printErrors());
  }

  printErrors(): string {
    const errors = this.formControl.errors;
    if (!errors) {
      return '';
    }
    return printErrors(errors).map(value => {
      if (typeof value === 'string') {
        return this.translateService.getKey(value);
      } else {
        /* const arr = [];
        if (value.args) {
          for (const key of Object.keys(value.args)) {
            arr.push({key: key});
          }
        } */
        return this.translateService.transform(value.key, value.args);
      }
    }).join('<br>');
  }

  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }
}
