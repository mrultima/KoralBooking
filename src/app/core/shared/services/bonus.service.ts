import { Injectable } from '@angular/core';
import { Bonus } from '../models/basket-model';

import * as moment from 'moment';
import { AppService } from './app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PortalService } from './portal.service';
import { BehaviorSubject, of } from 'rxjs';

import { ApiService } from './api.service';
import { BasketService } from './basket.service';



interface OpexBonusResult {
  'access_token': string,
  'token_type': string,
  'expires_in': number,
  'userName': string,
  'userId': string,
  'userDepartment': string,
  'userDepartmentGroup': string,
  'userCompany': string,
  'userLanguage': string,
  'userRoleId': string,
  'userGroupId': string,
  'userAccount': string,
  'userImage': string,
  '.issued': string,
  '.expires': string


  'error'?: string,  //'invalid_grant',
  'error_description'?: string //'The user name or password is incorrect.'
}

@Injectable({
  providedIn: 'root'
})
export class BonusService {

  bonus: BehaviorSubject<Bonus> = new BehaviorSubject<Bonus>(undefined);
  latestAnswer = {
    data: '' as any,
    result: '' as any,
  };

  constructor(
    public appService: AppService,
    public http: HttpClient,
    public portalService: PortalService,
    public api: ApiService,
    public basketService: BasketService,
  ) {
  }

  // async getOpexToken(): Promise<undefined | string> {
  //
  //
  //   const response = this.api.execSP({
  //     Parameters: {},
  //     Object: 'OpexGetBonus'
  //   });
  //
  //  
  //   console.log('getOpexToken');
  //   let body = new URLSearchParams();
  //   body.set('userName', 'ersapi');
  //   body.set('password', '+ERSapiOpex.,');
  //   body.set('grant_type', 'password');
  //
  //   // const result = await this.http.post<OpexBonusResult>(this.opexUrl + '/Token', body).toPromise();
  //   const result = await of<OpexBonusResult>({
  //     'access_token': 'lopwLku8hP6221lqTlCfTBfy-SSG-OfdM1JKa6pXlL_LagtNf762VQIcRPz6sCtZLtpsTitt0KfGuFMAl0hEKw9-zJk7yKUj5MLL2vRm7bCvtfREq84AJdNwSR5a1bHxnZNDtQTjNAopcCudUw3KXuK9KR72Mjc2tekCCdYp83Xtq-iGstGe47PBAou_Z3rudnmVSbscJR56yQ299sFQ4uShcNdZvJIQ305XfbVoRCWS6K43M13QCg1lVbhiZ5puy8YdV89s1RUJu55WV4uExcBDiOVNz4P5Xyh4gFZhpF27yDYse5qabo_4Zta8JhQRIEQeslSCdhbj7JoSH7EOkE3fDOssDPxCN35CIrXwwaSqxTj5eRnHiYFQZrsy7jPqGK3KUPRRxR3Jpp7HjVD7gb7uzDzo__Y8HR4xUze_QBW8uPj--zxrBdTxCyqRPS2LUz0fPijlvTasbR0gx38v_5OGHAOISuj-8ecEG3FWXej1i4Zq4FWoISdpyVIOKEHRP9i4SIyqbQlsUoVZQG_l-9xWO4Y-wm1tMQvcSHPWS7P524e6TKtkDvjRDeY3h1H7qu4dUXiYVoM80eEqWrQjWCxbkStMNm3XjBwuMepWvt8Oks_bcsdEXUbvUPokXU7DjT44o7AVHSvMwHLxfQtxou-mvmW4d-0ExhvICnMdydbmAY8AEpZ3-Y5DooSQiCQ-5A8qvv9CGmLG_zAMQza_EY2LTBMkXoK4gS1CnfsuYOs',
  //     'token_type': 'bearer',
  //     'expires_in': 1209599,
  //     'userName': 'ersapi',
  //     'userId': '41842',
  //     'userDepartment': 'Bilgi İşlem',
  //     'userDepartmentGroup': '',
  //     'userCompany': 'Kaya Palazzo Belek,Kaya İzmir Thermal & Convention,Kaya Belek,Dorukkaya Ski & Mountain Resort,Kaya Palazzo Ski & Mountain Resort,Kaya İstanbul,Kaya Side,Kaya Green Park,Kaya Palazzo Resort & Casino,Kaya Uludağ,Kaya Artemis,Kaya Merkez',
  //     'userLanguage': 'tr',
  //     'userRoleId': '1',
  //     'userGroupId': '2',
  //     'userAccount': '',
  //     'userImage': '',
  //     '.issued': 'Mon, 11 Nov 2019 08:10:47 GMT',
  //     '.expires': 'Mon, 25 Nov 2019 08:10:47 GMT'
  //   }).toPromise();
  //
  //   if (result.hasOwnProperty('error')) {
  //     alert('Opex: ' + result.error_description);
  //     return;
  //   }
  //   return result.access_token;
  // }


  async opexGetBonus(username: string): Promise<Bonus | undefined> {
    if (this.latestAnswer.data === username) {
      return this.latestAnswer.result;
    }
    this.latestAnswer.data = username;
    // username = 'handan@elektra-soft.com';
    const result = await this.api.startSequence({
      Object: 'OpexGetBonus', Parameters: {EMAIL: username}
    }) as { status: 'error' | 'ok', message: string };


    if (result.message === 'Client not found') {
      result.status = 'ok';
      result.message = '0';
    }


    if (result.status === 'error') {
      alert(result.message);
      this.latestAnswer.result = undefined;
      return;
    }

    // opex return float with ',' so need to replace with '.' 
    result.message = result.message.replace(',', '.');
    if (!this.appService.isNumeric(result.message)) {
      alert(`Error: Can't parse bonus`);
      this.latestAnswer.result = undefined;
      return;
    }

    const finalResult = {
      Total: +this.appService.convertFormTo(+result.message, 'TRY', this.appService.defCurrency),
      Email: username,
      UpdateDate: this.appService.getDate(moment(), 'YYYY-MM-DD HH:mm'),
      CompleteDate: ''
    };
    this.latestAnswer.result = JSON.parse(JSON.stringify(finalResult));
    return finalResult;
  }

  async opexSpendOrRefundBonus(username, spend = true, amount?: number) {
    // username = 'handan@elektra-soft.com';

    const params = {
      EMAIL: username,
      UID: this.basketService.basket.get().BuyLater.Id
    };

    if (spend) {
      params['AMOUNT'] = amount;
    }

    const result: {
      'status': 'ok' | 'error',
      'message': '2'
    } = await this.api.startSequence({
      Object: spend ? 'OpexSpendBonus' : 'OpexRefundBonus',
      Parameters: params
    });
    // const result = await this.http.post<{ status: 'error' | 'ok', message: string }>(this.opexUrl + '/api/opex/PostClientBonusOnline', body, {
    //   headers: headers
    // }).toPromise();
    // const result = await of<{ status: 'error' | 'ok', message: string }>({
    //   'status': 'ok',
    //   'message': '2'
    // }).toPromise();

    if (result.status === 'error') {
      return result.message;
    }
    if (result.status === 'ok') {
      return true;
    }
  }
}
