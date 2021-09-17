import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import {
  CustomValidators,
  AppService,
} from '../../shared';

@Component({
  selector: 'app-tc-number-dialog',
  templateUrl: './tc-number-dialog.component.html',
  styleUrls: ['./tc-number-dialog.component.scss']
})
export class TcNumberDialogComponent implements OnInit {

  tcNumber = new FormControl('', [Validators.required, CustomValidators.tc()]);

  constructor(
    public dialogRef: MatDialogRef<TcNumberDialogComponent>,
    private appService: AppService) {
  }

  onNoClick(): void {
    this.dialogRef.close(null);
    this.appService.tcNumberConfirmation.next(false);
  }

  onCompleteClick(): void {

    if (this.tcNumber.value && this.tcNumber.valid) {
      this.appService.tcNumberConfirmation.next(true);
      this.dialogRef.close(this.tcNumber.value);
    }

  }

  ngOnInit(): void {
  }

}
