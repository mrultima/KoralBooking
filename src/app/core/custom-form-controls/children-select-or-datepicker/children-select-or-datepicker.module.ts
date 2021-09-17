import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared';
import { ReactiveFormsModule } from '@angular/forms';
import { ChildrenSelectOrDatepickerComponent } from './children-select-or-datepicker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DatepickerModule } from '../../custom-form-controls/datepicker';
import { MatButtonModule } from '@angular/material/button';


const childrenSelectOrDatepickerExports = [
  ChildrenSelectOrDatepickerComponent
];

@NgModule({
  declarations: childrenSelectOrDatepickerExports,
  imports: [
    CommonModule,
    MatFormFieldModule,
    OverlayModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    SharedModule,
    DatepickerModule,
    MatButtonModule,
  ],
  exports: childrenSelectOrDatepickerExports
})
export class ChildrenSelectOrDatepickerModule {
}
