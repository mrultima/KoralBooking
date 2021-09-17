import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface AgreementDialogData {
  content: string;
  header: string;

}

@Component({
  selector: 'ta-core-agreement-dialog',
  templateUrl: './agreement-dialog.component.html',
  styleUrls: ['./agreement-dialog.component.scss']
})
export class AgreementDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AgreementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AgreementDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
