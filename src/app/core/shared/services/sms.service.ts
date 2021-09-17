import { Injectable } from '@angular/core';
import { SmsModel } from '../models/sms-model';
import { ApiService } from './api.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  latestSmsModel = {
    data: '' as any,
    result: '' as any
  };

  constructor(private api: ApiService) { }

  async SendSms(smsModel: SmsModel): Promise<boolean> {

    if (_.isEqual(this.latestSmsModel.data, smsModel)) {
      return this.latestSmsModel.result;
    }

    const resp =  await this.api.execSP
      ({
        Object: 'SP_PORTALV4_INSERT_SMS',
        Parameters:
        {
          'CONTENT': this.createContentBody(smsModel.ContentObj, smsModel.Content, smsModel.ContentType),
          'PHONE'  : smsModel.Phone,
        }
      });

    const bool = !!_.get(resp, '0.0.SUCCESS');

    this.latestSmsModel = {
      data: smsModel,
      result: bool
    };

    return bool;
  }

  createContentBody(contentObj : any, content: string, contentType: string) {
    const typeContent = "";

    switch (contentType) {
      case 'Reservation':
        //fill typeContent as type
        break;
      case 'Payment':
        //fill typeContent as type
        break;
      case 'BuyLater':
        //fill typeContent as type
        break;
      case 'HotelReminder':
        //fill typeContent as type
        break;
      default:
        break;
    }

    return content;
  }
}
