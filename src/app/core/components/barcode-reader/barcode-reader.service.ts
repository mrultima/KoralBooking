import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { BarcodeReaderComponent } from "./barcode-reader.component";

@Injectable({
    providedIn: 'root'
})
export class BarcodeReaderService {

    constructor(
        public matDialog: MatDialog
    ) { }

    reader(dialogConfig?: MatDialogConfig): Observable<any> {
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
        return this.matDialog.open(BarcodeReaderComponent, dialogConfig).afterClosed();
    }
}