import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HotelConfig, HotelPhoto } from '../types';

@Component({
  selector: 'app-hotelphoto',
  templateUrl: './hotelphoto.component.html',
  styleUrls: ['./hotelphoto.component.css']
})
export class HotelphotoComponent implements OnInit {


  selectedPhoto = this.apiService.hotelConfig.photos?.[0].URL;

  constructor(public apiService: ApiService) { }

  ngOnInit(): void {

  }

}
