import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPanelComponent } from './filter-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../shared';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatSliderModule,
    MatExpansionModule
  ],
  declarations: [FilterPanelComponent],
  exports: [
    FilterPanelComponent
  ]
})
export class FilterPanelModule { }
