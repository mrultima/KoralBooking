import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AppService } from './app.service';


import { Slider, SliderItems } from '../models/slider-model';
import { PortalService } from './portal.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../sharedDialogs/dialog.service';
import { OverlayRef } from '@angular/cdk/overlay';

export interface HomeCategoryJson {
  CategoryId: number;
  CategoryName: string;
  Items: Array<any>;
}

import * as _ from 'lodash';
import { BasketService } from './basket.service';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  webPageList$: BehaviorSubject<any> = new BehaviorSubject([]);
  categoryNameList$: BehaviorSubject<any> = new BehaviorSubject(null);
  verifyagreement$: BehaviorSubject<any> = new BehaviorSubject(null);
  langRef: Subscription;

  homePageSliderData: BehaviorSubject<Slider> = new BehaviorSubject(null);
  // homePageHotelListData: BehaviorSubject<Hotel> = new BehaviorSubject(null);
  // homePageJSONData: BehaviorSubject<any> = new BehaviorSubject(null);

  /*
  {
    Type: 1, SliderItems: [
      {
        Url: 'https://portalv3.s3.eu-central-1.amazonaws.com/156/MyHotelFiles/8df95108-274c-4a5b-b9fd-654e937d467e_Doga.jpg',
        Active: false, Title: '', Content: '', RouterLink: ''
      }]
  }*/

  cache = {};

  slideItems: SliderItems = {Url: '', Active: false, Title: '', Content: '', RouterLink: ''};
  isMobile = false;
  routeHome = false;

  // each item can inject like {hotel: ..., ticket: ...}.
  // initial is boolean because items must wait until we certain that there is no json
  dynamicDesignData: BehaviorSubject<boolean | object> = new BehaviorSubject(false);
  // if there is an item inject itself and send an request to update itself this is where we should wait
  // so if hotel needs to update itself push a false in here then when finished its work push true
  dynamicDesignRefresher = new BehaviorSubject([]);
  dynamicDesignThemeNumber = new BehaviorSubject(1);
  ref: OverlayRef;

  constructor(
    private api: ApiService,
    public appService: AppService,
    public portalService: PortalService,
    breakpointObserver: BreakpointObserver,
    public route: ActivatedRoute,
    public dialogService: DialogService,
    private basketService: BasketService
  ) {
    breakpointObserver.observe('(max-width: 959px)').subscribe(value => {
      this.isMobile = value.matches;
    });
    this.route.url.subscribe(value => {
      this.routeHome = value[0].path !== ('' || 'Home');
    });
    // Eskiden HomePageService sadece portallar için çalışıyordu şuan oteller içinde çalışıyor
    // Bu nedenle aşağıdaki isteklerin otel app modunda gitmemesi için eklendi.
    /* if (this.appService.appMode.getValue() !== 'HOTEL') {
      this.langRef = this.appService.language.subscribe(async value => {
        this.getWebBanner();
        this.getWebPage();
      });

      this.getPortalCategory();

      this.dynamicDesignDataGatherer();
    } */
  }

  async getAgreement(type: number, groupHotelId: number): Promise<{ AGREEMENT: any, NOTSHOWVOUCHER: any } | undefined> {
    const basket = this.basketService.basket.get();
    const typeWithLang = type + '---' + this.appService.language.getValue();

    // if (this.cache.hasOwnProperty(typeWithLang)) {
    //   return this.cache[typeWithLang];
    // }

    const roomTypeID = basket.Items?.HotelItems[0]?._PriceBlock?.ResParams.RoomTypeId

    const HotelId = this.appService.hotelID; // Eğer bir otel sayfasıysa onun ıd si gelecek portalsa 0
    const agreementData = await this.api.execSP({
      Object: 'SP_PORTALV4_GETAGREEMENT',
      Parameters: {
        'PORTALID': this.appService.portalID || 1,
        'HOTELID': HotelId || 0,
        'LANGUAGECODE': this.appService.language.value,
        'TYPEID': type,
        'ROMMTYPEID': roomTypeID || null,
        'HOTELGROUPID': groupHotelId || null
      }
    }).then((value: Array<Array<{ AGREEMENT: any, NOTSHOWVOUCHER: any }>>) => {
      this.cache[typeWithLang] = _.get(value, '0.0');
      if (_.get(value, '0.0')) {
        return value[0][0];
      }
    }).catch(reason => {
      console.error(reason, 'line:58 / getAgreement/home-page-service');
    });
    return agreementData || undefined;
  }

  async getMainPageDesignJSON() {
    const resp = await this.api.select({
      Object: 'PORTAL_MAINPAGE',
      Paging: {Current: 1, ItemsPerPage: 1},
      Where: [
        {Column: 'PORTALID', Value: this.appService.portalID.toString(), Operator: '='},
        {Column: 'ARCHIVE', Value: '0', Operator: '='},
      ],
      OrderBy: [{Column: 'CREATEDATE', Direction: 'DESC'}],
    }).then(response => {
      if (response.ResultSets) {
        return response.ResultSets[0];
      }
    });
    return resp;
  }

  async setMainPageDesignJSON(jsonData: string, update: boolean = false) {
    const resp = await this.api.execSP({
      Object: 'SP_PORTALV4_INSERTMAINPAGEJSON', Parameters: {
        JSONDATA: jsonData
      }
    });
  }

}
