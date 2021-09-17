import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClicktocallComponent } from './clicktocall.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared';
import { IntlPhoneInputModule } from '../../custom-form-controls/intl-phone-input';
import { MatInputModule } from '@angular/material/input';


const clickToCallExports = [
  ClicktocallComponent
];


@NgModule({
  declarations: [
    clickToCallExports,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    SharedModule,
    IntlPhoneInputModule,
    MatInputModule,
  ],
  exports: clickToCallExports,
  entryComponents: clickToCallExports
})
export class ClicktocallModule {
}
