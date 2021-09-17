import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryComponent } from './country.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {SharedModule} from '../../shared';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CountryComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    CountryComponent
  ]
})
export class CountryModule { }
