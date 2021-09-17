import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AppService, ApiService, TranslateService, PortalService } from '../../shared';

@Component({
  selector: 'ta-core-clicktocall',
  templateUrl: './clicktocall.component.html',
  styleUrls: ['./clicktocall.component.scss']
})
export class ClicktocallComponent implements OnInit {
  formGroup: FormGroup;
  portalInfo: any;
  contactMessageError = false;
  saveContactMessage: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private formBuilder: FormBuilder,
    public appService: AppService,
    public api: ApiService,
    public translate: TranslateService,
    public portalService: PortalService
  ) {
    this.portalInfo = this.portalService.portalConfig;
    
    this.formGroup = this.formBuilder.group({
      Name: '',
      Surname: '',
      Email: '',
      Phone: '',
      Notes: ''
    });
  }

  ngOnInit() {
  }

  async saveContact() {
    const Name = this.formGroup.controls.Name.value;
    const Surname = this.formGroup.controls.Surname.value;
    const Email = this.formGroup.controls.Email.value;
    const Note = this.formGroup.controls.Notes.value;
    const Phone = this.formGroup.controls.Phone.value;
    if (Phone) {
      await this.api.execSP({
        Object: 'SP_PORTALV4_INSERT_HOTEL_CONTACTREQUEST',
        Parameters: {
          'NAME': (Name || '') ,
          'SURNAME': (Surname || ''),
          'EMAIL': (Email || ''),
          'PHONE': (Phone || ''),
          'PORTALID': this.appService.portalID.toString(),
          'STATUS': 0,
          'NOTES': (Note || ''),
          'REQUESTDATE': new Date()
        }
      }).then(val => {
        const messg = this.translate.data['LBL_CLICTOCALLMESSAGE'] || '';
        this.saveContactMessage.next(messg);
      });
    } else {
      this.contactMessageError = true;
      const messg = this.translate.data['LBL_BUYLATER_FILL_CONTACT'] || '';
      this.saveContactMessage.next(messg);
    }
  }

}
