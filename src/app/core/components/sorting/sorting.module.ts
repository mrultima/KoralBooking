import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingComponent } from './sorting.component';
import { SharedModule } from '../../shared';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';


const sortingExports = [
  SortingComponent,
];

@NgModule({
  declarations: sortingExports,
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  exports: sortingExports
})
export class SortingModule {
}
