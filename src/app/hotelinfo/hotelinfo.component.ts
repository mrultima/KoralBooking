import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api.service';
import { HotelConfig, HotelItem } from '../types';

@Component({
  selector: 'app-hotelinfo',
  templateUrl: './hotelinfo.component.html',
  styleUrls: ['./hotelinfo.component.css']
})
export class HotelinfoComponent implements OnInit {

  hotelInfo$ = new BehaviorSubject<HotelConfig | null>(null);

  constructor(public apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.hotelConfig$.subscribe(info => {
      if(info){
        this.hotelInfo$.next(info)
      }});
  }

}
