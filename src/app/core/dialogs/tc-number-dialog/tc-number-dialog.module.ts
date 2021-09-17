import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared';
import { TcNumberDialogComponent } from './tc-number-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';


const lightBoxExports = [
  TcNumberDialogComponent
];

@NgModule({
  declarations: lightBoxExports,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: lightBoxExports,
  entryComponents: lightBoxExports
})
export class TcNumberDialogModule {
}
