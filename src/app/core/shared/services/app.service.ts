import { Injectable } from '@angular/core';
import { TranslateService } from './translate.service';
import { BehaviorSubject, fromEvent, ReplaySubject, Subscription, timer } from 'rxjs';
import { ApiService } from './api.service';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ExchangeRateService } from './exchange-rate.service';
import { Currency, Language } from './language-currency-codes.service';
import * as numeral_ from 'numeral';
import { PortalPaletteHueColors } from './style-variables.service';
import { map } from 'rxjs/operators';
import { LoginResponseModel } from '../models/shared-models';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../sharedDialogs/dialog.service';

const numeral = numeral_;


export interface PortalTheme {
  primary: PortalPaletteHueColors | string;
  accent: PortalPaletteHueColors | string;
  warn: PortalPaletteHueColors | string;
  secondary?: PortalPaletteHueColors | string
}

export interface PortalThemeRuntime {
  primary: PortalPaletteHueColors;
  accent: PortalPaletteHueColors;
  warn: PortalPaletteHueColors;
  secondary?: PortalPaletteHueColors;
}

export interface AppConfig {
  'LOGOURL': string;
  'NAME': string;
  'HOTELID': number;
  'PHONE': number;
  'WHATSAPP': string;
  'THEMENO': number;
}

export type AppMode = 'Hotel' | 'Restaurant' | 'GroupHotel';

import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  prerender = false;

  numeral;
  appConfig = {};

  loginUser = new BehaviorSubject<LoginResponseModel>(null);
  selectSellerId = new BehaviorSubject<number>(null);
  get AngusLoginToken() {
    return this.api.loginToken;
  }
  set AngusLoginToken(token) {
    this.api.loginToken = token;
  }
  loginType = null;
  homePageRoute: BehaviorSubject<string> = new BehaviorSubject('/');
  hotelID = 0;
  subDomain = null;
  sellerID = null;
  openBasketAuto = false;
  mobileBottomMenuSearchClick = new ReplaySubject(1);
  headerHeight = new BehaviorSubject(0);
  backgroundImage = new BehaviorSubject<string>(undefined);

  mode$ = new BehaviorSubject<AppMode>('Hotel');

  isRouterLayoutFull = new BehaviorSubject(false);

  appearance: BehaviorSubject<MatFormFieldAppearance> = new BehaviorSubject<MatFormFieldAppearance>('legacy');

  language = new BehaviorSubject('');
  supportedLanguages: BehaviorSubject<Language[]> = new BehaviorSubject<Language[]>([{
    langKey: 'tr',
    langFlag: 'assets/images/flags/TR.png',
    langLong: 'Türkçe'
  }]);

  supportedCurrencies: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>([{ curCode: 'TRY', curIcon: 'TL' }]);
  currency = new BehaviorSubject('TRY');
  portalID = 1;

  defCurrency;
  defLanguage;
  headerAndFooterDisable = new BehaviorSubject<boolean>(false);

  tcNumberConfirmation = new BehaviorSubject(false); // local fiyatları gösterirlken açılan tcConfirmation dialog için kullanılıyor

  policyOffset = 0;
  commissionType: 'ALL' | 'GROSS' | 'NET' | 'CUSTOM';
  showCommission: boolean;

  defCountry = new BehaviorSubject('tr');

  isB2Blogin = new BehaviorSubject<boolean>(false);
  hotelOwner = false;
  loginRole: BehaviorSubject<string> = new BehaviorSubject('');
  currentTheme = new BehaviorSubject<PortalTheme>(
    {
      primary: 'indigo',
      accent: 'amber',
      warn: 'red',
    });

  /* digital menu için ekledim */
  defaultTheme = new BehaviorSubject<PortalTheme>(null);

  _currentTheme = new BehaviorSubject<PortalThemeRuntime>(undefined);

  isPrimaryTextWhite = this._currentTheme.pipe(map(x => x && x.primary.default.contrast === 'white'));

  itineraryCountChanged = new BehaviorSubject(0);
  // google analytics
  sendGAEvents = new BehaviorSubject(false);
  // google tag manager
  sendGTMEvents = new BehaviorSubject(false);
  // yandex metrica
  sendYMEvents = new BehaviorSubject(false);
  // facebook pixel
  sendFBPixelEvents = new BehaviorSubject(false);

  footerCustomHtml = new BehaviorSubject('');

  loginUserGuestId = null;
  callCenterState$ = new BehaviorSubject(!!+localStorage.getItem('callCenterState'));
  domain: {
    SUBDOMAIN: string;
    HOSTNAME: string;
    DOMAINNAME: string;
    EXTENSION: string;
    HOST: string;
    URL: string;
    SUBDOMAINNAME: (subdomainName?: string) => string;
    SUBDOMAINURL: (subdomainName?: string) => string;
  } = null;

  constructor(
    private translate: TranslateService,
    private api: ApiService,
    private http: HttpClient,
    private exchangeRateService: ExchangeRateService,
    private dialogService: DialogService,
  ) {

    this.numeral = numeral;

    this.loginUser.subscribe(val => {
      // C = Seller, O= Operatör rolünde bu rollerde komisyonlar olcuğu için komisyon butonları olmalı
      // update added P=portalowner
      if (val && val.ROLENAME) {
        this.hotelOwner = true;
        this.loginRole.next(val.ROLENAME);
      }

      if (val) {
        this.loginType = val.LOGINTYPE;
        this.isB2Blogin.next((val.LOGINTYPE === 'C' || val.LOGINTYPE === 'O' || val.LOGINTYPE === 'H'));
      }
    });
  }

  callCenterToogle() {
    this.callCenterState$.next(!this.callCenterState$.value);
    localStorage.setItem('callCenterState', String(~~this.callCenterState$.value))
  }


  getDate(date: any, format = 'YYYY-MM-DD HH:mm') {
    if (date) {
      return moment(date).locale('en').format(format);
    }
    return '';
  }

  convert(value) {
    const rates = this.exchangeRateService.rates;
    const portalcurrency = this.defCurrency;
    let rateTo = null;
    let rateFrom = null;
    if (rates && rates.length > 0) {
      rateFrom = rates[0].filter(r => {
        return r.TO === portalcurrency;
      });
      rateTo = rates[0].filter(r => {
        return r.TO === this.currency.getValue();
      });
    }
    let rate = 1;
    if (rateFrom != null && rateFrom.length > 0 && rateTo != null && rateTo.length > 0) {
      rate = rateFrom[0].BUYRATE / rateTo[0].BUYRATE;
    }
    return rate != null ? (value / rate).toFixed(2) : value.toFixed(2);

  }

  getRate(selectCur) {
    const rates = this.exchangeRateService.rates;
    const portalcurrency = this.defCurrency;
    let rateTo = null;
    let rateFrom = null;
    if (rates && rates.length > 0) {
      rateFrom = rates[0].filter(r => {
        return r.TO === portalcurrency;
      });
      rateTo = rates[0].filter(r => {
        return r.TO === selectCur;
      });
    }
    let rate = 1;
    if (rateFrom != null && rateFrom.length > 0 && rateTo != null && rateTo.length > 0) {
      rate = rateFrom[0].BUYRATE / rateTo[0].BUYRATE;
    }
    return 1 / rate;

  }

  isNumeric(n: any): n is number {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  convertToPortalPrice(value, currency?: string): string {
    const rates = this.exchangeRateService.rates;
    const portalcurrency = this.defCurrency;
    let rateTo = null;
    let rateFrom = null;
    if (rates && rates.length > 0) {
      rateFrom = rates[0].filter(r => {
        const d = r.TO === (currency ? currency : this.currency.getValue());
        return d;
      });
      rateTo = rates[0].filter(r => {
        return r.TO === portalcurrency;
      });
    }
    let rate = 1;
    if (rateFrom != null && rateFrom.length > 0 && rateTo != null && rateTo.length > 0) {
      rate = rateFrom[0].BUYRATE / rateTo[0].BUYRATE;
    }
    return rate != null ? (value / rate).toFixed(2) : value.toFixed(2);

  }

  convertFormTo(value, from: string, to: string) {
    const rates = this.exchangeRateService.rates;
    const portalcurrency = this.defCurrency;
    let rateTo = null;
    let rateFrom = null;
    if (rates && rates.length > 0) {
      rateFrom = rates[0].filter(r => {
        return r.TO === from;
      });
      rateTo = rates[0].filter(r => {
        return r.TO === to;
      });
    }
    let rate = 1;
    if (rateFrom != null && rateFrom.length > 0 && rateTo != null && rateTo.length > 0) {
      rate = rateFrom[0].BUYRATE / rateTo[0].BUYRATE;
    }
    return +(rate != null ? (value / rate).toFixed(2) : value.toFixed(2));

  }

  mockArrayCreator(num: number) {
    return Array(num);
  }

  starEmptyArray(star: number) {
    if (star === undefined || star === null) {
      return [];
    }
    return Array(Math.floor(Math.abs(+star)));
  }

  showPrice(number, direction: 'left' | 'right') {
    if (number == null) {
      return;
    }
    if (direction === 'left') {
      return this.numeral(Math.floor(number.toString().replace(/,/g, ''))).format('0,0');
    } else {
      return this.numeral(number.toString().replace(/,/g, '')).format('.00').split('.')[1];
    }
  }

  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/' + (location.protocol === 'https:' ? ';secure' : '');
  }

  getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  async convertHTMLtoPdf(htmlData: string, customFileName: string) {
    const pdf = await this.api.htmlTopdf({ HTML: htmlData });
    if (pdf && pdf.base64) {

      const binary = atob(pdf.base64.replace(/\s/g, ''));
      const len = binary.length;
      const buffer = new ArrayBuffer(len);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }

      let uriContent = URL.createObjectURL(new Blob([view], { type: 'application/pdf' }));
      let link = document.createElement('a');
      const linkSource = `data:application/pdf;base64,${pdf.base64}`;
      link.setAttribute('href', uriContent);
      const fileName = (customFileName || 'download') + '.pdf';
      link.setAttribute('download', fileName);
      let event = new MouseEvent('click');
      link.dispatchEvent(event);

      // this is the older version base64 to pdf it works until 2mb in chrome
      // const linkSource = `data:application/pdf;base64,${pdf.base64}`;
      // const downloadLink = document.createElement('a');
      // const fileName = customFileName + '.pdf' || 'download.pdf';
      //
      // downloadLink.href = linkSource;
      // downloadLink.download = fileName;
      // downloadLink.click();
    }
  }

  // when we use like scrollintoview sometime we need some offset after scrollintoview. This method looks for the scroll event and when
  // it's finished scrolls by given number
  // can accept - or + num. - for top , + for bottom.
  scrollWhenScrollFinished(num: number) {
    let subRef: Subscription;
    const ste = fromEvent(document, 'scroll').subscribe(value => {
      if (subRef) {
        subRef.unsubscribe();
      }
      subRef = timer(100).subscribe(value1 => {
        window.scrollBy({ top: num, behavior: 'smooth' });
        ste.unsubscribe();
        subRef.unsubscribe();
      });
    });
  }

  async checkIsThereAnyExtraService(useDate, mode: 'HOTEL' | 'TOUR' | 'TRANSFER' | 'FLIGHT' | 'TICKET', hotelId = 0, relatedUid?, marketId?: number, nightCount?) {

    let Parameters = {
      'HOTELID': hotelId,
      'LANG': this.language.value,
      'CURRENCYCODE': this.defCurrency,
      'USEDATE': useDate,
      'RELATEDUID': relatedUid,
      ['USEFOR' + mode]: true,
      'MARKETID': marketId,
      'NIGHTCOUNT': nightCount
    }

    const result = await this.api.execSP({
      Object: 'SP_PORTALV4_GETHOTELEXTRASERVICE',
      Parameters
    });
    if (result != null && result[0].length) {
      return result[0];
    }
  }

  // async extraServiceDialog(useDate, mode: 'HOTEL' | 'TOUR' | 'TRANSFER' | 'FLIGHT' | 'TICKET', hotelId = 0, relatedUid?, marketId?: number) {
  //   const ref = await this.dialogService.openFullscreenLoading('ticket-add-basket');
  //   await this.checkIsThereAnyExtraService(useDate, mode, hotelId, relatedUid, marketId);
  //   ref.detach();

  //   // if (await this.checkIsThereAnyExtraService(useDate, mode, hotelId, relatedUid, marketId)) {
  //   //   ref.detach();

  //   //     return true;



  //   //   const isThisAYes = await this.dialogService.openConfirmationDialog({
  //   //     message: 'MSG_ITEM_HAS_EXTRA_SERVICE',
  //   //     icon: 'question_answer',
  //   //     buttonMessages: ['EXTRA_SERVICE_SKIP', 'EXTRA_SERVICE_BROWSE'],
  //   //     buttonIcon: ['', 'fas fa-search']
  //   //   }).afterClosed().toPromise();
  //   //   return !!isThisAYes;
  //   // }

  //   // ref.detach();
  // }

  // url is like '/Flight' etc.
  async getSeo(url: string, domainId: any): Promise<{
    TITLE: string
    KEYWORDS: string
    DESCRIPTION: string
  } | undefined> {
    const resp = await this.api.select({
      Object: 'QB_PORTAL_SEO',
      Select: ['TITLE', 'KEYWORDS', 'DESCRIPTION'],
      Where: [
        { Column: 'ABSOLUTE_PATH', Operator: '=', Value: url },
        { Column: 'LANGCODE2', Operator: 'LIKE', Value: '%' + this.language.getValue() + '%' },
        { Column: 'PORTAL_DOMAINID', Operator: domainId ? '=' : 'IS NULL', Value: (domainId ? domainId.toString() : null) },
      ]
    });
    if (resp && resp.ResultSets && resp.ResultSets.length) {
      return resp.ResultSets[0][0];
    }
  }

  convertLocaleLowerCase(str) {
    if (typeof str === 'string') {
      // @ts-ignore
      return str.toLocaleLowerCase(this.language.getValue());
    }
  }


  getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

}
