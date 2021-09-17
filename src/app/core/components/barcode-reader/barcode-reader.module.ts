import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarcodeReaderComponent } from './barcode-reader.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@travelaps/core/shared';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    SharedModule,
    MatButtonModule
  ],
  declarations: [BarcodeReaderComponent],
  exports: [BarcodeReaderComponent]
})
export class BarcodeReaderModule { }
