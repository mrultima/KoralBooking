import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared';
import { IntlPhoneInputModule } from '../../custom-form-controls/intl-phone-input';
import { MatInputModule } from '@angular/material/input';
import { NewsletterFormComponent } from './newsletter-form.component';


const newsletterExports = [
  NewsletterFormComponent
];


@NgModule({
  declarations: [
    newsletterExports,
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
  exports: newsletterExports,
  entryComponents: newsletterExports
})
export class NewsletterFormModule {
}
