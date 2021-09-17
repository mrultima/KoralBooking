import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NationalityComponent} from '../../custom-form-controls/nationality/nationality.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared';

@NgModule({
  declarations: [
    NationalityComponent
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    NationalityComponent
  ]
})
export class NationalityModule { }
