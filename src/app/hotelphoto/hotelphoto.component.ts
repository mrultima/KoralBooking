import { Component, OnInit } from '@angular/core';
import { timeoutWith } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { HotelConfig, HotelPhoto } from '../types';


@Component({
  selector: 'app-hotelphoto',
  templateUrl: './hotelphoto.component.html',
  styleUrls: ['./hotelphoto.component.css']
})
export class HotelphotoComponent implements OnInit {

  photos: HotelPhoto[] = [];
  selectedPhoto: String = "";


  constructor(public apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.hotelConfig$.subscribe((val) => {this.photos = val.photos});  
    this.apiService.hotelConfig$.subscribe((val) => {this.selectedPhoto = val.Image}); 
 }

  
  selectPhoto(p: HotelPhoto){
    this.selectedPhoto = p.URL;
    this.photos.find(p=>p.DEFAULTIMAGE) || this.photos[0];
  }


}
