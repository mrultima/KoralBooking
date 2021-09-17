import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as _ from 'lodash';

export interface ConfirmationDialogComponentData {
  message?: string;
  icon?: string;
  buttonMode?: 1 | 2;
  buttonMessages?: Array<string>;
  buttonIcon?: Array<string>;
}

@Component({
  selector: 'ta-core-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  message = 'MSG_DO_YOU_WANT_TO_PROCEED';
  icon = 'warning';
  // 1: ok button , 2: cancel and continue 
  buttonMode = 2;
  buttonMessages = ['BTN_CANCEL', 'BTN_CONTINUE'];
  buttonIcon = ['', ''];

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogComponentData,
  ) {
  }

  ngOnInit() {
    if (_.get(this.data, 'message')) {
      this.message = this.data.message;
    }
    if (_.get(this.data, 'icon')) {
      this.icon = this.data.icon;
    }
    if (_.get(this.data, 'buttonMode')) {
      this.buttonMode = this.data.buttonMode;
    }
    if (_.get(this.data, 'buttonMessages')) {
      this.buttonMessages = this.data.buttonMessages;
    }
    if (_.get(this.data, 'buttonIcon')) {
      this.buttonIcon = this.data.buttonIcon;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
