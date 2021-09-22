import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class SearchBoxService {
    searchFormGroup = new FormGroup(
        {
            ADULT: new FormControl(2),
            CHECKIN: new FormControl(new Date()),
            CHECKOUT: new FormControl(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() +
                (this.api.hotelConfig?.MinLOS || 4))),
            DAYS: new FormControl(this.api.hotelConfig?.MinLOS || 4),
            CHILDAGES: new FormControl(0),
            COUNTRYCODE: new FormControl(''),
            CURRENCY: new FormControl(''),
            HOTELID: new FormControl(this.api.hotelConfig?.HOTELID),
            IPADDRESS: new FormControl(''),
            LANGUAGE: new FormControl(''),
            PORTALID: new FormControl(1),
            PORTALSELLERID: new FormControl(null),
            PROMOCODE: new FormControl(''),
            SESSION: new FormControl(null),
        }
    );

    constructor(private api: ApiService) { }
}