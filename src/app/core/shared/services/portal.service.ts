import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject, race, timer } from 'rxjs';
import { ApiService } from './api.service';
import { AppService } from './app.service';
import { StyleManager } from '../helpers/style-manager';
import { LanguageCurrencyCodes } from './language-currency-codes.service';
import { BasketService } from './basket.service';
import { TranslateService } from './translate.service';
import { SeoService } from './seo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ExchangeRateService } from './exchange-rate.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { StyleVariablesService } from './style-variables.service';
import { first } from 'rxjs/operators';
import { HotelDesignConfig, HotelConfig, Hotel } from '@travelaps/hotel/shared';
import { PortalInjectionService } from './portal-injection.service';
export interface PortalConfig extends HotelDesignConfig, HotelConfig {
  'DOMAINTYPE': string;
  'PORTALID': number;
  'HOTELID': number;
  'HOTELSEOURL': string;
  'USEMEDICAL': boolean;
  'REFERER': string;
  'LOGOURL': string;
  'LOGOURL_FAVICON': string;
  'NAME': string;
  'PHONE': string;
  'WHATSAPP': string;
  'EMAIL': string;
  'DEFAULTCURRENCY': string;
  'DEFAULTLANGUAGE': string;
  'USEHTTPS': boolean;
  'THEMENO': number;
  'FACEBOOKURL': string;
  'SEOTITLE': string;
  'SEODESCRIPTION': string;
  'SEOKEYWORDS': string;
  'TWITTERURL': string;
  'GOOGLEPLUSURL': string;
  'YOUTUBEURL': string;
  'LINKEDINURL': string;
  'INSTAGRAMURL': string;
  'PINTERESTURL': string;
  'BANKACCOUNTNUMBER': string;
  'DEFAULTCATEGORY': number;
  'LANGUAGES': string;
  'CURRENCIES': string;
  'LOGINCURRENCIES': string;
  'GOOGLEMAPSAPIKEY': string;
  'MAINPAGEURL': string;
  'BANNERIMAGE': string;
  'PRICEWITHBIRTHDATE': boolean;
  'ISHOTELPAYMENTGATEINBASKET': boolean;
  'SUBDOMAIN': string;
  'RES_OPENBASKET_AUTO': boolean;
  'SEARCHBOXMODE': string;
  'FLIGHTLIST_PPPSHOW': boolean;
  'ISMAPENABLED': boolean;
  'POLICYOFFSET': number;
  'COMMISSIONTYPE': 'ALL' | 'GROSS' | 'NET' | 'CUSTOM';
  'SHOWCOMMISSION': boolean;
  'HOMEPAGE_DESIGN': string;
  'PORTALDOMAINID': number;
  'SEARCHBOXTYPE': number;
  'SEARCHBOXPOSITION': number;
  'BANNERIMAGEMOBILE': string;
  'COUNTRYCODE': string;
  'MAINPAGEJSON': string;
  'DEFAULTTRANSFERLOCATIONID': string;
  'COLORS': string;
  'COMPANYNAME': string;
  'FAX': string;
  'ADDRESS': string;
  'TURSAB_DOCNO': string;
  'TAWKTO': string;
  'SEARCHORDER': string;
  'FOOTER_CUSTOMHTML': string;
  'FOOTER_LOGO': string;
  'CLICKTOCALLACTIVE': boolean;
  'TRANSFERSEARCH_DEFAULTDATEOFFSET': string;
  'HOMEPAGE_DESIGNTWO': string;
  'HIDDENMENUS': string;
  'SHOWHOTELISTPRICEBTN': string;
  'BACKGROUND_IMAGE': string;
  'MAIN_SETTINGS': string;
  'GAUID': string; // google analytics
  'GTMUID': string; // google tag manager
  'YMUID': string; // yandex metrica
  'FBPAGEID': string; // Facebook Pixel
  'HOTELGROUPID': number;
  'HOTELLISTPRICETYPE': number;
  'HOTELLISTPRICESP': string;
  'DISPLAY_AVAILABLE_HOTELS': boolean;
  'GARANTIPAYENABLED': boolean;
  'HOSTING3DPAYENABLED': boolean;
  'CURRENTTIME': string;
  'ENABLECHECKIN': boolean;
  'ENABLEONLINECHECKIN': boolean;
  'ENABLEONLINEPAYMENT': boolean;
  'ENABLEDEPOSITPAYMENT': boolean;
  'ENABLEONLINECHECKOUT': boolean;
  'ENABLEONLINEBILL': boolean;
  'ENABLEONLINEACTIVITIES': boolean;
  'ENABLEONLINERESTAURANTRES': boolean;
  'ENABLEONLINESPARES': boolean;
  'ENABLEONLINECATALOGUE': boolean;
  'ENABLEINDIVIDUALLOGIN': boolean;
  'ENABLECLICKTOCALL': boolean;
  'USELARGELOGO': boolean;
  'ISCHOOSESELLERACTIVE': boolean;
  'FOOTER_MASTER_LOGO': boolean;
  'FOOTER_VISA_LOGO': boolean;
  'FOOTER_TURSAB_LOGO': boolean;
  'DISABLE_INDIVIDUAL_LOGIN': boolean;
  'CLICKTOCALL_NAME': boolean;
  'CLICKTOCALL_SURNAME': boolean;
  'CLICKTOCALL_EMAIL': boolean;
  'SHOW_ONLINECHECKIN': boolean;
  'MAX_CHILD_AGE': number;
  'ENABLETENNISRESERVATION': boolean;
  'ENABLEGOLFRESERVATION': boolean;
  'ENABLEBEACHRESERVATION': boolean;
  'ENABLEWATERSPORTRESERVATION': boolean;
  'ENABLEROOMCLEANINGRESERVATION': boolean;
  'ENABLEWAKEUPCALL': boolean;
  'ENABLETECHNICALSERVICE': boolean;
  'ENABLECOMPLAINT': boolean;
  'ENABLECALLBELLBOY': boolean;
  'ENABLELAUNDRY': boolean;
  'ENABLEROOMUPGRADE': boolean;
  'ENABLEBYTRANSFER': boolean;
  'ENABLEMEDICALASSINTANCE': boolean;
  'ENABLEDOORKEY': boolean;
  'ENABLEOPENROOMDOOR': boolean;
  'ENABLEBUYLATECHECKOUT': boolean;
  'ENABLERESTAURANTORDER': boolean;
  'ENABLEONLINEKIDSCLUB': boolean;
  'ENABLEONLINESHUTTLE': boolean;
  'CUSTOMTAB1CAPTION': string;
  'CUSTOMTAB2CAPTION': string;
  'USELOCALDATA': boolean;
  'PropertyType': number; //*

  'GROUPHOTELID': number;
  'GROUPHOTELSUBDOMAIN': string;
  'SHOWCOUNTRYCODE': boolean;
  'ONLINE_OWNERFOLIO': boolean;
  'BASKET_TIMEOUTDURATION': number;
  'CCTO': string;
  'ROOMLIST_ORDER': number;
  'BUYLATER_LABEL': number;
  'ENABLEONLINEBONUS': boolean;

  ONLINECHECKIN_SKIPIDSCAN: boolean;
  ONLINECHECKIN_SKIPSURNAME2: boolean;
  HIDEPAYMENTLINK: boolean;
  HOTELITEMS_SHOWRATES: number;
  HOTELLIST: Hotel[];
  HOTELGROUPCONFIG: GroupHotelConfig;
  CNAME_WEB: string;
  MaxChild: number;
  UserInterfaceMaxChildAge: number;
  ROOMTYPEGROUP: string;
  CONFIRMEREMAIL: string;
  HOTELITEM_RATECODEVISIBLE: boolean;
  BASKET_SHOWTROYCARDLOGO: boolean;
  HOTELITEM_SHOWRESPARAMS: boolean;
  WHATSAPP_PHONE: string;
  GUESTAPP_WITHOUTRES: boolean;
  HIDELOGIN: boolean;
}

@Injectable({ providedIn: 'root' })
export class PortalService {
  portalConfig$: BehaviorSubject<PortalConfig> = new BehaviorSubject(null);
  portalConfig: PortalConfig;

  mainPageUrl: string;

  queryParams: {}
  params: number;

  appInitialized$ = new BehaviorSubject(false);
  runScripts = '';
  initParams: any;
  readonly lcId = '_cc';
  localCacheTime: number;
  navigatorLanguage: string;

  ver = 1.1;

  constructor(
    public api: ApiService,
    public appService: AppService,
    public langCurrCodes: LanguageCurrencyCodes,
    public styleManager: StyleManager,
    public basketService: BasketService,
    public translateService: TranslateService,
    public seoService: SeoService,
    public exchangeService: ExchangeRateService,
    public styleVariablesService: StyleVariablesService,
    public acRouter: ActivatedRoute,
    public appRef: ApplicationRef,
    public injService: PortalInjectionService,
    public router: Router
  ) {
    this.acRouter.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('RoomTypeGroupId')) {
        this.queryParams = params
        this.setGroupName()
      }
    });
  }

  setGroupName(config: PortalConfig = null) {
    if (!config) {
      config = this.portalConfig$.getValue();
    }
    if (this.queryParams && this.queryParams.hasOwnProperty('RoomTypeGroupId') && config.hasOwnProperty('ROOMTYPEGROUP') && config.ROOMTYPEGROUP) {
      const roomTypeGroup = JSON.parse(config.ROOMTYPEGROUP).filter(f => { return f['ID'] == this.queryParams['RoomTypeGroupId'] })
      this.params = JSON.parse(config.ROOMTYPEGROUP).find(f => { return f['ID'] == this.queryParams['RoomTypeGroupId'] }).BOOKINGTYPE

      if (roomTypeGroup.length === 1) {
        config.NAME = roomTypeGroup[0].GROUPNAME;
        config.HotelName = roomTypeGroup[0].GROUPNAME;
        return config
      }
    }
    return config;
  }

  clearLocalCache() {
    Object.keys(localStorage).filter(x => x.startsWith('_')).forEach(x => localStorage.removeItem(x));
  }

  getLocalCache() {
    let localCache: any[] = JSON.parse(localStorage.getItem(this.lcId) || '[]');
    for (let i in localCache) {
      const x = localCache[i];
      // if (typeof x !== 'object' || !x.t || !x.d || typeof x.d !== 'object' || (x.t && Math.round((moment().unix() - x.t) / 36e5)) > 24 * 7) { todo: bunu geri al CCTO için yapılan düzenleme
      if (typeof x !== 'object' || !x.t || !x.d || typeof x.d !== 'object' || (x.t && Math.round((moment().unix() - x.t) / 36e5)) > 12) {
        delete localCache[i];
      }
    }
    return localCache.filter(x => !!x);
  }

  setLocalCache() {
    const config = this.portalConfig$.getValue();
    if (!config) {
      return;
    }
    let localCache: any[] = this.getLocalCache().filter(x => !(x.h === config.HOTELID && x.l === this.appService.language.getValue()));
    localCache.push({
      t: moment(config.CURRENTTIME).unix(),
      d: config,
      h: config.HOTELID,
      s: config.SUBDOMAIN,
      o: config.SeoUrl,
      l: this.appService.language.getValue(),
      v: this.ver,
      c: config.CNAME_WEB
    });
    localStorage.setItem(this.lcId, JSON.stringify(localCache));
  }

  async initConfig({
    HOTELID = null,
    SEOURL = null,
    SUBDOMAIN = null,
    LANGUAGE = null,
    RESTAURANT = null,
    PARAMS = {},
    GROUPHOTELID = null,
    GROUPHOTELSUBDOMAIN = null,
    CNAMEWEB = null,
    CNAMEWEBSUB = null,
    IPCOUNTRY = null
  } = {
      HOTELID: null,
      SEOURL: null,
      SUBDOMAIN: null,
      LANGUAGE: null,
      PARAMS: null,
      RESTAURANT: null,
      GROUPHOTELID: null,
      GROUPHOTELSUBDOMAIN: null,
      CNAMEWEB: null,
      CNAMEWEBSUB: null

    }
  ) {
    this.initParams = arguments[0];

    if (RESTAURANT) {
      this.appService.mode$.next('Restaurant');
      this.portalConfig$.next({
        LANGUAGES: '[{"CODE2":"TR"},{"CODE2":"EN"}]',
        DEFAULTLANGUAGE: 'TR',
        SEOTITLE: 'Bisiparis',
        CURRENCIES: '[{"CODE3":"USD"},{"CODE3":"EUR"},{"CODE3":"GBP"},{"CODE3":"YER"},{"CODE3":"TRY"},{"CODE3":"ANG"}]',
        COLORS: "{\"primary\":{\"default\":{\"hex\":\"#b71c1c\",\"contrast\":\"white\"},\"lighter\":{\"hex\":\"#f05545\",\"contrast\":\"rgba(0, 0, 0, 0.87)\"},\"darker\":{\"hex\":\"#7f0000\",\"contrast\":\"white\"},\"secondary\":{\"hex\":\"#f7cbcb\",\"contrast\":\"black\"}},\"secondary\":{\"default\":{\"hex\":\"#263238\",\"contrast\":\"white\"},\"lighter\":{\"hex\":\"#4C585E\",\"contrast\":\"white\"},\"darker\":{\"hex\":\"#000C12\",\"contrast\":\"white\"},\"secondary\":{\"hex\":\"#ff5252\",\"contrast\":\"white\"}},\"accent\":{\"default\":{\"hex\":\"#263238\",\"contrast\":\"white\"},\"lighter\":{\"hex\":\"#263238\",\"contrast\":\"rgba(0, 0, 0, 0.87)\"},\"darker\":{\"hex\":\"#263238\",\"contrast\":\"white\"},\"secondary\":{\"hex\":\"#cdd8dd\",\"contrast\":\"black\"}},\"warn\":{\"default\":{\"hex\":\"#f44336\",\"contrast\":\"white\"},\"lighter\":{\"hex\":\"#ffcdd2\",\"contrast\":\"rgba(0, 0, 0, 0.87)\"},\"darker\":{\"hex\":\"#d32f2f\",\"contrast\":\"white\"},\"secondary\":{\"hex\":\"#fcd9d6\",\"contrast\":\"black\"}}}",
      } as any);
      this.portalConfig = this.portalConfig$.getValue();
      if (!this.appService.defaultTheme.getValue()) {
        this.appService.defaultTheme.next(JSON.parse(this.portalConfig.COLORS));
      }
      this.setStyle();
      this.restRouter((CNAMEWEB || CNAMEWEBSUB) ? true : SUBDOMAIN === 'app' ? false : !!SUBDOMAIN);
      this.setMetaTags();
      this.appInitialized$.next(true);
      return;
    } else if (GROUPHOTELID || GROUPHOTELSUBDOMAIN) {
      this.appService.mode$.next('GroupHotel');
      this.appService.openBasketAuto = true;
      this.seoService.defaultTags.next({
        args: {
          title: '',
          description: '',
          keywords: '',
          url: ''
        },
        default: ''
      });
      this.portalConfig$.next({
        GROUPHOTELID: GROUPHOTELID,
        GROUPHOTELSUBDOMAIN: GROUPHOTELSUBDOMAIN,
        LANGUAGES: '[{"CODE2":"TR"},{"CODE2":"EN"}]',
        SEARCHBOXMODE: 'standart',
        DEFAULTLANGUAGE: 'EN',
        CURRENCIES: '[{"CODE3":"USD"},{"CODE3":"EUR"},{"CODE3":"GBP"},{"CODE3":"YER"},{"CODE3":"TRY"},{"CODE3":"ANG"}]',
        COLORS: '{"primary":{"default":{"hex":"#b71c1c","contrast":"white"},"lighter":{"hex":"#f05545","contrast":"rgba(0, 0, 0, 0.87)"},"darker":{"hex":"#7f0000","contrast":"white"}},"accent":{"default":{"hex":"#263238","contrast":"white"},"lighter":{"hex":"#263238","contrast":"rgba(0, 0, 0, 0.87)"},"darker":{"hex":"#263238","contrast":"white"}},"warn":{"darker":{"contrast":"white","hex":"#d32f2f"},"default":{"contrast":"white","hex":"#f44336"},"lighter":{"contrast":"rgba(0, 0, 0, 0.87)","hex":"#ffcdd2"}}}',
      } as any);
      if (SUBDOMAIN) {
        this.appService.homePageRoute.next(`/`);
      } else {
        this.appService.homePageRoute.next(`/GroupHotel/${GROUPHOTELID || GROUPHOTELSUBDOMAIN}`);
      }
      this.portalConfig = this.portalConfig$.getValue();
      this.setStyle();
      this.plugins();
      this.setLanguage();
      this.setCurrencies();
      this.setExchangeRates();
      this.groupHotelRouter();
      this.appInitialized$.next(true);
      return;
    }

    this.appService.mode$.next('Hotel');

    const init = !!this.portalConfig$.getValue();

    if (!PARAMS) {
      PARAMS = {};
    }

    this.appInitialized$.next(false);

    if (!LANGUAGE) {
      if (this.appService.language.value != "") {
        LANGUAGE = this.appService.language.value
      } else {
        this.navigatorLanguage = navigator.language;
        if (this.navigatorLanguage) {
          if (this.navigatorLanguage.indexOf('-') > -1) {
            this.navigatorLanguage = this.navigatorLanguage.split('-')[0]
          }
        }
        if (!this.navigatorLanguage) {
          LANGUAGE = "TR"
        } else {
          LANGUAGE = this.navigatorLanguage;
        }
      }
    }

    const localCache: any[] = this.getLocalCache(),
      cData = localCache.find(x => (x.h == HOTELID || x.s == SUBDOMAIN || x.o == SEOURL || x.c == CNAMEWEB || x.c == CNAMEWEBSUB) && x.v == this.ver &&
        x.l == (this.appService.language.value || (new URL(location.href)).searchParams.get('language') ||
          String(x.d.DEFAULTLANGUAGE || '').toLowerCase() || 'tr'));

    if (cData && !(PARAMS['CACHE'] === false)) {
      this.localCacheTime = cData.t;
      this.portalConfig$.next(this.setGroupName(cData.d));
    } else {
      const resp = await this.api.execSP({
        Object: 'SP_HOTEL_BOOKINGPARAMS',
        Parameters: { HOTELID, SEOURL, SUBDOMAIN, LANGUAGE, CNAMEWEB, CNAMEWEBSUB, IPCOUNTRY }
      });
      if (Array.isArray(resp) && resp.length > 0 && resp[0].length > 0) {
        resp[0][0].Images = 1 in resp ? resp[1] : null;
        this.portalConfig$.next(this.setGroupName(resp[0][0]));
      } else {
        throw new Error('Invalid config');
      }
    }

    this.clearStorage();

    this.portalConfig = this.portalConfig$.getValue();

    // appService assigning
    this.appService.hotelID = this.portalConfig.HOTELID || HOTELID;
    this.appService.openBasketAuto = this.portalConfig.RES_OPENBASKET_AUTO;
    this.appService.subDomain = this.portalConfig.SUBDOMAIN;
    this.appService.appearance.next(<MatFormFieldAppearance>this.portalConfig.SEARCHBOXMODE || 'outline');
    this.appService.showCommission = this.portalConfig.SHOWCOMMISSION || this.portalConfig.COMMISSIONTYPE === 'CUSTOM';
    this.appService.commissionType = this.portalConfig.COMMISSIONTYPE;
    this.appService.policyOffset = this.portalConfig.POLICYOFFSET;
    this.appService.backgroundImage.next(this.portalConfig.BACKGROUND_IMAGE);
    if (!init) {
      if (SUBDOMAIN || CNAMEWEB) {
        this.appService.homePageRoute.next('/');
      } else {
        this.appService.homePageRoute.next(`/Hotel/${this.portalConfig.SeoUrl}-${this.portalConfig.HOTELID}`);
      }
    }

    this.mainPageUrl = this.portalConfig$.getValue().MAINPAGEURL;

    const basket = this.basketService.basket.get();
    if (basket.Items && basket.Items.HotelItems.length > 0) {
      if (basket.Items.HotelItems.find(x => x.ErsId != this.appService.hotelID)) {
        this.basketService.clearAllItems();
      }
    }
    basket.PortalId = this.portalConfig$.getValue().PORTALID;
    basket.Domain = window.location.hostname;
    this.basketService.basket.set(basket);
    this.setStyle();
    this.setExchangeRates();
    if (!init) {
      const googleApiKey = this.portalConfig$.getValue().GOOGLEMAPSAPIKEY;
      if (googleApiKey && googleApiKey !== '') {
        this.createScript({ src: 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + googleApiKey });
      }
      this.plugins();
      this.setLanguage();
    }
    this.setCurrencies();
    this.setMetaTags();
    this.setFavIcon(this.portalConfig.LOGOURL_FAVICON);

    if (!cData && this.portalConfig.HOTELGROUPID) {
      const groupResp = await this.api.execSP(
        {
          Object: 'SP_HOTELBOOKING_HOTELLIST',
          Parameters: {
            PORTALID: this.portalConfig.PORTALID,
            LANGUAGE: this.appService.language.getValue(),
            GROUPID: this.portalConfig.HOTELGROUPID,
            SUBDOMAIN: null
          }
        }
      );
      /* if (!(groupResp && groupResp[0].length > 0 && groupResp[1] && groupResp[1].length > 0)) {
        return;
      } */
      const c = this.portalConfig$.getValue();
      c.HOTELLIST = groupResp?.[0] || [];
      c.HOTELGROUPCONFIG = groupResp?.[1]?.[0] || {};
      this.portalConfig$.next(c);
      this.portalConfig = this.portalConfig$.getValue();
    }

    if (!cData) {
      this.setLocalCache();
    }

    // this.portalConfig.PropertyType = 2;
    this.appInitialized$.next(true);
    // this.appService.language.next(this.appService.language.getValue());
  }

  restRouter(r: boolean) {
    const config = this.router.config;
    const rest = config[0].children.find(q => q.path === (r ? 'YeniMenuRest' : 'YeniMenu'));
    rest.path = '';
    config[0].children = [rest];
    this.router.resetConfig(config[0].children);
  }

  groupHotelRouter() {
    const config = this.router.config;
    const dIndex = config[0].children.findIndex(q => q.path === '');
    const ghotel = config[0].children.find(q => q.path === 'GroupHotel');
    ghotel.path = '';
    delete config[0].children[dIndex];
    config[0].children = config[0].children.filter(x => !!x);
    this.router.resetConfig(config);
  }

  async clearStorage() {
    const storageData = Object.keys(localStorage);
    for (let i = 0; i < storageData.length; i++) {
      const item = localStorage.getItem(storageData[i]);
      if (item) {
        const jsonItm = item.startsWith('{') ? JSON.parse(item) : item;
        if (jsonItm && Object.keys(jsonItm).length) {
          Object.keys(jsonItm).forEach(x => {
            if (jsonItm[x] && jsonItm[x].date) {
              if (moment(jsonItm[x].date).diff(moment()) <= 10) {
                localStorage.removeItem(storageData[i]);
              }
            }
          });
        }
      }
    }
  }

  plugins() {
    if (this.portalConfig.GAUID) {
      const i = window;
      const ga = 'ga';
      i['GoogleAnalyticsObject'] = ga;
      i[ga] = i[ga] || function () {
        (i[ga].q = i[ga].q || []).push(arguments);
      };
      // @ts-ignore
      i[ga].l = 1 * new Date();
      this.createScript({ src: 'https://www.google-analytics.com/analytics.js' });

      this.appService.sendGAEvents.next(true);
      window['ga']('create', this.portalConfig.GAUID, 'auto');


      /*
      <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-XXXXX-Y', 'auto');
      ga('send', 'pageview');
      </script>
      */
    }

    if (this.portalConfig.FBPAGEID) {
      // const f: any = window;
      // if (f.fbq) {
      //   return;
      // }

      // let n: any = f.fbq = () => {
      //   n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      // };

      // if (!f._fbq) {
      //   f._fbq = n;
      // }

      // n.push = n;
      // n.loaded = !0;
      // n.version = '2.0';
      // n.queue = [];

      // this.createScript({ src: 'https://connect.facebook.net/en_US/fbevents.js' });
      // (<any>window).fbq('init', );
      // (<any>window).fbq('track', 'PageView');
      (function (f: any, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
          n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }; if (!f._fbq) f._fbq = n;
        n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      (window as any).fbq.disablePushState = true; //not recommended, but can be done
      (window as any).fbq('init', this.portalConfig.FBPAGEID);
      (window as any).fbq('track', 'PageView');
      this.appService.sendFBPixelEvents.next(true);

    }

    if (this.portalConfig.GTMUID) {

      // <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      // new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      // j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      // 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      // })(window,document,'script','dataLayer','GTM-XXXX');</script>

      window['dataLayer'] = window['dataLayer'] || [];

      window['dataLayer'].push({
        'gtm.start':
          new Date().getTime(), event: 'gtm.js'
      });

      window['my_gtag'] = function () {
        window['dataLayer'].push(arguments);
      };

      window['my_gtag']('js', new Date());
      this.createScript({ src: 'https://www.googletagmanager.com/gtm.js?id=' + this.portalConfig.GTMUID });
      // this.createScript({ src: 'https://www.googletagmanager.com/gtag/js?id=' + this.portalConfig.GTMUID });
      this.appService.sendGTMEvents.next(true);
    }

    if (this.portalConfig.YMUID) {
      const w = window;
      const i = 'ym';
      w[i] = w[i] || function () {
        (w[i].a = w[i].a || []).push(arguments);
      };
      // @ts-ignore
      w[i].l = 1 * new Date();
      this.createScript({ src: 'https://mc.yandex.ru/metrika/tag.js' });
      this.appService.sendYMEvents.next(true);

      window['ym'](this.portalConfig.YMUID, 'init', {
        defer: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      });
    }
  }

  createScript({ src, content, sync = false }: { src?: string, content?: string, sync?: boolean }): Promise<any> {
    const promise = new Promise<void>((resolve, reject) => {
      if (document.querySelector(`[data-btoaid="${btoa(src)}"]`)) {
        resolve();
        return;
      }

      race(this.appRef.isStable.pipe(first(x => !!x)), timer(2000)).subscribe(() => {
        const script = document.createElement('script');
        const tag = document.getElementsByTagName('script')[0];
        script.async = true;
        if (src) {
          script.src = src;
        }
        if (content) {
          script.innerHTML = content;
        }
        // script.crossOrigin = 'anonymous';
        script.type = 'text/javascript';
        script.onload = () => {
          script.setAttribute('data-btoaid', btoa(src));
          resolve();
        };
        script.onerror = () => {
          script.remove();
          reject();
        };
        tag.parentNode.insertBefore(script, tag);
      });
    });
    if (sync) {
      return promise;
    }
    promise.then();
  }

  setStyle() {
    const palette = this.styleVariablesService.palette;

    try {
      this.appService.currentTheme.next(this.portalConfig.COLORS ? JSON.parse(this.portalConfig.COLORS) : {
        primary: 'indigo',
        accent: 'amber',
        warn: 'red',
      });
    } catch (error) {
      this.appService.currentTheme.next({
        primary: 'indigo',
        accent: 'amber',
        warn: 'red',
      });
    }



    this.appService.currentTheme.subscribe(value => {
      const theme = JSON.parse(JSON.stringify(value));

      for (const Key of Object.keys(value)) {
        if (!_.includes(['primary', 'accent', 'warn', 'secondary'], Key)) {
          continue;
        }

        // if string then find the color and set
        if (typeof value[Key] === 'string' && palette.hasOwnProperty(value[Key])) {
          const color = this.styleVariablesService.getColor(value[Key]);
          theme[Key] = JSON.parse(JSON.stringify(color));
          this.styleManager.setColor(color, Key.slice(0, 1) as 'p' | 'a' | 'w' | 's');
          continue;
        }

        if (typeof value[Key] === 'object') {
          theme[Key] = JSON.parse(JSON.stringify(value[Key]));
          this.styleManager.setColor(value[Key], Key.slice(0, 1) as 'p' | 'a' | 'w' | 's');
        }
      }
      this.appService._currentTheme.next(theme);
    });
  }

  setFavIcon(href?: string) {
    if (href === null || href === '') {
      href = '/assets/icons/favicon.ico';
    }
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = href
    document.head.appendChild(link);
    // this.styleManager.setStyle('icon', href, 'image/png');
    // this.styleManager.setStyle('apple-touch-icon', href, 'icon');
  }

  setCurrencies(login = false) {
    const conf = this.portalConfig$.getValue();
    const supportedCurrenciesString = login ? conf.LOGINCURRENCIES : conf.CURRENCIES;
    const supportedCurrencies = this.langCurrCodes.getCurrConfigs(
      supportedCurrenciesString
        ? (JSON.parse(supportedCurrenciesString) as Array<{ CODE3: string }>).map(x => x.CODE3)
        : []
    );
    this.appService.supportedCurrencies.next(supportedCurrencies);

    const qCur = new URLSearchParams(window.location.search).get('currency');

    const isSupported = (x) => this.appService.supportedCurrencies.getValue().filter(y => y.curCode === x).length ? x : '';

    this.appService.defCurrency = isSupported(conf.DEFAULTCURRENCY) || supportedCurrencies[0].curCode;

    let cur = this.appService.defCurrency;
    const cookieCur = this.appService.getCookie('cur');
    if (qCur != null && isSupported(qCur)) {
      cur = qCur;
    } else if (cookieCur && this.appService.defCurrency === cookieCur) {
      cur = cookieCur;
    }

    // buylater dan gelirse currency değişmesin
    const basket = this.basketService.basket.get();
    if (basket.DeltaPrice && basket.Currency != cur) {
      cur = basket.Currency;
    }

    this.appService.currency.next(cur);
  }

  async setExchangeRates() {
    await this.exchangeService.getRates(this.portalConfig.HOTELID || this.appService.hotelID);
  }

  async setLanguage(params?: any) {
    const supportedLanguagesString = this.portalConfig$.getValue().LANGUAGES;
    const supportedLanguages = this.langCurrCodes.getLangConfigs(
      supportedLanguagesString ? (JSON.parse(supportedLanguagesString) as Array<{ CODE2: string }>).map(x => x.CODE2) : []);
    this.appService.supportedLanguages.next(supportedLanguages);

    if (supportedLanguages.length === 1) {
      this.appService.defLanguage = supportedLanguages[0].langKey;
    }

    this.appService.portalID = this.portalConfig.PORTALID;

    if (supportedLanguages.filter(f => { return f.langKey === this.navigatorLanguage }).length == 0) {
      this.navigatorLanguage = null;
    }

    this.appService.defLanguage = (this.navigatorLanguage || this.portalConfig$.getValue().DEFAULTLANGUAGE || supportedLanguages[0].langKey).toLowerCase();

    const qLang = new URLSearchParams(window.location.search).get('language');
    const cookieLang = this.appService.getCookie('lang');

    let lang = this.appService.defLanguage;
    if (qLang != null && this.appService.supportedLanguages.getValue().filter(x => x.langKey === qLang).length) {
      lang = qLang;
    } else if (cookieLang && this.appService.defLanguage === cookieLang) {
      lang = cookieLang;
    }
    this.translateService.use(lang, params);
    this.appService.language.next(lang);
    this.appService.setCookie('lang', lang, 1);
    if (this.portalConfig.COUNTRYCODE) {
      this.appService.defCountry.next(this.portalConfig.COUNTRYCODE);
    }
  }

  refreshLanguage() {
    this.translateService.use(this.appService.language.getValue());
  }

  async setMetaTags() {
    const conf = this.portalConfig$.getValue();
    this.seoService.defaultTags.next({
      default: conf.NAME,
      args: { title: conf.SEOTITLE, keywords: conf.SEOKEYWORDS, description: conf.SEODESCRIPTION, url: conf.LOGOURL }
    });
    const tags = this.seoService.defaultTags.getValue();
    this.seoService.createTags(tags.args, tags.default);
  }

  setScript(key: string) {
    this.styleManager.setScript(key);
  }
}
