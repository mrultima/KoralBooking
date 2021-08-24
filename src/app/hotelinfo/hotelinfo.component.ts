import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HotelConfig } from '../types';

@Component({
  selector: 'app-hotelinfo',
  templateUrl: './hotelinfo.component.html',
  styleUrls: ['./hotelinfo.component.css']
})
export class HotelinfoComponent implements OnInit {
  HotelInfo: any = [];
  
  constructor(public apiService:ApiService) { }

  ngOnInit(): void {
    this.apiService.hotelConfig$.subscribe(HotelInfo=>{
      this.HotelInfo = HotelInfo})
  }
 
}