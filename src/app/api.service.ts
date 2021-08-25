import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { map, share, shareReplay } from 'rxjs/operators';
import { HotelConfig, Rooms, SearchParams } from './types';



@Injectable({
  providedIn: 'root'
})

export class ApiService {
  hotelConfig$ = this.getHotelConfig().pipe(shareReplay());
  rooms$ = new BehaviorSubject<Rooms>([]);

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



}
