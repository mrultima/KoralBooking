import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { EmailModel } from '../models/email-model';
import * as _ from 'lodash';
import { Basket } from '../models/basket-model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  latestEmailModel = {
    data: '' as any,
    result: '' as any
  };

  constructor(private api: ApiService) {
  }

  async SendEmail(emailModel: EmailModel, basket?: Basket) {
    if (_.isEqual(this.latestEmailModel.data, emailModel)) {
      return this.latestEmailModel.result;
    }
    const hotelItems = basket.Items?.HotelItems;
    const resp = await this.api.execSP
    ({
      Object: 'SP_PORTALV4_INSERT_EMAIL_SENT',
      Parameters:
        {
          'CONTENT': this.createContentBody(emailModel.ContentObj, emailModel.Content, emailModel.ContentType),
          'EMAIL': emailModel.Email,
          'SUBJECT': emailModel.Subject,
          'HOTELID': emailModel.HotelId,
          'PORTALID': emailModel.PortalId,
          'CCTO': emailModel.CcTo ? (typeof(emailModel.CcTo) === 'object' ? this.joinStrArr(emailModel.CcTo) : emailModel.CcTo) : '',
          'REPLYTO': emailModel.ReplyTo ? this.joinStrArr(emailModel.ReplyTo) : '',
          'RESID':  hotelItems?.length > 0? hotelItems[0].resId: null,
          'ROOMTYPEID': hotelItems?.length > 0? hotelItems[0]._PriceBlock?.ResParams.RoomTypeId: null,
        }
    });

    const bool = !!_.get(resp, '0.0.SUCCESS');

    this.latestEmailModel = {
      data: emailModel,
      result: bool
    };

    return bool;
  }

  createContentBody(contentObj: any, content: string, contentType: string) {
    const typeContent = '';

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
        this.createHotelReminderContent(content);
        break;
      default:
        break;
    }

    return content;
  }

  createHotelReminderContent(content: string) {
    return content;
  }

  joinStrArr(stringArr: string[]) {
    return stringArr.join(',');
  }

}
