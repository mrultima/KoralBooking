import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { SharedModule } from '../../shared';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { NouisliderModule } from 'ng2-nouislider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';


const filterExports = [
  FilterComponent
];


@NgModule({
  declarations: filterExports,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatCheckboxModule,
    FormsModule,
    MatFormFieldModule,
    MatBadgeModule,
    NouisliderModule,
    MatTooltipModule,
    MatInputModule,
  ],
  exports: filterExports
})
export class FilterModule {
}
