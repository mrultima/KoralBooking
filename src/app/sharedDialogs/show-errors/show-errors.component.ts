import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ShowErrorsData {
  message?: string;
  error?: string;
};

@Component({
  selector: 'app-show-errors',
  templateUrl: './show-errors.component.html'
})
export class ShowErrorsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShowErrorsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShowErrorsData[] | string[]) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
