import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';

import { map, share, shareReplay, takeUntil } from 'rxjs/operators';
import { HotelConfig, Rooms, SearchParams } from './types';



@Injectable({
  providedIn: 'root'
})

export class ApiService {
  hotelConfig$ = this.getHotelConfig().pipe(shareReplay());
  rooms$ = new BehaviorSubject<Rooms>([]);

  searchFormGroup = new FormGroup(
    {
      ADULT: new FormControl(2),
      CHECKIN: new FormControl(new Date()),
      CHECKOUT: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2)),
      DAYS: new FormControl(1),
      CHILDAGES: new FormControl(0),
      COUNTRYCODE: new FormControl(''),
      CURRENCY: new FormControl(''),
      HOTELID: new FormControl(null),
      IPADDRESS: new FormControl(''),
      LANGUAGE: new FormControl(''),
      PORTALID: new FormControl(1),
      PORTALSELLERID: new FormControl(null),
      PROMOCODE: new FormControl(''),
      SESSION: new FormControl(null),
    }
  )

  constructor(
    public http: HttpClient
  ) { }

  apiReq(body: any): Observable<any> {
    return this.http.post('https://4001.hoteladvisor.net', body)
  }

  getHotelConfig(): Observable<HotelConfig> {
    return this.apiReq({
      Action: 'Execute',
      Object: 'SP_HOTEL_BOOKINGPARAMS',
      Parameters: {
        SUBDOMAIN: 'dev-hotel'
      }
    }).pipe(
      map((response: any) => {
        response[0][0].photos = response[1];
        return response[0][0];
      })
    )
  }
  getRooms(params: SearchParams): Observable<Rooms> {
    return this.apiReq({
      Action: 'Execute',
      Object: 'SP_PORTALV4_HOTELDETAILPRICE',
      Parameters: params
    }).pipe(
      map((response: any) => {
        //response[0][0].photos = response[1];
        return response[0];
      })
    )
  }

  onSearch(): void {
    console.log(this.searchFormGroup.value);
    this.getRooms(this.searchFormGroup.value)
      .subscribe((response) => {
      this.rooms$.next(response);
    }
    );
  }
}
