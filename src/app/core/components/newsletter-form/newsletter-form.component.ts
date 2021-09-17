import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AppService, ApiService, TranslateService } from '../../shared';

@Component({
  selector: 'ta-core-newsletter-form',
  templateUrl: './newsletter-form.component.html',
  styleUrls: ['./newsletter-form.component.scss'],
})

export class NewsletterFormComponent implements OnInit {
  @Input() smsActive = false;
  formGroup: FormGroup;
  contactMessageError = false;
  saveContactMessage: BehaviorSubject<any> = new BehaviorSubject(null);
  inputElement: HTMLElement;

  constructor(
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public appService: AppService,
    public api: ApiService,
  ) {
    this.formGroup = this.formBuilder.group({
      NameSurname: '',
      Phone: '',
      EMail: ''
    });
  }

  ngOnInit() {
  }

  async saveContact(fStatus) {
    const fS = fStatus;
    const NameSurname = this.formGroup.controls.NameSurname.value;
    const Phone = this.formGroup.controls.Phone.value;
    const EMail = this.formGroup.controls.EMail.value;

    if (fS === 'SMS') {
      if (Phone === '') {
        this.contactMessageError = true;
        const messg = this.translate.data['LBL_ENTER_PHONE_NUMBER'] || '';
        this.saveContactMessage.next(messg);
      } else if (Phone) {
        const resp = await this.api.select({
          Object: 'QB_HOTEL_CONTACTREQUEST',
          Select: ['PHONE'],
          Where: [
            { Column: 'PHONE', Operator: '=', Value: Phone },
          ]
        });

        if (resp && resp.ResultSets && resp.ResultSets.length) {
          if (resp.ResultSets[0][0] == undefined) {
            await this.api.execSP({
              Object: 'SP_PORTALV4_INSERT_HOTEL_CONTACTREQUEST',
              Parameters: {
                'NAME': NameSurname,
                'SURNAME': '',
                'EMAIL': '',
                'PHONE': Phone,
                'PORTALID': this.appService.portalID.toString(),
                'STATUS': 0,
                'NOTES': 'Sms Listesi Aboneliği',  // V2 ve V3 versiyonlarında manuel yazıldığı için bu şekilde bırakıldı.
                'REQUESTDATE': new Date()
              }
            }).then(val => {
              this.contactMessageError = false;
              const messg = this.translate.data['LBL_REGISTER_SMS_LIST'] || '';
              this.saveContactMessage.next(messg);
            });
          } else {
            this.contactMessageError = true;
            const messg = this.translate.data['LBL_SIGNED_SMS_LIST'] || '';
            this.saveContactMessage.next(messg);
          }
        }
      }
    }

    if (fS === 'EMail') {
      if (EMail === '') {
        this.contactMessageError = true;
        const messg = this.translate.data['LBL_PLS_EMAIL_ADDRESS'] || '';
        this.saveContactMessage.next(messg);
      } else if (EMail) {
        const resp = await this.api.select({
          Object: 'QB_HOTEL_CONTACTREQUEST',
          Select: ['EMAIL'],
          Where: [
            { Column: 'EMAIL', Operator: '=', Value: EMail },
          ]
        });

        if (resp && resp.ResultSets && resp.ResultSets.length) {
          if (resp.ResultSets[0][0] == undefined) {
            await this.api.execSP({
              Object: 'SP_PORTALV4_INSERT_HOTEL_CONTACTREQUEST',
              Parameters: {
                'NAME': NameSurname,
                'SURNAME': '',
                'EMAIL': EMail,
                'PHONE': '',
                'PORTALID': this.appService.portalID.toString(),
                'STATUS': 0,
                'NOTES': '',
                'REQUESTDATE': new Date(),
                'HOTELNAME': 'Biz sizi arayalım' // V2 ve V3 versiyonlarında manuel yazıldığı için bu şekilde bırakıldı. 
              }
            }).then(val => {
              this.contactMessageError = false;
              const messg = this.translate.data['LBL_REGISTER_EMAIL_ADDRESS'] || '';
              this.saveContactMessage.next(messg);
            });
          } else {
            this.contactMessageError = true;
            const messg = this.translate.data['LBL_SIGNED_EMAIL_LIST'] || '';
            this.saveContactMessage.next(messg);
          }
        }
      }
    }
  }

}
