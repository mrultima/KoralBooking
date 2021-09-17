import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SnapPhotoModule } from '../../components/snap-photo/snap-photo.module';
import { SimpleDialogComponent } from './simple-dialog/simple-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SimpleDialog } from './simple-dialog';

@NgModule({
    declarations: [
        SimpleDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SnapPhotoModule,
        MatDialogModule
    ],
    exports: [
        SimpleDialogComponent
    ],
    entryComponents: [
        SimpleDialogComponent
    ],
    providers: [
        SimpleDialog
    ]
})
export class SimpleDialogModule {
}
