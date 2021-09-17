import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { SnapPhotoComponent } from "./snap-photo.component";

@Injectable({
    providedIn: 'root'
})
export class SnapPhotoService {

    constructor(
        public matDialog: MatDialog
    ) { }

    photo(dialogConfig?: MatDialogConfig): Observable<any> {
        const defConfig: MatDialogConfig = {
            width: 'auto',
            height: 'auto',
            maxHeight: '90vh'
        };
        if (dialogConfig) {
            dialogConfig = { ...defConfig, ...dialogConfig }
        } else {
            dialogConfig = defConfig;
        }
        return this.matDialog.open(SnapPhotoComponent, dialogConfig).afterClosed();
    }
}