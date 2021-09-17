import { Model, ModelFactory } from '@angular-extensions/model';
import { BehaviorSubject, Observable, ReplaySubject, zip, merge, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { distinctUntilChanged, map, pluck, skip, tap, catchError } from 'rxjs/operators';
import { AppService } from './app.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PostResponse } from '../models/PostResponse.model';
import { DialogService } from '../sharedDialogs/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from './translate.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { PORTAL_ENV, PortalEnvironment, PortalInjectionService } from './portal-injection.service';
import { BasketConfig } from '../models/shared-models';
import { Basket, PaymentGate, PaymentSettings } from '../models/basket-model';
import { EmailService } from './email.service';

import * as numeral_ from 'numeral'
const numeral = numeral_
export const BasketDefaultConfig = {
  'ID': 4167,
  'PORTALID': 1,
  'HOTELID': 0,
  'BASKET_ISPOPUP': false,
  'CALL_BUTTON': false,
  'PRINT_BUTTON': false,
  'MAIL_BUTTON': false,
  'HOMEPAGE_BUTTON': false,
  'SHOPPINGGO_BUTTON': true,
  'HOTELPERSON_ALLROW': true,
  'HOTELPERSON_GENDER': true,
  'HOTELPERSON_NAME': true,
  'HOTELPERSON_SURNAME': true,
  'HOTELPERSON_BIRTHDATE': false,
  'HOTELPERSON_NATIONALITY': false,
  'HOTELPERSON_MAIL': false,
  'HOTELPERSON_PHONE': false,
  'HOTELPERSON_PASSPORTNO': false,
  'HOTELPERSON_PASSPORTDATE': false,
  'HOTELPERSON_IDENTTYNO': false,
  'HOTELPERSON_HESKODU': false,
  'HOTELPERSON_HESKODU_REQURIED': false,
  'FLIGHTPERSON_ALLROW': true,
  'FLIGHTPERSON_GENDER': true,
  'FLIGHTPERSON_NAME': true,
  'FLIGHTPERSON_SURNAME': true,
  'FLIGHTPERSON_BIRTHDATE': true,
  'FLIGHTPERSON_NATIONALITY': true,
  'FLIGHTPERSON_PASSPORTNO': true,
  'FLIGHTPERSON_PASSPORTDATE': true,
  'FLIGHTPERSON_MAIL': false,
  'FLIGHTPERSON_PHONE': false,
  'FLIGHTPERSON_IDENTTYNO': false,
  'FLIGHTPERSON_FFP': true,
  'FLIGHTPERSON_FFPTYPE': true,
  'TRANSFERPERSON_ALLROW': true,
  'TRANSFERPERSON_GENDER': true,
  'TRANSFERPERSON_NAME': true,
  'TRANSFERPERSON_SURNAME': true,
  'TRANSFERPERSON_BIRTHDATE': true,
  'TRANSFERPERSON_NATIONALITY': true,
  'TRANSFERPERSON_MAIL': true,
  'TRANSFERPERSON_PHONE': true,
  'TRANSFERPERSON_PASSPORTNO': true,
  'TRANSFERPERSON_PASSPORTDATE': true,
  'TRANSFERPERSON_IDENTTYNO': true,
  'TOURPERSON_ALLROW': true,
  'TOURPERSON_GENDER': true,
  'TOURPERSON_NAME': true,
  'TOURPERSON_SURNAME': true,
  'TOURPERSON_BIRTHDATE': true,
  'TOURPERSON_NATIONALITY': true,
  'TOURPERSON_MAIL': true,
  'TOURPERSON_PHONE': true,
  'TOURPERSON_PASSPORTNO': true,
  'TOURPERSON_PASSPORTDATE': true,
  'TOURPERSON_IDENTTYNO': true,
  'CONTACT_NAME': true,
  'CONTACT_SURNAME': true,
  'CONTACT_MAIL': true,
  'CONTACT_PHONE': true,
  'CONTACT_ADDRESS': false,
  'CONTACT_CITY': false,
  'CONTACT_ZIPCODE': false,
  'CONTACT_COUNTRY': false,
  'CONTACT_EXTRANOT': true,
  'BASKET_INVOCE_VISIBLE': false,
  'BASKET_ADDRESS_VISIBLE': true,
  'BASKET_CITY_VISIBLE': false,
  'BASKET_POSTCODE_VISIBLE': false,
  'BASKET_COUNTRTY_VISIBLE': false,
  'BASKET_EXTRANOT_VISIBLE': false,
  'BASKET_BONUSCARD_VISIBLE': false,
  'BASKET_CARDFINANS_VISIBLE': false,
  'BASKET_AXESSCARD_VISIBLE': false,
  'BASKET_MAXIMUMCARD_VISIBLE': false,
  'BASKET_PARAFCARD_VISIBLE': false,
  'BASKET_WORDCARD_VISIBLE': false,
  'USE3DPAY': true,
  'IMAGES_INVISIBILITY': true,
  'HOTEL_INFO_INVISIBILITY': true,
  'HOTEL_DESCRIPTION_INVISIBILITY': true,
  'RATECODE_INVISIBILITY': true,
  'COMMENT_INVISIBILITY': true,
  'HOTEL_FACILITY_INVISIBILITY': true,
  'GALERY_INVISIBILITY': true,
  'CUSTOM_CONT1_INVISIBILITY': true,
  'CUSTOM_CONT2_INVISIBILITY': true,
  'CLICKTOCALL_TAB_INVISIBILITY': true,
  'CLICKTOCALL_INVISIBILITY': true,
  'HOTEL_MAP_INVISIBILITY': true,
  'TRANSFERPERSON_BIRTHDATE_REQURIED': false,
  'HOTELPERSON_BIRTHDATE_REQURIED': false,
  'TOURPERSON_BIRTHDATE_REQURIED': false,
  'FLIGHTPERSON_BIRTHDATE_REQURIED': false,
  'TOURITEM_DESCRIPTION': null,
  'HOTELITEM_DESCRIPTION': null,
  'TRANSFERITEM_DESCRIPTION': null,
  'FLIGHTITEM_DESCRIPTION': null,
  'EXTRASERVICE': false,
  'HOTELPERSON_VISA': false,
  'HOTELPERSON_FLIGHT': false,
  'TOURPERSON_VISA': false,
  'TOURPERSON_FLIGHT': false,
  'CUSTOMVALIDATIONS': null,
  'HOTELPERSON_SELECTADD': false,
  'PROJECTCODE_VISIBLE': false,
  'PORTALSELLERID': null,
  'HOTELPERSON_PASSPORTNO_REQURIED': false,
  'TOURPERSON_PASSPORTNO_REQURIED': false,
  'TRANSFERPERSON_PASSPORTNO_REQURIED': false,
  'FLIGHTPERSON_PASSPORTNO_REQURIED': false,
  'PROJECT_REQURIED': false,
  'MULTICREDITCARDPAYMENT_VISIBLE': false,
  'SENDBASKETMAIL_VISIBLE': true,
  'SUBDOMAIN': null,
  'CC_PHONE_VISIBLE': false,
  'CC_PHONE_REQURIED': false,
  'PHONE_REQURIED': false,
  'EMAIL_REQURIED': false,
  'BASKET_INVOICE_REQURIED': false,
  'BASKET_COUNTRTY_REQURIED': false,
  'BASKET_CITY_REQURIED': false,
  'BASKET_POSTCODE_REQURIED': false,
  'HOTELPERSON_GENDER_REQUIRED': false,
  'FLIGHTPERSON_GENDER_REQUIRED': true,
  'TRANSFERPERSON_GENDER_REQUIRED': false,
  'PASSISSUECITY_VISIBLE': false,
  'PASSISSUEDATE_VISIBLE': false,
  'BASKET_INSTALLMENT_VISIBLE': false,
  'TOURPERSON_PASSCARD': false,
  'PROFILE_TCCITIZEN_VISIBLE': true,
  'PROFILE_TCCITIZEN_DISCRIPTION': null,
  'TOUR_EXTRANOTE_VISIBLE': false,
  'TRANSFER_FLIGHTNO_VISIBLE': false,
  'PAYAT_SERVICE_VISIBLE': null,
  'HOTEL_CHILDBIRTDHDATEREQUIRED': false,
  'CONTACT_TC': false,
  'SAVECREDITCARD': false,
  'BUYLATERBUTTON_VISIBLE': true,
  'HOTELROOMTYPEIMAGE_VISIBLE': true,
  'HOTELROOMDAILYPRICE_VISIBLE': true,
  'TICKETPERSON_ALLROW': false,
  'VOUCHERPRICE_VISIBLE': true,
  'HOTEL_SEARCHBOXPROMOTION_VISIBLE': true,
  'BASKET_INSTALLMENT_OPEN': true,
  'BASKET_RESERVATION_INFO': true,
  'HOTELVOUCHER_VISIBLE': false,
  'VOUCHER_BANKCOMMISSION_VISIBLE': false,
  'VOUCHER_EXCHANGE_VISIBLE': false,
  'VOUCHER_CARDDETAIL_VISIBLE': false,
  'VOUCHER_PAYEDAMOUNT_VISIBLE': false,
  'BASKET_KDV_SERVICE_MSG_VISIBLE': true,
  'BASKET_INVOCE_TC_VISIBLE': true,
  'BASKET_INVOCE_TAXNO_VISIBLE': true,
  'BASKET_INVOCE_TAXPLACENAME_VISIBLE': true,
  'BASKET_AGREEMENTKVKK_CHECK_VISIBLE': false,
  'PAYTYPE': 'FULL' || 'NET',
  'BASKET_PROMOTION_VISIBLE': true,
  'HIDEPAYMENT_IF_WIRETRANSFER': false,
  'ROOMCODESMS': false,
  'CONTACTPERM_SMS': true,
  'CONTACTPERM_PHONE': true,
  'CONTACTPERM_EMAIL': true,
  'CONTACTPERM_WHATSAPP': true
};

enum CurrencyList {
  TRY,
  USD,
  EUR,
  GBP,
  MKD,
  LYD,
  IRR,
  AUD,
  DKK,
  CHF,
  SEK,
  CAD,
  KWD,
  NOK,
  SAR,
  JPY,
  BGN,
  RON,
  RUB,
  CNY,
  PKR,
  QAR,
  MAD
}

export const MAXIMUM_BASKET_PRICE = 100000000;

export interface IPartialPayment {
  'RemainingAmount': number;
  'TotalPayedAmount': number;
  'BasketTotal': number;
}

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  basket: Model<Basket>;
  basket$: Observable<Basket>;
  hostName = window.location.protocol + '//' + window.location.hostname;
  deleteBasket: BehaviorSubject<boolean> = new BehaviorSubject(false);
  gatherDataObj = {};
  carNote: string = ""

  basketConfig: BehaviorSubject<BasketConfig> = new BehaviorSubject(BasketDefaultConfig);
  basketItemCount: BehaviorSubject<number> = new BehaviorSubject(0);
  paymentsSettings: ReplaySubject<PaymentSettings[]> = new ReplaySubject(1);
  payHostingData: BehaviorSubject<any> = new BehaviorSubject(null);
  bonusResponse: BehaviorSubject<any> = new BehaviorSubject(null);

  private _basketLock$: Observable<boolean>;

  basketLock$ = new BehaviorSubject(false);

  public get priceFg(): FormGroup {
    return this.commissionFormGroup.get('priceFg') as FormGroup
  }

  get safeBasket(): Basket {
    const basket: Basket = JSON.parse(JSON.stringify(this.basket.get()));
    if (basket.PaymentGate) {
      basket.PaymentGate.CardCvv = '';
      basket.PaymentGate.CardNumber = '';
      basket.PaymentGate.CardValidYear = '';
      basket.PaymentGate.CardValidMonth = '';
    }
    basket.Profile.Note += this.carNote
    return basket;
  }

  // type: [0:NET, 1:GROSS, 2:CUSTOM]
  commissionFormGroup = this.fb.group({
    commTypeFc: [''],
    priceFg: this.fb.group({
      minPriceFc: [0],
      commPriceFc: [0, { updateOn: 'blur' }],
      finalPriceFc: [0, { updateOn: 'blur' }],

      firstPriceFc: [0, { updateOn: 'blur' }],
      discountPercentFc: [0, { updateOn: 'blur' }],
      discountAmountFc: [0, { updateOn: 'blur' }],
      lastPriceFc: [0, { updateOn: 'blur' }],
    })
  });
  confirm$ = new BehaviorSubject(false)
  commPriceFocus = false;
  sub1;
  latestcommPrice;
  latestcommPriceCur;

  isPayNowFromFinalPrice = true;

  partialCardTransactionModel: BehaviorSubject<IPartialPayment> = new BehaviorSubject(null);

  latestContactUpdateDataCache;

  allInstallment: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public basketModelFactory: ModelFactory<Basket>,
    public fb: FormBuilder,
    public api: ApiService,
    public router: Router,
    public appService: AppService,
    public dialog: DialogService,
    public matSnackBar: MatSnackBar,
    public http: HttpClient,
    public translateService: TranslateService,
    public portalInjectionService: PortalInjectionService,
    private emailService: EmailService,
    @Inject(PORTAL_ENV) private environment: PortalEnvironment,
  ) {

    let localBasket = JSON.parse(localStorage.getItem('basket'));
    if (localBasket
      && localBasket.ValidUntil
      && moment(localBasket.ValidUntil).isValid()
      && (
        moment.duration(moment(moment(localBasket.ValidUntil).toDate()).diff(new Date())).asMinutes() < 0 ||
        moment(localBasket.ValidUntil).day != moment().day
      )) {
      localBasket = null;
    };

    this.basket = this.basketModelFactory.create(localBasket || {
      PortalId: 1,
      Domain: 'www.ersbooking.com',
      Items: {
        HotelItems: [],
        ExtraServiceItems: []
      },
      Server: {
        Price: 0,
        Promotion: 0,
        PromotionCodes: []
      },
      Profile: {
        Name: '',
        Surname: '',
        Email: '',
        Address: '',
        Note: "",
        BasketCookieId: '',
        City: '',
        Country: '',
        Id: '',
        Language: '',
        Phone: '',
        PortalSession: '',
        TaxAddress: '',
        TaxName: '',
        TaxNo: '',
        TaxPlaceName: '',
        TaxType: '',
        TaxPhone: '',
        TaxNotTc: false,
        TcCitizen: false,
        Use3d: false,
        ZipCode: '',
        IAgree: false,
        BasketTotalCurrency: '',
        BasketTotalPayment: '',
        ProjectCode: '',
        VoucherNo: ''
      },
      PaymentGate: {
        PosId: null,
        InstallmentCount: null,
        PaymentPrice: null,
        CommissonPrice: null,
        CardHolderName: '',
        CardNumber: '',
        CardValidMonth: '',
        CardValidYear: '',
        CardCvv: ''
      },
      PaymentType: [],
      Currency: this.appService.currency.getValue() || 'TRY',
      Agreement: '',
      AgreementNotShowVoucher: false,
      BeAwareOfPromotions: false,
      isPreReservation: false,
      Language: this.appService.language.getValue() || 'TR',
      isPayedPartialPayment: false
      // Currency: 'TRY',
    });
    this.basket$ = this.basket.data$;

    this._basketLock$ = this.basket$.pipe(
      pluck('PaymentType'),
      distinctUntilChanged((x, y) => _.isEqual(x, y)),
      map(x => !!(x.filter(y => y.Id === 1 && y.isCompleted).length))
    );

    this._basketLock$.subscribe(value => {
      this.basketLock$.next(value);
    });

    // this.appService.currency.subscribe(value => {
    //   this.commissionFormGroup.get('commTypeFc').disable();
    //   this.commissionFormGroup.get('commTypeFc').enable();
    // });

    // minPriceFc: Number().toFixed 

    this.priceFg.get('finalPriceFc').valueChanges.subscribe(next => {

      const formValues = this.priceFg.getRawValue()

      // this.priceFg.patchValue({
      // 	finalPriceFc: next,
      // }, { emitEvent: false })
      const cPrice = Number(next - formValues.minPriceFc).toFixed(2)
      this.priceFg.patchValue({
        commPriceFc: Number(cPrice),
      }, { emitEvent: true })

      // this.priceFg.updateValueAndValidity({ onlySelf: false, emitEvent: true });

      this.confirm$.next(
        +next < +formValues?.minPriceFc || +next > +this.basket.get().Server?.Price
      )
    })

    this.commissionFormGroup.get('commTypeFc').valueChanges.subscribe((value: 'NET' | 'GROSS' | 'CUSTOM') => {


      this.commPriceFocus = false;
      const basket = this.basket.get();
      this.calculateBasketServer(basket);
      this.priceFg.disable({ emitEvent: false, onlySelf: false });

      this.priceFg.patchValue({
        minPriceFc: Number(basket.Server?.Price - basket.Server?.Commission).toFixed(2),
      }, { onlySelf: false });

      switch (value) {
        case 'NET': // Komisyonsuz Fiyattan
          this.priceFg.patchValue({

            commPriceFc: Number(0).toFixed(2),
            finalPriceFc: Number(basket.Server?.FinalPrice).toFixed(2),
            //
            firstPriceFc: Number(basket.Server?.Price).toFixed(2),
            discountPercentFc: Number(0).toFixed(2),
            discountAmountFc: Number(basket.Server?.CommisionDelta).toFixed(2),
            lastPriceFc: Number(basket.Server?.Price + basket.Server?.CommisionDelta).toFixed(2),
            //
          }, { onlySelf: false })
          break;
        case 'GROSS': // Komisyonlu Fiyattan
          this.priceFg.patchValue({

            commPriceFc: Number(basket.Server?.Commission).toFixed(2),
            finalPriceFc: Number(basket.Server?.FinalPrice).toFixed(2),
            //
            firstPriceFc: Number(basket.Server?.Price).toFixed(2),
            discountPercentFc: Number(0).toFixed(2),
            discountAmountFc: Number(0).toFixed(2),
            lastPriceFc: Number(basket.Server?.Price).toFixed(2),
            //
          }, { onlySelf: false })
          break;
        case 'CUSTOM': // Özel Fiyattan
          this.priceFg.patchValue({
            commPriceFc: Number(basket.Server?.Commission).toFixed(2),
            finalPriceFc: Number(basket.Server?.FinalPrice).toFixed(2),
            //
            firstPriceFc: Number(basket.Server?.Price).toFixed(2),
            discountPercentFc: Number(0).toFixed(2),
            discountAmountFc: Number(0).toFixed(2),
            lastPriceFc: Number(basket.Server?.Price).toFixed(2),
            //
          }, { onlySelf: false })
          this.priceFg.enable({ emitEvent: false, onlySelf: false });
          this.priceFg.get('minPriceFc').disable();
          break;
        default:
          break;
      }
    });

    this.priceFg.get('discountPercentFc').valueChanges.subscribe(value => {
      const _val = Number(value);
      const formValues = this.priceFg.getRawValue()
      if (!isNaN(_val)) {
        let lastPrice = formValues.firstPriceFc - Number((formValues.firstPriceFc * formValues.discountPercentFc) / 100)
        this.priceFg.patchValue({
          discountAmountFc: Number((formValues.firstPriceFc * formValues.discountPercentFc) / 100).toFixed(2),
          lastPriceFc: Number(lastPrice).toFixed(2),
        }, { emitEvent: false })

        this.priceFg.patchValue({
          finalPriceFc: Number(formValues.firstPriceFc - Number((formValues.firstPriceFc * formValues.discountPercentFc) / 100)).toFixed(2),
          commPriceFc: Number(lastPrice - formValues.minPriceFc).toFixed(2)
        }, { emitEvent: true })
      }
    });

    this.priceFg.get('discountAmountFc').valueChanges.subscribe(value => {
      const _val = Number(value);
      const formValues = this.priceFg.getRawValue()
      if (!isNaN(_val)) {
        let lastPrice = formValues.firstPriceFc - formValues.discountAmountFc;
        this.priceFg.patchValue({
          discountPercentFc: Number(formValues.discountAmountFc / (formValues.firstPriceFc) * 100).toFixed(2),
          lastPriceFc: Number(lastPrice).toFixed(2),
        }, { emitEvent: false })

        this.priceFg.patchValue({
          finalPriceFc: Number(formValues.firstPriceFc - formValues.discountAmountFc).toFixed(2),
          commPriceFc: Number(lastPrice - formValues.minPriceFc).toFixed(2)
        }, { emitEvent: true })
      }
    });

    this.priceFg.get('lastPriceFc').valueChanges.subscribe(value => {
      const _val = Number(value);
      const formValues = this.priceFg.getRawValue()
      if (!isNaN(_val)) {

        this.priceFg.patchValue({
          discountAmountFc: Number(formValues.firstPriceFc - formValues.lastPriceFc).toFixed(2),
          discountPercentFc: Number(((formValues.firstPriceFc - formValues.lastPriceFc) / formValues.firstPriceFc) * 100).toFixed(2),
        }, { emitEvent: false })

        this.priceFg.patchValue({
          finalPriceFc: Number(value).toFixed(2),
          commPriceFc: Number(value - formValues.minPriceFc).toFixed(2)
        }, { emitEvent: true })

      }
    });

    this.priceFg.get('commPriceFc').valueChanges.subscribe(value => {
      const _val = Number(value);
      if (!isNaN(_val)) {

        // if (_val < 0) {
        //   this.priceFg.get('commPriceFc').setValue(0);
        //   return;
        // }

        if (this.commPriceFocus) {
          const formValues = this.priceFg.getRawValue()
          this.priceFg.patchValue({
            finalPriceFc: Number(_val + Number(formValues.minPriceFc)).toFixed(2),
          }, { emitEvent: false })

          const finalPrice = Number(_val + +formValues.minPriceFc);
          this.confirm$.next(
            +finalPrice < +formValues?.minPriceFc || +finalPrice > +this.basket.get().Server?.Price
          )
        }
        const basket1 = this.basket.get();
        basket1.Server.FinalCommissionDelta = _val;
        this.latestcommPrice = _val;
        this.latestcommPriceCur = basket1.Currency;
        this.calculateBasketServer(basket1);
        if (!this.sub1) {
          this.sub1 = this.appService.currency.pipe(skip(1)).subscribe(value1 => {
            const basket2 = this.basket.get();
            // tslint:disable-next-line:max-line-length
            basket2.Server.FinalCommissionDelta = +this.appService.convertFormTo(this.latestcommPrice, this.latestcommPriceCur, basket2.Currency);
            this.calculateBasketServer(basket2);
            this.basket.set(basket2);
            this.commissionFormGroup.get('commTypeFc').updateValueAndValidity({})
          });
        }
        this.basket.set(basket1);
      }
      // this.commPriceFocus = false
    });

    this.basket$.subscribe(basket => {
      localStorage.setItem('basket', JSON.stringify(this.safeBasket));
      this.basketItemCount.next((basket.Items.HotelItems ? basket.Items.HotelItems.length : 0));

      if (basket.Server.FinalCommissionDelta !== this.priceFg.get('commPriceFc').value) {
        this.priceFg.get('commPriceFc').setValue(basket.Server.FinalCommissionDelta, { emitEvent: false, onlySelf: true });
      }
    });

    this.appService.loginUser.subscribe(value => {
      if (value) {
        const basket = this.basket.get();
        basket.Session = value.SESSION;
        this.basket.set(basket);
      }
    });
    // this.basket$.subscribe(value => {
    //   this.payNowPrice = value.Server.Price;
    // });
  }

  async dryrunCompleteRes() {
    // ödeme almadan önce yapılan fake bir rezervasyon.
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.completeRes(1);
        if (result && result.length === 1 && result[0].resp.RESID == -1) {
          const message = result[0].resp?.MESSAGE.split('<br />')[0] || 'Error: while completing basket'
          this.dialog.openShowErrors([{ message }]);
          return reject();
        }
      } catch (e) {
        alert('Error: while completing basket')
        return reject();
      }
      return resolve(true);
    });
  }

  resetBasket() {
    const basket: Basket = {
      PortalId: this.appService.portalID | 1,
      Domain: this.hostName,
      Items: {
        HotelItems: [],
        ExtraServiceItems: []
      },
      Server: {},
      Profile: {},
      PaymentGate: {},
      PaymentType: [],
      Currency: this.appService.currency.getValue() || 'TRY',
      Agreement: '',
      KvkkAgreement: '',
      BeAwareOfPromotions: false,
      AgreementNotShowVoucher: false,
      isPreReservation: false,
      isPayedPartialPayment: false,
      ExchangeRate: 1,
      ValidUntil: moment().toISOString()
    };

    this.calculateBasketServer(basket);

    if (this.appService.loginUser.getValue()) {
      basket.Session = this.appService.loginUser.getValue().SESSION;
    }
    this.basket.set(basket);
  }

  async ccConfirmation(basket: Basket, paymentGate: PaymentGate): Promise<void> {
    return new Promise((resolve, reject) => {
      // find currencyId
      let currencyId = 0;
      if (CurrencyList.hasOwnProperty(basket.Currency)) {
        currencyId = CurrencyList[basket.Currency];
      } else {
        alert('Basket\'s Currency Not Supported');
        return;
      }

      const hotelID = this.appService.hotelID;
      if (paymentGate.ApiSequenceUrl) {
        const objName = paymentGate.ApiSequenceUrl;
        this.api.startSequence$({
          Object: objName,
          Parameters: {
            POSID: basket.PaymentGate.PosId,
            BASKETUID: basket.BuyLater.Id.toString(),
            HOTELID: hotelID || 0,
            AMOUNT: paymentGate.PaymentPrice.toString(),
            CURRENCY: basket.Currency.toString(),
            CARDHOLDER: paymentGate.CardHolderName.toString(),
            CARDNO: paymentGate.CardNumber.toString(),
            CVC: paymentGate.CardCvv.toString(),
            EXPIREMOUNTH: paymentGate.CardValidMonth.toString(),
            EXPIREYEAR: paymentGate.CardValidYear.toString(),
            INSTALLMENT: paymentGate.InstallmentCount,
            LANGUAGE: this.appService.language.value ? this.appService.language.value : 'tr',
            RETURNURL: this.hostName + '/BankResponse/' + basket.BuyLater.Id,
            EMAIL: paymentGate.Email,
            OWNERADDRESS: paymentGate.OwnerAddress,
            OWNERZIP: paymentGate.OwnerZipCode,
            OWNERTOWN: paymentGate.OwnerCity,
            OWNERCITY: paymentGate.OwnerCountry,
            OWNERTELNO: paymentGate.OwnerPhone,
            BRAND: paymentGate.Brand || null
          }
        }).subscribe({
          next: (value: any) => {
            if (value && (value.status) && value.message) {
              this.router.navigate(['/BankResponse/' + basket.BuyLater.Id]);
            } else if (value && value[0] && value[0].Value) {
              this.dialog.openCCfromHtml(value[0].Value);
            }
            resolve();
          },
          error: () => resolve()
        });
      } else {

        const json = {
          'CardNo': paymentGate.CardNumber,
          'ExpYear': paymentGate.CardValidYear,
          'ExpMonth': paymentGate.CardValidMonth,
          'CVV2': paymentGate.CardCvv,
          'CardHolderName': paymentGate.CardHolderName,
          'Amount': paymentGate.PaymentPrice,
          'Currency': currencyId,
          'Installment': paymentGate.InstallmentCount,
          'InstallmentCom': paymentGate.InstallmentCommission,
          'Lang': this.appService.language.value ? this.appService.language.value : 'tr',
          'ProfileUID': basket.BuyLater.Id,
          'BasketUID': basket.BuyLater.Id,
          'BasketID': basket.BuyLater.Id,
          // TODO - low : change this
          'BasketItemsName': 'sıla',
          'callBackUrl': this.hostName + '/BankResponse/' + basket.BuyLater.Id,
          'hotelId': hotelID || 0,
          'transType': 10,
          'use3D': true,
          'isDebit': paymentGate.IsDebit || false,
          'TestMode': true
        };
        this.http.post(`${this.environment.webApi}/api/Payment/MakePayment`, json
          , {
            params: new HttpParams()
              .set('portalId', '' + basket.PortalId)
              .set('posId', '' + basket.PaymentGate.PosId),
            headers: new HttpHeaders()
              .append('Content-Type', 'application/json')
              .append('Authorization', 'Basic eDox')
          }).subscribe({
            next: (value: PostResponse.RootObject) => {
              if (value.hasOwnProperty('Error')) {
                alert(value['Error']);
                return;
              }
              // Nonsecure de xmlservis direkt complete yada hata mesajı ile bankresponse a yönlendirecek
              // 3D modellerde ise form dönecek ve o form üzerinden banka ekranına yönleniyoruz.
              if (value.Result.PostResult.Form && value.Result.PostResult.Form !== '') {
                this.dialog.openCCfromHtml(value.Result.PostResult.Form);
              }
              resolve();
            },
            error: () => resolve()
          });
      }
    });
  }

  // ccOrder() {
  //   const basket = this.basket.get();

  //   return this.http.post(`${this.environment.webApi}/api/Payment/OrderStatusByBasketUid`,
  //     null, {
  //     params: new HttpParams()
  //       .set('portalId', '' + basket.PortalId)
  //       .set('basketUid', '' + basket.BuyLater.Id),
  //     headers: new HttpHeaders()
  //       .append('Content-Type', 'application/json')
  //       .append('Authorization', 'Basic eDox')
  //   }).toPromise();
  // }


  async ccOrder() {
    const basket = this.basket.get();
    let tranList = await this.listCardTransactions(basket.BuyLater.Id);
    tranList = tranList.filter(x => x.TRANSACTIONSTATUS < 3);
    if ((basket.PaymentGate && basket.PaymentGate.ApiSequenceUrl) || (tranList)) {
      let objName = ''; // basket.PaymentGate.OrderSequenceUrl || '';
      try {
        await merge(...tranList.map((x) => {
          objName = x.ORDERURL ? x.ORDERURL : objName;
          const tranuid = x.TRANID;
          if (objName && objName != '') {
            return this.api.startSequence$({
              Object: objName,
              Parameters: {
                TRANID: tranuid,
              }
            });
          } else {
            return of(false);
          }
        })
        ).pipe(
          tap((value: any) => {
            if (value && value.Logs) {
              this.api.execSP$({
                Object: 'SP_PORTALV4_PORTALLOGS_INSERT', Parameters: {
                  'REQUESTDATA': JSON.stringify(value.Logs),
                  'RESPONSEDATA': JSON.stringify(value.Parameters),
                  'URL': objName || window.location.href
                }
              });
            }
          }),
          catchError(error => this.api.execSP$({
            Object: 'SP_PORTALV4_PORTALLOGS_INSERT', Parameters: {
              'REQUESTDATA': basket.BuyLater.Id || '',
              'RESPONSEDATA': JSON.stringify(error),
              'URL': objName || window.location.href
            }
          }))
        ).toPromise();
      } catch (e) {
      }
      return true;
    }
  }

  // voidOrder() {
  //   const basket = this.basket.get();

  //   return this.http.post(`${this.environment.webApi}/api/Payment/VoidTransaction`,
  //     null, {
  //     params: new HttpParams()
  //       .set('portalId', '' + basket.PortalId)
  //       .set('basketUid', '' + basket.BuyLater.Id),
  //     headers: new HttpHeaders()
  //       .append('Content-Type', 'application/json')
  //       .append('Authorization', 'Basic eDox')
  //   }).toPromise();
  // }

  async voidOrder() {
    const basket = this.basket.get();
    let tranList = await this.listCardTransactions(basket.BuyLater.Id, 3);
    if ((basket.PaymentGate && basket.PaymentGate.ApiSequenceUrl) || (tranList)) {
      let objName = '';
      try {
        await merge(...tranList.map((x) => {
          objName = x.VOIDURL ? x.VOIDURL : objName;
          const tranuid = x.TRANUID;
          if (objName && objName != '') {
            return this.api.startSequence$({
              Object: objName,
              Parameters: {
                TRANUID: tranuid,
              }
            });
          } else {
            return of(false);
          }
        })
        ).pipe(
          tap((value: any) => {
            if (value && value.Logs) {
              this.api.execSP$({
                Object: 'SP_PORTALV4_PORTALLOGS_INSERT', Parameters: {
                  'REQUESTDATA': JSON.stringify(value.Logs),
                  'RESPONSEDATA': JSON.stringify(value.Parameters),
                  'URL': objName || window.location.href
                }
              });
            }
          }),
          catchError(error => this.api.execSP$({
            Object: 'SP_PORTALV4_PORTALLOGS_INSERT', Parameters: {
              'REQUESTDATA': basket.BuyLater.Id || '',
              'RESPONSEDATA': JSON.stringify(error),
              'URL': objName || window.location.href
            }
          }))
        ).toPromise();
      } catch (e) {
      }
      return true;
    }
  }

  // refundOrder() {
  //   const basket = this.basket.get();

  //   return this.http.post(`${this.environment.webApi}/api/Payment/RefundTransaction`,
  //     null, {
  //     params: new HttpParams()
  //       .set('portalId', '' + basket.PortalId)
  //       .set('basketUid', '' + basket.BuyLater.Id),
  //     headers: new HttpHeaders()
  //       .append('Content-Type', 'application/json')
  //       .append('Authorization', 'Basic eDox')
  //   }).toPromise();
  // }
  async refundOrder() {
    const basket = this.basket.get();
    let tranList = await this.listCardTransactions(basket.BuyLater.Id, 3);
    if ((basket.PaymentGate && basket.PaymentGate.ApiSequenceUrl) || (tranList)) {
      let objName = '';
      try {
        await merge(...tranList.map((x) => {
          objName = x.REFUNDURL ? x.REFUNDURL : objName;
          const tranuid = x.TRANUID;
          if (objName && objName != '') {
            return this.api.startSequence$({
              Object: objName,
              Parameters: {
                TRANUID: tranuid,
              }
            });
          } else {
            return of(false);
          }
        })
        ).pipe(
          tap((value: any) => {
            if (value && value.Logs) {
              this.api.execSP$({
                Object: 'SP_PORTALV4_PORTALLOGS_INSERT', Parameters: {
                  'REQUESTDATA': JSON.stringify(value.Logs),
                  'RESPONSEDATA': JSON.stringify(value.Parameters),
                  'URL': objName || window.location.href
                }
              });
            }
          }),
          catchError(error => this.api.execSP$({
            Object: 'SP_PORTALV4_PORTALLOGS_INSERT', Parameters: {
              'REQUESTDATA': basket.BuyLater.Id || '',
              'RESPONSEDATA': JSON.stringify(error),
              'URL': objName || window.location.href
            }
          }))
        ).toPromise();
      } catch (e) {
      }
      return true;
    }
  }

  /* async contactStatusChange(status: number) {
    const basket = this.basket.get();
    await this.api.execSP({
    Object: 'SP_PORTALV4_UPDATE_CONTACTREQUEST_STATUS',
    Parameters: { 'STATUS': status, 'UID': basket.BuyLater.Id }
    });
  } */

  async completeRes(dryrun: Number = 0) {
    // const basket = this.basket.get();
    let observableArray: Observable<any>[] = [];

    // await this.contactStatusChange(6);
    for (const basketProcessor of this.portalInjectionService.BASKET_PROCESSORS) {
      const res = basketProcessor.complete(dryrun);
      try {
        observableArray = [...observableArray, ...res.observableArray];
      } catch (e) {
        console.error(e);
      }
    }

    const resp = await zip(...observableArray).toPromise();
    return resp;
  }

  async verifyBasket() {
    return new Promise(async (resolve, reject) => {
      try {

        let basket = this.basket.get();
        basket.Items?.HotelItems.forEach(item => {
          const
            adultCount = item._PriceBlock.PriceParams.Adult,
            childCount = item._PriceBlock.PriceParams.ChildAges === '' ? 0 : item._PriceBlock.PriceParams.ChildAges.split(' ').length;

          if (item.Person.filter(f => { f.TYPE === 'ADULT' }).length > adultCount || item.Person.filter(f => { f.TYPE === 'CHILD' }).length > childCount) {
            alert('Warning: can\'t complete basket');
            return reject();
          };

        })

      } catch (e) {
        alert('Error: while completing basket')
        return reject();
      }
      return resolve(true);
    });
  }

  async completeBasket() {
    await this.verifyBasket();
    await this.dryrunCompleteRes();
    await this.getBasketPayment();
    try {
      await this.contactUpdate();
    } catch (e) {
      alert('can\'t update contact');
      throw new Error('can\'t update contact');
    }
    const ret = await this.oldDateItem();

    if (ret) {
      const basket = this.basket.get();
      // Sepette Fazladan ödeme varsa mail atması için eklendi
      // örn 300 TL ürün attı ödeme yaptı ürün alamadı voidde olamadı ödeme,
      // müşteride ürün değiştirdi 250 TL lik attı 50 TL fazladan ödeme oldu.O zaman Uyar
      let priceMax = basket.Server.FinalPrice;
      switch (+basket.Server.PayType) {
        case 1: // tamamı
          priceMax = basket.Server.PayNow;
          break;
        case 2: // kaporalı
          priceMax = basket.Server.PayNowPercentAmount;
          break;
        case 3: // net tutar yani acenta komisyonu hariç
          priceMax = basket.Server.FinalPrice - (basket.Server.FinalCommissionDelta);
          break;
      }
      if (basket.Server.PayedTotalAmount >= priceMax) {
        const basketUID = basket.BuyLater.Id;
        let paymenIds = '';
        const url = window.location.host + '/Complete?UID=' + basketUID;
        const detail = await this.listCardTransactions(basketUID, 3);
        if (detail && detail[0]) {
          detail.forEach(x => {
            if (x.ID) {
              paymenIds = paymenIds + ', ' + x.ID;
            }
          });
        }
        const content = 'Aşağıdaki sepette fazladan ödeme alındı. / Overpayment was received in the basket below.'
          + '<br><br><strong> İletişim / Contact </strong><hr>'
          + '<br> Ad / Name        :' + basket.Profile.Name + ' ' + basket.Profile.Surname
          + '<br> Telefon /  Phone :' + basket.Profile.Phone
          + '<br> Eposta /  Email  :' + basket.Profile.Email
          + '<br> İşlem Id / TransactionId  :' + paymenIds
          + '<br> Sepet / Basket   :' + url + '<br>';
        this.sendPortalEmail(content);
      }

      basket.Language = this.appService.language.value || 'tr';
      // basket.PortalId = this.portalService.portalConfig.PORTALID;
      // basket.PortalId = 1;
      // console.log(basket);
      // const ref = await this.dialog.openFullscreenLoading('basket-complete');
      // eğer login olan adam headerdan seller seçmiş ise loginuserın içerisindeki SELLER alanını değiştiriyoruz.
      // ve Basket tamamlarken buradan okuyup baskette tamamlama ya gönderiyoruz.
      const storageLogin = this.appService.selectSellerId.getValue();
      if (storageLogin) {
        basket.PortalSellerId = storageLogin;
      }

      try {
        if (basket.PaymentType.length === 0) {
          return;
        }

        if (basket.PaymentType.length === 1 && (basket.PaymentType[0].Id === 1) || basket.PaymentType[0].Id === 10) {
          if (!basket.PaymentGate) {
            basket.PaymentGate = {};
          }
          if (basket.PaymentType[0].isCompleted) {
            this.router.navigate(['Complete']);
            // ref.detach();
            return;
          }
          if (basket.PaymentGate.CardNumber === '5475670139719640') {
            this.router.navigate(['BankResponse/' + basket.BuyLater.Id]);
            return;
          }
          const paygate: PaymentGate = {};
          if (basket.PaymentType[0].Id === 10) {
            paygate.CardHolderName = 'GarantiPay';
            paygate.CardNumber = '4999999999999999';
            paygate.CardValidMonth = '12';
            paygate.CardValidYear = '49';
            paygate.CardCvv = '123';
            paygate.PaymentPrice = basket.Server.PayNow;
            paygate.Currency = basket.Currency;
            paygate.HotelId = this.appService.hotelID;
            paygate.InstallmentCount = 1;
            paygate.ApiSequenceUrl = null;
            await this.ccConfirmation(basket, paygate);
          } else {
            basket.PaymentGate.PaymentPrice = basket.Server.PayNow;
            basket.PaymentGate.Currency = basket.Currency;
            await this.ccConfirmation(basket, basket.PaymentGate);
          }
          // ref.detach();
          return;
        }

        if (basket.PaymentType.length === 1 && (basket.PaymentType[0].Id !== 1) || basket.PaymentType[0].Id !== 10) {
          new TranslatePipe(this.translateService, this.appService)
            .transform(basket.PaymentType[0].Name).subscribe(translation => {
              basket.PaymentType[0].Name = translation;
            });
          this.router.navigate(['Complete'], {
            state: {
              fromBasket: true
            }
          });
        }
        // ref.detach();
      } catch (e) {
        // ref.detach();
        console.error(e);
      }
    }
  }

  async getBasketPayment() {
    const basket = this.basket.get();
    if (!basket.BuyLater) {
      return;
    }
    const basketPayed = await this.listCardTransactions(basket.BuyLater.Id, 3);
    let basketTotalPayed = 0;
    if (basketPayed && basketPayed[0]) {
      basketPayed.forEach(elm => {
        const amount = +this.appService.convertFormTo(elm.TOTAL, elm.CURRENCY, basket.Currency);
        basketTotalPayed = basketTotalPayed + amount;
        if (basket.PaymentType.filter(x => x.paymentId === elm.ID).length) {
          return;
        } else {
          const payType = {
            Id: 1,
            Name: elm.NAME,
            PayableAmount: elm.TOTAL,
            Currency: elm.CURRENCY,
            isCompleted: true,
            paymentId: elm.ID,
          };
          basket.PaymentType.push(payType);
        }
      });
      basket.Server.PayedTotalAmount = basketTotalPayed;
      this.basket.set(basket);
    }
  }

  async sendPortalEmail(content: string) {
    const portalEmail = this.portalInjectionService.STARTER_PORTAL_CONFIG.getValue().EMAIL;
    const login = this.appService.loginUser.getValue();
    const loginEmail = login ? this.basket.get().LoginInfo.Email : null;
    // Portala yada acentaya ödemenin fazla olduğunu bildir.
    const email = {
      Email: loginEmail ? loginEmail : portalEmail,
      Subject: 'Fazladan Ödeme Uyarısı / Overpay Alert',
      ContentObj: null,
      CcTo: loginEmail ? portalEmail : null,
      Content: content,
      ContentType: 'Payment Alert',
      HotelId: this.appService.hotelID,
      PortalId: this.appService.portalID,
    };
    this.emailService.SendEmail(email).then(val => {
    });
  }

  async oldDateItem() {
    const basket = this.basket.get();
    const oldItem = [];
    [...basket.Items.HotelItems].forEach(x => {
      if (moment(x._PriceBlock.ResParams.Checkin).diff(moment().format('YYYY-MM-DD')) < 0) {
        oldItem.push(x);
      }
    });

    if (oldItem.length > 0) {
      const message = this.translateService.getKey('MSG_OLD_ITEM_IN_BASKET');
      this.dialog.openHtml(message);
      return false;
    } else {
      return true;
    }
  }

  async get3DPayHosting() {
    const resp = await this.api.select({
      Object: 'QB_HOTEL_PAYMENTGATE',
      Select: ['ID', 'TEXTCONTENT', 'POSTURL', 'POSNAME'],
      Where: [
        { Column: 'HOTELID', Operator: '=', Value: this.appService.hotelID.toString() },
        { Column: 'ACTIVE', Operator: '=', Value: 'true' },
        { Column: 'THREEDTYPE', Operator: '=', Value: '3' },
      ]
    });
    if (resp && resp.ResultSets[0][0]) {
      this.payHostingData.next(resp.ResultSets[0]);
    }
  }

  // bütün steplerden verileri toplamak için her step'in içinde gatherDataArray'e fonksiyon register edildi bu fonksiyonları çalıştır
  async gatherData() {
    const basket = this.basket.get();

    for (const key of Object.keys(this.gatherDataObj)) {
      await this.gatherDataObj[key](basket);
    }
    this.basket.set(basket);
  }


  calculateBasketServer(basket: Basket) {

    if (!basket.Items.ExtraServiceItems) {
      basket.Items.ExtraServiceItems = [];
    }

    if ((basket.Items.HotelItems && basket.Items.HotelItems.length > 0)
      || (basket.Items.ExtraServiceItems && basket.Items.ExtraServiceItems.length > 0)) {

      if (basket.DeltaPrice) {
        return;
      }
      basket.Server.UsedBonus = Number(this.appService.convert(basket.Server.Bonus));
      basket.Server.Price = Number(this.appService.convert(this.sumBasketThings(basket, (acc, value) => acc +
        (value != null && value._PriceBlock != null ? value._PriceBlock.PriceParams.FinalPrice : 0))));
      basket.Server.PromotionAmount = Number(this.appService.convert(this.sumBasketThings(basket, (acc, value) =>
        acc + (value != null && value._PriceBlock != null ? value._PriceBlock.PriceParams.PromotionAmount : 0))));
      basket.Server.Commission = Number(this.appService.convert(this.sumBasketThings(basket, (acc, value) => acc +
        (value != null && value._PriceBlock != null ? value._PriceBlock.PriceParams.Commission || 0 : 0))));
      basket.Server.FinalCommissionDelta =
        Number(this.commissionFormGroup.get('commTypeFc').value === 'NET' ? 0 :
          (this.commissionFormGroup.get('commTypeFc').value === 'GROSS' ? basket.Server.Commission :
            (this.commissionFormGroup.get('commTypeFc').value === 'CUSTOM' && this.commPriceFocus ?
              (basket.Server.FinalCommissionDelta || 0) : basket.Server.Commission)));
      // commission Deltada Düşülen tutar yazılacak yada eklenen
      basket.Server.CommisionDelta = basket.Server.FinalCommissionDelta - basket.Server.Commission;
      basket.Server.PosCommisionDelta = Number(this.appService.convert(this.sumBasketThings(basket, (acc, value) => acc +
        (value != null && value._PriceBlock != null ? value._PriceBlock.PriceParams.PosCommissionDelta : 0))));
      basket.Server.FinalPrice = (basket.Server.Price - basket.Server.Commission) + (basket.Server.FinalCommissionDelta || 0) +
        (basket.Server.BankCommission || 0);
      basket.Server.PayNow = (this.isPayNowFromFinalPrice ? basket.Server.FinalPrice :
        basket.Server.PayNow) - (basket.Server.PayedTotalAmount || 0);
      basket.Server.PriceContract = Number(this.appService.convert(this.sumBasketThings(basket, (acc, value) => acc +
        (value != null && value._PriceBlock != null && value._PriceBlock.PriceParams.PriceContract ?
          value._PriceBlock.PriceParams.PriceContract : (value._PriceBlock.PriceParams.FinalPrice || 0)))));
      basket.Server.PayNowPercent = Number(this.sumBasketThings(basket, (acc, value) => acc +
        (value != null && value._PriceBlock != null && value._PriceBlock.PriceParams.PayNowPercent ?
          value._PriceBlock.PriceParams.PayNowPercent : 0)));


      basket.Server.PayNowPercentAmount = Number(this.appService.convert(this.sumBasketThings(basket, (acc, value) => acc +
        (value != null && value._PriceBlock != null ? (value._PriceBlock.PriceParams.FinalPrice * value._PriceBlock.PriceParams.PayNowPercent / 100) : 0))));
      basket.Items.ExtraServiceItems.forEach(row => {
        const selectedPrice = row.SelectedPrice;
        basket.Server.PayNowPercentAmount += selectedPrice;
        row.Price = selectedPrice * (1 - Math.abs(basket.Server?.CommisionDelta / basket.Server?.Price));
      });

      let extraServicePrice = 0;
      switch (+basket.Server.PayType) {
        case 1: // tamamı
          basket.Server.PayNow = basket.Server.PayNow;
          break;
        case 2: // kaporalı
          basket.Items.ExtraServiceItems.forEach(row => {
            extraServicePrice += +this.appService.convert(row.SelectedPrice * (1 - Math.abs(basket.Server?.CommisionDelta / basket.Server?.Price)));
          });
          basket.Server.PayNow = (basket.Server.FinalPrice - extraServicePrice) * basket.Server.PayNowPercent / 100 + extraServicePrice
          break;
        case 3: // net tutar yani acenta komisyonu hariç
          basket.Server.PayNow = basket.Server.FinalPrice - (basket.Server.FinalCommissionDelta);
          break;
      }

      basket.Items.ExtraServiceItems.forEach(row => {
        extraServicePrice += +(row.SelectedPrice - row.Price);
      });

      basket.Server.ExtraServiceFinalPrice = extraServicePrice;

      this.basket.set(basket);
    } else {
      basket.Server.Price = 0;
      basket.Server.PromotionAmount = 0;
      basket.Server.PayNow = 0;
      basket.Server.Commission = 0;
      basket.Server.CommisionDelta = 0;
      basket.Server.FinalCommissionDelta = 0;
      basket.Server.FinalPrice = 0;
      basket.Server.BankCommission = 0;
      basket.Server.PosCommisionDelta = 0;
      basket.Server.PromotionCodes = [];
      basket.Server.PayedTotalAmount = 0;
      basket.Server.PriceContract = 0;
      basket.Server.PayNowPercent = 0;
      basket.Server.PayNowPercentAmount = 0;
    }
    let oldData = this.allInstallment.getValue();
    oldData = oldData ? Object.values(oldData) : null;
    oldData = oldData && oldData.length > 0 ? oldData[0].filter(x => {
      if (x.INSTALLMENTAMOUNT === 1) {
        return x;
      }
    }) : null;
    if (oldData && oldData[0].COMMPRICE !== basket.Server.FinalPrice) {
      this.getAllInstallment();
    }
    return basket;
  }

  sumBasketThings(basket: Basket, func) {
    // tslint:disable-next-line: max-line-length
    return [
      ...basket.Items.HotelItems,
      ...basket.Items.ExtraServiceItems,
    ].reduce(func, 0);
  }

  async basketLockWarning() {
    if (this.basketLock$.getValue()) {
      const result = await this.dialog.openConfirmationDialog({
        message: this.translateService.getKey('WARN_CLEARBASKET'),
        icon: 'error',
        buttonMessages: ['LBL_NO', 'LBL_YES']
      }).afterClosed().toPromise();
      return !result;
    }
  }

  async clearAllItems() {
    const basket = this.basket.get();
    if (basket.isPayedPartialPayment && this.basketLockWarning()) {
      return false;
    }
    const hotelItemsLength = (basket.Items.HotelItems ? basket.Items.HotelItems.length : 0);
    const extraServiceItemsLength = (basket.Items.ExtraServiceItems ? basket.Items.ExtraServiceItems.length : 0);

    if (hotelItemsLength > 0) {
      basket.Items.HotelItems.splice(0, hotelItemsLength);
    }

    if (extraServiceItemsLength > 0) {
      basket.Items.ExtraServiceItems.splice(0, extraServiceItemsLength);
    }
    this.removePreReservation();

    const basketProfile = basket.Profile;
    this.resetBasket();
    const basket2 = this.basket.get();
    basket2.Profile = basketProfile;
    this.basket.set(basket2);
  }

  getBasketCount() {
    let itemsLength = 0;
    itemsLength += (this.basket.get().Items.HotelItems ? this.basket.get().Items.HotelItems.length : 0)
      + (this.basket.get().Items.ExtraServiceItems ? this.basket.get().Items.ExtraServiceItems.length : 0);
    return itemsLength;
    // localStorage.removeItem('basket');
  }

  async contactInsert(row: { [key: string]: any }, basket?: Basket) {
    const result = {};
    for (const rowKey of Object.keys(row)) {
      result[rowKey.toUpperCase()] = row[rowKey];
    }

    try {
      // debugger
      // if (basket.Profile.HCRID !== undefined && basket.Profile.HCRID) {
      // 	await this.contactUpdate();
      // 	return;
      // }

      if (row["Phone"] === '') {
        return;
      }

      const resp = await this.api.execSP({
        Object: 'SP_PORTALV4_SAVECONTACTREQUEST',
        Parameters: {
          ...result, ...{
            'RESERVATIONREQUEST': JSON.stringify(this.safeBasket),
            'SESSION': this.appService.loginUser.getValue() ? this.appService.loginUser.getValue().SESSION : null,
            'HOTELID': this.appService.hotelID,
            'CALLID': this.appService.getCookie('callid'),
            'HCRID': basket.Profile.HCRID,
          }
        }
      });

      basket.BuyLater = {
        Id: resp[0][0]['UID'],
        Date: this.appService.getDate(moment())
      };
      this.basket.set(basket);
      // needed for notes
      await this.contactUpdate();
    } catch (e) {
      console.error(e);
    }
  }

  async contactUpdate(sender: boolean = false, isCustomer: boolean = true): Promise<boolean> {
    const basket = this.basket.get();

    basket.ExchangeRate = this.appService.getRate(basket.Currency);
    await this.gatherData();

    if (!basket.BuyLater || (basket.BuyLater && moment().diff(basket.BuyLater.Date) >= 259200000)) { // 3 day = 259200000 milisecond
      if (basket.Profile.Email || basket.Profile.Phone) {
        await this.contactInsert({
          NAME: basket.Profile.Name,
          SURNAME: basket.Profile.Surname,
          EMAIL: basket.Profile.Email,
          PHONE: basket.Profile.Phone,
          ADDRESS: basket.Profile.Address,
          CITY: basket.Profile.City,
          COUNTRY: basket.Profile.Country,
          ZIPCODE: basket.Profile.ZipCode,
          TC: basket.Profile.Tc
        }, this.safeBasket);
      } else {
        return;
      }
    }

    try {

      const params = {
        REQUESTUID: basket.BuyLater.Id,
        RESERVATIONREQUEST: JSON.stringify(this.safeBasket),
        NOTES: this.createNotes(),
        CALLBACK: sender && isCustomer,
        PAYMENTLINK: sender && !isCustomer,
      };
      if (!_.isEqual(this.latestContactUpdateDataCache, params)) {
        const resp = await this.api.execSP({
          Object: 'SP_UPDATECONTACTREQUEST',
          Parameters: params
        });
        this.latestContactUpdateDataCache = params;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async contactComplete() {
    const basket = this.basket.get();
    await this.api.execSP({
      Object: 'SP_PORTALV4_UPDATE_CONTACTREQUEST_STATUS',
      Parameters: { 'STATUS': 2, 'UID': basket.BuyLater.Id }
    });
  }

  async basketChangeStatus(status) {
    const basket = this.basket.get();
    await this.api.execSP({
      Object: 'SP_PORTALV4_BASKET_CHANGESTATUS',
      Parameters: { 'NEWSTATE': status, 'BASKETUID': basket.BuyLater.Id }
    });
  }

  setEnrollGuest() {
    const basket = this.basket.get();
    if (basket.BeAwareOfPromotions) {
      return this.api.execSP$({
        Object: 'SP_PORTALV4_INSERT_HOTEL_CONTACTREQUEST',
        Parameters: {
          'NAME': basket.Profile.Name,
          'SURNAME': basket.Profile.Surname,
          'EMAIL': basket.Profile.Email,
          'PHONE': basket.Profile.Phone,
          'PORTALID': basket.PortalId,
          'STATUS': 0,
          /** 2019-07-29 Aslı Ayanlar ilk gelen kayıt 0=Requested statusunde olmalı o nedenle STATUS= 1  => STATUS=0 olarak değiştirildi*/
          'NOTES': basket.Profile.Note,
          'REQUESTDATE': new Date()
        }
      }).toPromise();
    }
    return Promise.resolve();
  }

  createNotes() {
    let notes = [];
    const basket = this.basket.get();

    for (const basketProcessor of this.portalInjectionService.BASKET_PROCESSORS) {
      try {
        const note = basketProcessor.notes();
        if (note) {
          notes = [...notes, ...note];
        }
      } catch (e) {
      }
    }

    return JSON.stringify(notes);
  }

  // checkLocalPriceExist():boolean {
  //   // const baket = this.basket.get();
  //   let exist = false;
  //   // if (baket.Items.TicketItems.length > 0) {
  //   //   exist = baket.Items.TicketItems.filter(function (o) {
  //   //     return o.Price.MARKETID != null;
  //   //   }).length > 0;
  //   // } else {
  //   //   return;
  //   // }
  //   return exist;
  // }

  checkPreReservation() {
    let continueProcess = true;
    const basket = this.basket.get();
    if (basket.isPreReservation !== undefined && basket.isPreReservation === true) {
      continueProcess = false;
    }
    return continueProcess;
  }

  removePreReservation() {
    const basket = this.basket.get();
    if (basket.isPreReservation) {
      basket.isPreReservation = false;
    }
    this.basket.set(basket);
  }

  async listCardTransactions(transactionId: string, transactionStatus: number = null) {
    let response = await this.api.execSP({
      Object: 'SP_PORTALV4_LISTCARDTRANSACTIONS',
      Parameters: {
        'BUYLATERID': transactionId,
        'TRANSACTIONSTATUS': transactionStatus
      }
    });

    if (response && response.length > 0 && response[0].length > 0) {
      const basket = this.basket.get();
      let payedAmount = 0;
      response[0].forEach(transaction => {
        payedAmount += transaction.TOTAL;
      });

      let rema = (basket.Server.FinalPrice) - payedAmount;
      if (rema < 0) {
        rema = 0;
      }
      const transactionModel: IPartialPayment = {
        BasketTotal: basket.Server.FinalPrice,
        RemainingAmount: rema,
        TotalPayedAmount: payedAmount
      };
      this.partialCardTransactionModel.next(transactionModel);
    }
    return response[0];
  }


  findAndDeleteExtraServiceOnProduct(product: any, type: string) {
    const basket = this.basket.get();
    if (basket.Items.ExtraServiceItems && basket.Items.ExtraServiceItems.length > 0) {
      switch (type) {
        case 'hotel': {
          const extras = _.filter(basket.Items.ExtraServiceItems, function (extraItem) {
            return extraItem._PriceBlock.ResParams.HotelId === product.ErsId;
          });
          if (extras !== null && extras.length > 0) {
            basket.Items.ExtraServiceItems = [];
          }
          this.basket.set(this.calculateBasketServer(basket));
          break;
        }
        case 'ticket': {
          break;
        }
        case 'tour': {
          break;
        }
        case 'flight': {
          break;
        }
        default:
          break;
      }

    }
  }

  async getAllInstallment() {
    const basket = this.basket.get();
    const basketPrice = (basket.Server.PayNow != null || basket.Server.PayNow !== 0 ? basket.Server.PayNow : basket.Server.FinalPrice).toFixed(2);
    const basePrice = basket.Server.PriceContract || 0;
    const hotelID = basket.Items.HotelItems.length === 1 ? basket.Items.HotelItems[0].ErsId : 0;
    const resp = await this.api.execSP({
      Object: 'SP_PORTALV4_GETPORTAL_INSTALLMENT',
      Parameters: {
        HOTELID: hotelID,
        AMOUNT: +basketPrice,
        CURRENCY: basket.Currency,
        BASEPRICE: basePrice
      }
    });
    if (resp && resp[0]) {
      const groupedData = _.groupBy(resp[0], 'NAME');
      this.allInstallment.next(groupedData);
      return groupedData;
    }
  }

  async getBonusAmount(phoneNumber: string) {
    const basket = this.basket.get();
    try {
      const resp = await this.api.execSP({
        Object: 'SP_PORTALV4_SENDGUESTPIN',
        Parameters: {
          HOTELID: this.appService.hotelID.toString(),
          PHONE: phoneNumber,
          GUESTNAME: basket.Profile.Name,
          GUESTLNAME: basket.Profile.Surname
        }
      });
      if (resp && resp[0] && resp[0].length > 0) {
        this.bonusResponse.next(resp[0][0]);
      }
      return resp;
    } catch (error) {
      this.dialog.openShowErrors([error.error])
    }
  }
}
