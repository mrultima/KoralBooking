import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared';

const PaginatorExports = [
  PaginatorComponent
];

@NgModule({
  declarations: PaginatorExports,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    SharedModule,
  ],
  exports: PaginatorExports
})
export class PaginatorModule {
}
