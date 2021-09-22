import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from '../api.service';
import { AppService } from '../services/app.service';
import { BasketService } from '../services/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  moment = moment;

  constructor(
    public basketService: BasketService,
    public apiService: ApiService,
    public appService: AppService
  ) { }

  ngOnInit(): void {
  }

  ngForEmptyArrayGenerator(val: number) {
    if (val === undefined || val === null) {
      return [];
    }
    return Array(Math.floor(Math.abs(+val)));
  }

  alert(text) {
    alert(text);
  }

}
