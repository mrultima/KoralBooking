import { Injectable, TemplateRef, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SimpleDialogComponent } from './simple-dialog/simple-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class SimpleDialog {

  defConfig: MatDialogConfig = {
    minWidth: '240px',
    minHeight: '100px',
  };

  dialogRef: MatDialogRef<SimpleDialogComponent>;

  componentRef: SimpleDialogComponent;

  constructor(
    public matDialog: MatDialog,
  ) {
  }

  open(config?: MatDialogConfig): SimpleDialogComponent {
    if (!config) {
      config = this.defConfig;
    }
    config.data = this;
    this.dialogRef = this.matDialog.open(SimpleDialogComponent, config);
    this.componentRef = this.dialogRef.componentInstance;
    return this.componentRef;
  }

  close(param?) {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.close(param);
  }

  dialog() {
    return this.matDialog;
  }

  content(...args: Array<any>) {
    if (args.length) {
      const t = args[0];
      if (t instanceof TemplateRef) {
        return this.componentRef.template.apply(this.componentRef, args);
      } else if (t instanceof Type) {
        return this.componentRef.component.apply(this.componentRef, args);
      } else {
        return this.componentRef.html.apply(this.componentRef, args);
      }
    }
    return this.componentRef;
  }
}
