import { QrScannerComponent } from './qr-scanner.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [QrScannerComponent],
    exports: [QrScannerComponent],
    entryComponents: [QrScannerComponent],
    imports: [
        CommonModule,
        SharedModule,
        MatButtonModule
    ]
})
export class QrScannerModule {

}