import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { PortalEnvironment, PORTAL_ENV } from './portal-injection.service';

export interface PortalLog {
  type: 'error' | 'log';
  data: any;
  message: string;
  uid: string;
  suid: string;

  appMode?: string; // appService.appMode
  hotelID?: number; // appService.hotelID
  portalID?: number; // appService.hotelID
  loginUser?: any; // appService.loginUser.getvalue
  currency?: string; // appService.loginUser.getvalue
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  uid: string;
  suid: string;
  loggedErrors = [];
  beforeLoad = [];

  constructor(
    private appService: AppService,
    private http: HttpClient,
    @Inject(PORTAL_ENV) public environment: PortalEnvironment,
  ) {
    this.startLog();
  }

  async startLog() {
    if (!this.environment.hasOwnProperty('logApi')) {
      return;
    }

    this.uid = this.appService.getCookie('logUID');

    /* const resp = await this.http.get(this.environment.nodeApi + '/guid').toPromise();
    if (typeof resp !== 'string') {
      alert('Guid is not string');
      return;
    }
    this.suid = resp as string; */

    this.suid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
    if (!this.uid) {
      this.uid = this.suid;
    }

    this.appService.setCookie('logUID', this.uid, 999);

    this.beforeLoad.forEach(value => {
      this.log(value[0], value[1], value[2]);
    });
  }

  log(data, message, type: 'error' | 'log') {
    if (!data || !message || !this.environment.production) {
      return;
    }

    if (!this.uid) {
      this.beforeLoad.push(arguments);
      return;
    }

    const isLoggedAlready = this.loggedErrors.filter(value => value.data === data && value.message === message);

    if (isLoggedAlready.length) {
      return;
    }
    this.loggedErrors.push({ data, message });

    const obj: PortalLog = {
      type,
      data,
      message,
      uid: this.uid,
      suid: this.suid,
      appMode: 'HOTEL',
      currency: this.appService.currency.getValue(),
      hotelID: this.appService.hotelID,
      loginUser: this.appService.loginUser.getValue(),
      portalID: this.appService.portalID,
    };

    let strObj;

    try {
      strObj = JSON.stringify(obj);
    } catch (e) {
    }

    if (!strObj) {
      return;
    }

    this.http.post(this.environment.logApi, strObj).subscribe(value => {

    });
  }
}
