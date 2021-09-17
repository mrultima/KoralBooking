import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

const PaginationExports = [
  PaginationComponent
];

@NgModule({
  declarations: PaginationExports,
  imports: [
    CommonModule,
    MatPaginatorModule,
  ],
  exports: PaginationExports,
  providers: [
    {provide: MatPaginatorIntl, useClass: PaginationComponent},
  ]
})
export class PaginationModule {
}
