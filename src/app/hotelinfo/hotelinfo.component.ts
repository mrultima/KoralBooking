import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api.service';
import { HotelConfig, HotelItem } from '../types';
import { MatDialog } from '@angular/material/dialog';
import { YandexMapComponent, YandexMapDialogData } from '../yandex-map/yandex-map.component';
@Component({
  selector: 'app-hotelinfo',
  templateUrl: './hotelinfo.component.html',
  styleUrls: ['./hotelinfo.component.css']
})
export class HotelinfoComponent implements OnInit {

  hotelInfo$ = new BehaviorSubject<HotelConfig | null>(null);
  

  constructor(public apiService: ApiService,
    public matDialog: MatDialog,) {

  }

  ngOnInit(): void {
    this.apiService.hotelConfig$.subscribe(info => {
      if (info) {
        this.hotelInfo$.next(info)
      }
    });
  }
  showMap() {
    const config= this.apiService.hotelConfig$.subscribe((map)=>  map.Longitude && map.Latitude)
    this.matDialog.open(YandexMapComponent, {
      height: '70%',
      width: '70%',//this.ltmd ? '95%' : '70%',
      maxWidth: '95vw',
      data: {
        initialCoordinates: [this.hotelInfo$.value?.Latitude, this.hotelInfo$.value?.Longitude],
        objects: [{
          
          coordinates: [this.hotelInfo$.value?.Latitude, this.hotelInfo$.value?.Longitude],
          PhotoUrl: this.hotelInfo$.value?.Image,
          ErsId: this.hotelInfo$.value?.ErsId,
          Name: this.hotelInfo$.value?.NAME,
          Stars: this.hotelInfo$.value?.Stars
          
        }]
      } as YandexMapDialogData,
    });
    
    
  }

  
  
  


}
