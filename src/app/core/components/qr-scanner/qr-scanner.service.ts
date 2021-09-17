import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { QrScannerComponent } from './qr-scanner.component';

@Injectable({
    providedIn: 'root'
})
export class QrScannerService {

    constructor(
        public matDialog: MatDialog
    ) { }

    scan(dialogConfig?: MatDialogConfig): Observable<any> {
        const defConfig: MatDialogConfig = {
            width: 'auto',
            height: 'auto',
            maxHeight: '90vh',
            disableClose: true
        };
        if (dialogConfig) {
            dialogConfig = { ...defConfig, ...dialogConfig }
        } else {
            dialogConfig = defConfig;
        }
        return this.matDialog.open(QrScannerComponent, dialogConfig).afterClosed();
    }
}