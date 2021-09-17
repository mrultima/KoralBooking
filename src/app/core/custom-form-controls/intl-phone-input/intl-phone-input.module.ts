import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntlPhoneInputComponent } from './intl-phone-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

const intlPhoneInputComponentExports = [
  IntlPhoneInputComponent,
];

@NgModule({
  declarations: intlPhoneInputComponentExports,
  imports: [
    CommonModule,
    MatFormFieldModule,
    Ng2TelInputModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: intlPhoneInputComponentExports
})
export class IntlPhoneInputModule {
}
