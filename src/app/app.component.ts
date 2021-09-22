import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BasketService } from './services/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('completeTpl', { read: TemplateRef }) completeTpl: TemplateRef<any>;

  formGroup = new FormGroup({
    Contact: new FormControl(null),
    Guest: new FormControl(null)
  });

  constructor(
    public basketService: BasketService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.formGroup);
  }

  async completeRes(): Promise<void> {
    if (this.formGroup.invalid) {
      return;
    }
    let resp;
    try {
      await this.basketService.contactInsert(this.formGroup.value.Contact);
      resp = await this.basketService.completeRes();
    } catch (err) {
      resp = err;
    }
    this.matDialog.open(this.completeTpl, {
      data: resp
    });
  }

}

