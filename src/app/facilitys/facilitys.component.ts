import { Component, OnInit } from '@angular/core';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api.service';
import { HotelConfig } from '../types';

@Component({
  selector: 'app-facilitys',
  templateUrl: './facilitys.component.html',
  styleUrls: ['./facilitys.component.css']
})
export class FacilitysComponent implements OnInit {

  hidedetail = false;
  facilityData:HotelConfig;
  
  constructor(public apiService: ApiService) {}


  async ngOnInit() {
    
    const resp = await this.apiService.minimalGetHotelConfig(false,"")
    if(resp){
      this.facilityData = resp
    }
    console.log(resp,  "resp")


    // this.apiService.hotelConfig$.subscribe(facility => {
    //   if (facility){
    //     this.apiService.hotelFacilities.next(facility)

    //     console.log("------------- "+this.apiService.hotelFacilities.value._Amenitys);

    //   }
    // });
  }

  typeOf(str: any): boolean { 
    return str === 'string';
  }
  onClick(item :any){
    console.warn(item)
  }

 



}
