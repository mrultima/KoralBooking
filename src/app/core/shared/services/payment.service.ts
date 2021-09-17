import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { AppService } from './app.service';
import { TranslateService } from './translate.service';

import moment from 'moment';


import * as _ from 'lodash';
import { BasketService } from './basket.service';
import { PortalService } from './portal.service';
import { PortalInjectionService } from './portal-injection.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export interface selectedInstalment {
  installmentCount: string;
  installmentComm: number;
  PosId: number;
  PaymentPrice: number;
  CommissionPrice: number;
  PaymentCurrency: string;
  PortalId: number;
  HotelId: number;
  Currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  paymentLabels = new BehaviorSubject({
    LBL_TOTAL_PRICE: 'LBL_TOTAL_PRICE',
    LBL_AMOUNT: 'LBL_AMOUNT',
    LBL_CC_CURRENCY: 'LBL_CC_CURRENCY',
    LBL_CC_DESCRIPTION: 'LBL_CC_DESCRIPTION',
    LBL_CC_HOLDER: 'LBL_CC_HOLDER',
    LBL_CC_NUMBER: 'LBL_CC_NUMBER',
    LBL_CC_MONTH: 'LBL_CC_MONTH',
    LBL_CC_YEAR: 'LBL_CC_YEAR',
    CREDITCARD_INSTALLMENT_COUNT: 'COUNT',
    CREDITCARD_INSTALLMENT_AMOUNT: 'AMOUNT',
    MSG_EMPTY_INSTALLMENT_TABLE: 'MSG_EMPTY_INSTALLMENT_TABLE'
  });


  isPaymentValid = new BehaviorSubject({
    type: '',
    data: '',
    valid: false
  });

  formGroup: FormGroup;

  agencyBalance$: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedInstallment: BehaviorSubject<selectedInstalment> = new BehaviorSubject(null);
  latestAgencyBalanceResponse = {
    data: '' as any,
    result: '' as any,
    time: '' as any
  };

  constructor(
    public api: ApiService,
    private appService: AppService,
    private translateService: TranslateService,
    public basketService: BasketService,
    public http: HttpClient,
    public portalService: PortalService,
    public portalInjection: PortalInjectionService
  ) {
    this.appService.language.subscribe(value => {

      const newLabels = {};
      for (const Key of Object.keys(this.paymentLabels.getValue())) {
        newLabels[Key] = this.translateService.transform(Key);
      }
      this.paymentLabels.next(newLabels as unknown as any);
    });

    //talepNo: 326215  alt acente her seçildiğinde limiti sorgula
    this.appService.selectSellerId.subscribe(sellerId => {
      this.getAgencyBalance();
    });
  }

  async getAgencyBalance() {

    let sellerId = this.appService.loginUser.value ? this.appService.loginUser.getValue().PORTALSELLERID : 0;

    if (this.appService.selectSellerId.value) {
      sellerId = this.appService.selectSellerId.getValue();
    }

    if (!sellerId) {
      return;
    }

    if (this.latestAgencyBalanceResponse.data === sellerId && moment(this.latestAgencyBalanceResponse.time).diff(moment()) > -60001) {
      this.agencyBalance$.next(this.latestAgencyBalanceResponse.result);
      return;
    }
    this.latestAgencyBalanceResponse.data = sellerId;
    await this.api.execSP({
      Object: 'SP_PORTAL_CHECKAGENCYLIMIT',
      Parameters: {
        'PORTALSELLERID': sellerId,
        'HOTELID': this.appService.hotelID || null
      }
    }).then(value => {
      this.latestAgencyBalanceResponse.result = _.get(value, '0.0');
      this.latestAgencyBalanceResponse.time = moment();

      if (value) {
        this.agencyBalance$.next(value[0][0]);
      }
    }).catch(reason => {
      this.latestAgencyBalanceResponse.result = undefined;
      this.latestAgencyBalanceResponse.time = moment();
      console.error(reason, 'line:50 / getAgencyBalance/payment-service');
    });
  }

  async checkOneHotelPos() {
    const basket = this.basketService.basket.get();
    const oneHotel = _.groupBy(basket.Items.HotelItems, 'ErsId');
    let hotelIdRet = 0;
    if (this.portalService.portalConfig.ISHOTELPAYMENTGATEINBASKET && oneHotel && Object.keys(oneHotel).length === 1) {
      const hotelId = Object.keys(oneHotel)[0];
      this.appService.hotelID = +hotelId;
      hotelIdRet = +hotelId;
    }
    return hotelIdRet;
  }

  async getInstallment(hotelId: number, isDefault: boolean, isDebit: boolean, paymentGateId?: number): Promise<Array<any>> {
    const hotelID = await this.checkOneHotelPos();
    const basket = this.basketService.basket.get();
    const roomTypeID = basket.Items?.HotelItems[0]?._PriceBlock?.ResParams.RoomTypeId
    const resp: Array<Array<{ DATA: string }>> = await this.api.execSP({
      Object: 'SP_PORTALV4_GETINSTALLMENT', Parameters: {
        HOTELID: hotelID || hotelId || 0,
        PAYMENTGATEID: paymentGateId,
        ISDEFAULTPAYMENTGATE: isDefault,
        ISDEBIT: isDebit,
        ROMMTYPEID: roomTypeID || this.portalInjection.ONLINE_SERVICE.formGroup.get('RoomTypeId')?.value || null
      }
    });
    if (resp) {
      const c = JSON.parse(resp[0][0].DATA);
      if (c.length > 0) {
        return c;
      } else {
        const respDef: Array<Array<{ DATA: string }>> = await this.api.execSP({
          Object: 'SP_PORTALV4_GETINSTALLMENT', Parameters: {
            HOTELID: hotelId || 0,
            PAYMENTGATEID: null,
            ISDEFAULTPAYMENTGATE: true,
            ISDEBIT: isDebit,
            ROMMTYPEID: roomTypeID || this.portalInjection.ONLINE_SERVICE.formGroup.get('RoomTypeId')?.value || null
          }
        });
        const c2 = JSON.parse(respDef[0][0].DATA);
        if (c2.length > 0) {
          return c2;
        }
      }
    }
  }

  //
  // async getCredidCardBank(binNumber: string) {
  //   binNumber = '%' + binNumber + '%';
  //
  //   const resp = await this.api.execSP({
  //     Object: 'SP_PORTALV4_GETPAYMENTGATEOFBINNUMBER', Parameters: {
  //       BINNUMBER: binNumber
  //     }
  //   });
  //   if (resp) {
  //
  //     return resp[0];
  //   }
  // }
  //
  // async getDebitCardBank(binNumber: string) {
  //   const resp = await this.api.select({
  //     Object: 'QB_PAYMENTGATE',
  //     Select: ['ID', 'NAME'],
  //     Paging: {Current: 1, ItemsPerPage: 1},
  //     Where: [{Column: 'DEBITBINNUMBERS', Operator: 'LIKE', Value: '%' + binNumber + '%'}],
  //   });
  //
  //   if (resp.ResultSets[0][0]) {
  //     return resp.ResultSets[0][0];
  //   } else {
  //     return null;
  //   }
  // }


  async getInstallements(isDefault: boolean, isDebit: boolean, paymentGateId?: string) {
    const hotelID = await this.checkOneHotelPos();
    const basket = this.basketService.basket.get();
    const roomTypeID = basket.Items?.HotelItems[0]?._PriceBlock?.ResParams.RoomTypeId
    const resp: Array<Array<{ DATA: string }>> = await this.api.execSP({
      Object: 'SP_PORTALV4_GETINSTALLMENT', Parameters: {
        HOTELID: hotelID || this.appService.hotelID,
        PAYMENTGATEID: (paymentGateId ? paymentGateId + ',' : null),
        ISDEFAULTPAYMENTGATE: isDefault,
        ISDEBIT: isDebit,
        ROMMTYPEID: roomTypeID || this.portalInjection.ONLINE_SERVICE.formGroup.get('RoomTypeId')?.value || null
      }
    });

    if (resp) {
      return JSON.parse(resp[0][0].DATA);
    } else {
      alert('Response is null');
      console.log('Response: ', resp);
      // throw new Error('Response is null');
    }
  }

  async processPaymentFn(binNumber: string) {

    const resultCC: Array<any> | undefined = await this.getCreditCardBank(binNumber);

    let paymentGateId;
    let isCC = true;
    if (resultCC != null && resultCC.length > 0) {
      paymentGateId = resultCC.map(value => value.ID).join(',');
    } else {
      isCC = false;
      const resultDebit = await this.getDebitCardBank(binNumber);
      if (resultDebit) {
        paymentGateId = resultDebit.ID;
      }
    }
    let tableData;
    if (paymentGateId) {
      tableData = await this.getInstallements(false, !isCC, paymentGateId);
    }
    if (tableData == null || tableData.length === 0) {
      tableData = await this.getInstallements(true, !isCC);
    }

    return { data: tableData, isDebit: isCC };
  }

  async buyLaterCreator(jsonData) {
    const resp = await this.api.execSP({
      Object: 'SP_PORTALV4_SAVECONTACTREQUEST', Parameters: {
        EMAIL: jsonData.Email,
        PHONE: jsonData.Phone,
        RESERVATIONREQUEST: JSON.stringify(jsonData),
        SESSION: this.appService.loginUser.getValue() ? this.appService.loginUser.getValue().SESSION : null,
        HOTELID: jsonData.HotelId,
        ISPAYMENT: true,
      }
    });

    if (resp == null) {
      alert('Empty result from createid');
      throw new Error('Empty result from createid');
    }

    return resp[0][0].UID;
  }

  async getCreditCardBank(binNumber: string) {
    binNumber = '%' + binNumber + '%';

    const resp = await this.api.execSP({
      Object: 'SP_PORTALV4_GETPAYMENTGATEOFBINNUMBER', Parameters: {
        BINNUMBER: binNumber
      }
    });
    if (resp) {

      return resp[0];
    }
  }

  async getDebitCardBank(binNumber: string) {
    const resp = await this.api.select({
      Object: 'QB_PAYMENTGATE',
      Select: ['ID', 'NAME'],
      Paging: { Current: 1, ItemsPerPage: 1 },
      Where: [{ Column: 'DEBITBINNUMBERS', Operator: 'LIKE', Value: '%' + binNumber + '%' }],
    });

    if (resp.ResultSets[0][0]) {
      return resp.ResultSets[0][0];
    } else {
      return null;
    }
  }

  makePayment(
    paymentData: any,
    buylaterId: string,
    currencyId: string,
    currency: string,
    url: string,
    isLatestBinNumberDebit: boolean) {
    if (paymentData.ApiPostUrl) {
      const objName = paymentData.ApiPostUrl;
      return this.api.startSequence$({
        Object: objName,
        Parameters: {
          POSID: paymentData.PosId,
          BASKETUID: buylaterId.toString(),
          HOTELID: paymentData.HotelId,
          AMOUNT: paymentData.PaymentPrice.toString(),
          CURRENCY: paymentData.CurrencyCode.toString(),
          CARDHOLDER: paymentData.CardHolderName.toString(),
          CARDNO: paymentData.CardNumber.toString(),
          CVC: paymentData.CardCvv.toString(),
          EXPIREMOUNTH: paymentData.CardValidMonth.toString(),
          EXPIREYEAR: paymentData.CardValidYear.toString(),
          INSTALLMENT: paymentData.InstallmentCount,
          LANGUAGE: paymentData.lang || 'tr',
          RETURNURL: url,
          BRAND: paymentData.Brand || null
        }
      });

    } else {
      return this.http.post(`${this.portalInjection.PORTAL_ENV.webApi}/api/Payment/MakePayment`, {
        CardNo: paymentData.CardNumber,
        ExpYear: paymentData.CardValidYear,
        ExpMonth: paymentData.CardValidMonth,
        CVV2: paymentData.CardCvv,
        CardHolderName: paymentData.CardHolderName,
        Amount: paymentData.PaymentPrice,
        Currency: currencyId,
        Installment: paymentData.InstallmentCount,
        InstallmentCom: paymentData.InstallmentCommission,
        // todo lang?
        Lang: 'tr',
        ProfileUID: buylaterId,
        BasketUID: buylaterId,
        BasketID: buylaterId,
        BasketItemsName: paymentData.Description,
        PostBack3d: url,
        callBackUrl: url,
        PostBack3dPay: url,
        hotelId: paymentData.HotelId,
        transType: 10,
        use3D: true,
        // isDebit: paymentData.IsDebit
        isDebit: isLatestBinNumberDebit || false
      }, {
        params: new HttpParams()
          .set('portalId', '' + paymentData.PortalId)
          .set('posId', '' + paymentData.PosId),
        headers: new HttpHeaders()
          .append('Content-Type', 'application/json')
          .append('Authorization', 'Basic eDox')
      });
    }
  }
}
