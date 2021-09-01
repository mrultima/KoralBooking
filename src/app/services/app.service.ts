import { Injectable } from '@angular/core';
import { TranslateService } from './translate.service';
import { BehaviorSubject, fromEvent, ReplaySubject, Subscription, timer } from 'rxjs';
import * as moment from 'moment';
import { Currency, Language } from '../models/langauge';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';




export interface AppConfig {
    'LOGOURL': string;
    'NAME': string;
    'HOTELID': number;
    'PHONE': number;
    'WHATSAPP': string;
    'THEMENO': number;
}


@Injectable({
    providedIn: 'root'
})
export class AppService {


    appConfig = {};

    homePageRoute: BehaviorSubject<string> = new BehaviorSubject('/');
    hotelID = 0;
    subDomain = null;
    openBasketAuto = false;




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


    defCountry = new BehaviorSubject('tr');

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
    ) {
    }


    getDate(date: any, format = 'YYYY-MM-DD HH:mm') {
        if (date) {
            return moment(date).locale('en').format(format);
        }
        return '';
    }

    //   convert(value) {
    //     const rates = this.exchangeRateService.rates;
    //     const portalcurrency = this.defCurrency;
    //     let rateTo = null;
    //     let rateFrom = null;
    //     if (rates && rates.length > 0) {
    //       rateFrom = rates[0].filter(r => {
    //         return r.TO === portalcurrency;
    //       });
    //       rateTo = rates[0].filter(r => {
    //         return r.TO === this.currency.getValue();
    //       });
    //     }
    //     let rate = 1;
    //     if (rateFrom != null && rateFrom.length > 0 && rateTo != null && rateTo.length > 0) {
    //       rate = rateFrom[0].BUYRATE / rateTo[0].BUYRATE;
    //     }
    //     return rate != null ? (value / rate).toFixed(2) : value.toFixed(2);

    //   }

    //   getRate(selectCur) {
    //     const rates = this.exchangeRateService.rates;
    //     const portalcurrency = this.defCurrency;
    //     let rateTo = null;
    //     let rateFrom = null;
    //     if (rates && rates.length > 0) {
    //       rateFrom = rates[0].filter(r => {
    //         return r.TO === portalcurrency;
    //       });
    //       rateTo = rates[0].filter(r => {
    //         return r.TO === selectCur;
    //       });
    //     }
    //     let rate = 1;
    //     if (rateFrom != null && rateFrom.length > 0 && rateTo != null && rateTo.length > 0) {
    //       rate = rateFrom[0].BUYRATE / rateTo[0].BUYRATE;
    //     }
    //     return 1 / rate;

    //   }

    isNumeric(n: any): n is number {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    //   convertToPortalPrice(value, currency?: string): string {
    //     const rates = this.exchangeRateService.rates;
    //     const portalcurrency = this.defCurrency;
    //     let rateTo = null;
    //     let rateFrom = null;
    //     if (rates && rates.length > 0) {
    //       rateFrom = rates[0].filter(r => {
    //         const d = r.TO === (currency ? currency : this.currency.getValue());
    //         return d;
    //       });
    //       rateTo = rates[0].filter(r => {
    //         return r.TO === portalcurrency;
    //       });
    //     }
    //     let rate = 1;
    //     if (rateFrom != null && rateFrom.length > 0 && rateTo != null && rateTo.length > 0) {
    //       rate = rateFrom[0].BUYRATE / rateTo[0].BUYRATE;
    //     }
    //     return rate != null ? (value / rate).toFixed(2) : value.toFixed(2);

    //   }

    //   convertFormTo(value, from: string, to: string) {
    //     const rates = this.exchangeRateService.rates;
    //     const portalcurrency = this.defCurrency;
    //     let rateTo = null;
    //     let rateFrom = null;
    //     if (rates && rates.length > 0) {
    //       rateFrom = rates[0].filter(r => {
    //         return r.TO === from;
    //       });
    //       rateTo = rates[0].filter(r => {
    //         return r.TO === to;
    //       });
    //     }
    //     let rate = 1;
    //     if (rateFrom != null && rateFrom.length > 0 && rateTo != null && rateTo.length > 0) {
    //       rate = rateFrom[0].BUYRATE / rateTo[0].BUYRATE;
    //     }
    //     return +(rate != null ? (value / rate).toFixed(2) : value.toFixed(2));

    //   }


    //   showPrice(number, direction: 'left' | 'right') {
    //     if (number == null) {
    //       return;
    //     }
    //     if (direction === 'left') {
    //       return this.numeral(Math.floor(number.toString().replace(/,/g, ''))).format('0,0');
    //     } else {
    //       return this.numeral(number.toString().replace(/,/g, '')).format('.00').split('.')[1];
    //     }
    //   }

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

        const result = await this.api.apiReq({
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



}
