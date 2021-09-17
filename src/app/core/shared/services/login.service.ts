import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PortalService } from './portal.service';
import { AppService } from './app.service';
import { BehaviorSubject, zip, defer } from 'rxjs';
import { DialogService } from '../sharedDialogs/dialog.service';
import * as moment from 'moment';
import { TranslateService } from './translate.service';
import { BasketService } from './basket.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn = false;

  loginData: any;

  returnURL;

  checkLoginIn: BehaviorSubject<Boolean | string> = new BehaviorSubject('');

  loginEmail;

  constructor(
    public api: ApiService,
    public portalService: PortalService,
    public appService: AppService,
    public dialogService: DialogService,
    public translateService: TranslateService,
    public basketService: BasketService,
  ) {
    this.loginEmail = localStorage.getItem('loginEmail');
    this.appService.loginUser.subscribe(value => {
      this.portalService.setCurrencies(!!value);
      this.isLoggedIn = !!value;
    });
  }

  async activeLogin(uid: string) {
    return await this.api.select({
      Object: 'QB_PORTAL_SESSION',
      Paging: { Current: 1, ItemsPerPage: 1 },
      Where: [
        { Column: 'ID', Value: uid, Operator: '=' },
      ],
    }).then(response => {
      if (response.ResultSets) {
        return response.ResultSets[0];
      }
    });
  }

  async checkLogin() {

    if (!localStorage.getItem('loginUser')) {
      this.checkLoginIn.next(false);
      return;
    }

    const t = localStorage.getItem('loginToken');
    const token: { date: string, token: string } = t ? JSON.parse(t) : null;
    let refresh = false;
    if (token && typeof token === 'object') {
      if (moment().diff(moment(token.date)) > 3600000) {
        refresh = true;
      } else {
        this.appService.AngusLoginToken = token.token;
      }
    }
    if (refresh) {
      const result = await this.api.execute({ Action: 'Login', LoginToken: token.token }).toPromise();
      if (result && result.Success === true) {
        this.appService.AngusLoginToken = result.LoginToken;
        localStorage.setItem('loginToken', JSON.stringify(
          { token: result.LoginToken, date: moment().locale('en').format('YYYY-MM-DD HH:mm') }
        ));
      } else {
        this.appService.AngusLoginToken = null;
        localStorage.removeItem('loginToken');
      }
    }

    const parseLogin: { date: string, data: any } = JSON.parse(localStorage.getItem('loginUser'));
    const logout = () => {
      this.logout();
      this.checkLoginIn.next(false);
    };
    if (parseLogin.hasOwnProperty('date')) { // login olunan tarih yazılmışsa yeni formatta loginuser mı?
      if (parseLogin.data.HOTELID !== this.portalService.portalConfig.HOTELID) {
        return logout();
      }
      const isActive = moment(parseLogin.date).add(2, 'days').diff(moment()) > 0;
      if (isActive || this.appService.AngusLoginToken) {
        const check = await this.activeLogin(parseLogin.data.SESSION);
        if (!(check && check.length > 0 && check[0].ACTIVE)) {
          return logout();
        }
        this.checkLoginIn.next(true);
        this.appService.loginUser.next(parseLogin.data);
      } else { // storage daki tarih 2 günü geçmiş ise direkt logout et ve uyar
        logout();
        const url = new URL(window.location.href);
        let linkGo = '';
        if (!url.pathname.startsWith('/Login')) {
          url.pathname = '/Login';
          linkGo = '<a href="' + url.toString() + '">' + this.translateService.getKey('LBL_GOTO_LOGIN') + '</a>';
        }
        this.dialogService.openConfirmationDialog({
          buttonMode: 1,
          message: '<p>' + this.translateService.getKey('LBL_LOGIN_EXPIRED_WARN') + '</p><br>' + linkGo,
          icon: 'warning'
        });
      }
    }
  }

  async login(username, password, isCorp: boolean = true) {
    try {
      return zip(
        this.api.execSP$({
          Object: 'SP_PORTALV4_LOGIN', Parameters: {
            EMAIL: username,
            PASSWORD: password,
            PORTALID: this.appService.portalID,
            HOTELID: this.appService.hotelID,
            IPADDRESS: null,
            ISCORP: isCorp
          }
        }),
        defer(this.api.login.bind(this.api, {
          Usercode: username,
          Password: password,
          Tenant: this.appService.hotelID
        }))
      ).toPromise();
    } catch (e) { }
  }

  async getAgencyTaxInfo() {
    return await this.api.execSP({
      Object: 'SP_PORTALV4_GETAGENCYTAXINFO',
      Parameters: {
        'SESSION': this.appService.loginUser.value ? this.appService.loginUser.getValue().SESSION : null
      }
    });
  }

  logout() {
    this.appService.loginUser.next(null);
    localStorage.removeItem('loginToken');
    localStorage.removeItem('loginUser');
    localStorage.removeItem('loginEmail');
    localStorage.removeItem('loginGuest');
    localStorage.removeItem('basket');
    this.basketService.resetBasket();
    this.appService.selectSellerId.next(null);
    this.basketService.basketItemCount.next(0);
  }
}
