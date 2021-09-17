import { Component, Inject, OnInit } from '@angular/core';
import { AppService, BasketService } from '../../../shared';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'ta-core-basket-panel-buylater-dialog',
  templateUrl: './basket-panel-buylater-dialog.component.html',
  styleUrls: ['./basket-panel-buylater-dialog.component.scss']
})
export class BasketPanelBuylaterDialogComponent implements OnInit {
  formGroup = new FormGroup({
    phone: new FormControl(''),
    email: new FormControl('', Validators.email)
  }, this.atLeastFillOneOfThemValidator());

  constructor(
    public appService: AppService,
    public basketService: BasketService,
    @Inject(MAT_DIALOG_DATA) private data: BasketPanelBuylaterDialogComponent,
  ) {
  }

  ngOnInit() {
  }

  public atLeastFillOneOfThemValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const control1 = group.controls['phone'];
      const control2 = group.controls['email'];

      if ((control1.valid && control1.value === '') && (control2.valid && control2.value === '')) {
        return {notFilledOneOfThem: true};
      }

      return;
    };
  }

}
