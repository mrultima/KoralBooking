import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageUploadComponent } from "./upload/image-upload/image-upload.component";
import { FileDropDirective } from "./upload/file-drop.directive";
import { BlobStorageService } from "./azure-storage/blob-storage.service";
import { ImageUploadPreviewComponent } from "./upload/image-upload-preview/image-upload-preview.component";
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { SortablejsModule } from 'ngx-sortablejs';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SnapPhotoModule } from '../../components/snap-photo/snap-photo.module';
import { SimpleDialogModule } from '../simple-dialog/simple-dialog.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '..';

@NgModule({
    declarations: [
        ImageUploadComponent,
        ImageUploadPreviewComponent,
        FileDropDirective
    ],
    imports: [
        CommonModule,
        SharedModule,
        Ng2ImgMaxModule,
        SortablejsModule.forRoot({ animation: 150 }),
        FormsModule,
        ReactiveFormsModule,
        SnapPhotoModule,
        SimpleDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatTooltipModule,
        SharedModule,
    ],
    exports: [
        ImageUploadComponent,
        ImageUploadPreviewComponent,
        FileDropDirective
    ],
    entryComponents: [
        ImageUploadComponent,
        ImageUploadPreviewComponent
    ],
    providers: [
        BlobStorageService,
    ]
})
export class BlobStorageModule { }
