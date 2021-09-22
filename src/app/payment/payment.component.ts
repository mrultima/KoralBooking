import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { BasketService } from '../services/basket.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  isLinear = false;
  constructor(
    private basketService: BasketService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    const basket = this.basketService.basket;
    basket.PaymentGate = null;
    basket.PaymentType = [
      {
        Currency: this.appService.currency.getValue(),
        Id: 3,
        Name: '',
        PayableAmount: 0,
        paymentId: null
      }
    ];
  }

}
