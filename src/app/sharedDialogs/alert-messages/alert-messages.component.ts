import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface AlertData {
  type: string;
  message: string | string[];
  description?: string;
}

@Component({
  selector: 'ta-core-alert-messages',
  templateUrl: './alert-messages.component.html',
  styleUrls: ['./alert-messages.component.css']
})
export class AlertMessagesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AlertMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertData,
  ) {
  }

  ngOnInit() {
    if (!this.data.message) {
      this.data.message = [];
    }
    if (!Array.isArray(this.data.message)) {
      this.data.message = [this.data.message];
    }
    this.data.message = this.data.message.filter(x => !!x);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
