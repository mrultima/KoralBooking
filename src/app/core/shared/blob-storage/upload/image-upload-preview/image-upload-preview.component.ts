import { Component, Input, ViewChild, TemplateRef } from "@angular/core";
import { ImageUploadComponent } from "../image-upload/image-upload.component";
import { FileHolder } from "../file-holder";
import { Subscription, fromEvent } from "rxjs";
import { SimpleDialog } from '../../../../shared/simple-dialog/simple-dialog';

enum KEYCODE { LEFT = 37, RIGHT = 39 }

@Component({
    selector: 'image-upload-preview',
    templateUrl: './image-upload-preview.component.html',
    styleUrls: ['./image-upload-preview.component.scss']
})
export class ImageUploadPreviewComponent {

    @Input() ref: ImageUploadComponent;
    @ViewChild('previewTpl', { read: TemplateRef }) previewTpl: TemplateRef<any>;
    @ViewChild('captionTpl', { read: TemplateRef }) captionTpl: TemplateRef<any>;

    current: FileHolder;
    keyEvent: Subscription;

    constructor(
        private dialog: SimpleDialog
    ) { }

    preview(e: Event, file: FileHolder): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialog.open({
            maxWidth: '80%',
            autoFocus: false
        });
        this.keyEvent = fromEvent(window, 'keyup').subscribe(this.navigateKeyboard.bind(this));
        this.dialog.dialogRef.afterClosed().subscribe(() => {
            this.keyEvent.unsubscribe();
        });
        this.current = file;
        this.dialog.content(this.previewTpl);
    }

    navigatePreview(t: number): void {
        const total = this.ref.files.length,
            index = this.ref.files.indexOf(this.current);
        let nIndex = t ? index + 1 : index - 1;
        if (nIndex < 0) nIndex = total - 1;
        if (nIndex >= total) nIndex = 0;
        this.current = this.ref.files[nIndex];
    }

    navigateKeyboard(e: KeyboardEvent): void {
        if (e.keyCode in KEYCODE) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (e.keyCode == KEYCODE.LEFT) {
            this.navigatePreview(0);
        } else if (e.keyCode == KEYCODE.RIGHT) {
            this.navigatePreview(1);
        }
    }

    closePreview(): void { this.dialog.close(); }

    caption(e: Event, file: FileHolder): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialog.open({
            maxWidth: '80%',
            minWidth: '320px'
        });
        this.dialog.content(this.captionTpl, {
            $implicit: file
        });
    }

    saveCaption(e: Event, file: FileHolder, caption: string): void {
        e.preventDefault();
        file.caption = caption.trim();
        this.dialog.close();
    }
}