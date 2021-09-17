import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleAutocompleteComponent } from './google-autocomplete.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


const googleAutocompleteExports = [
  GoogleAutocompleteComponent
];

@NgModule({
  declarations: googleAutocompleteExports,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  exports: googleAutocompleteExports
})
export class GoogleAutocompleteModule {
}
