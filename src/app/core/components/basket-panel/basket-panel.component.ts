import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BasketPanelItems } from './basket-panel-items';

import * as moment from 'moment';
import * as numeral_ from 'numeral';
import { takeUntil } from 'rxjs/operators';
import {
  AppService,
  BasketContactApiService,
  BasketService,
  DialogService,
  EmailService,
  HomePageService,
  PortalInjectionService,
  PortalService,
  SmsService,
  TranslateService,
} from '../../shared';
import { MatDialog } from '@angular/material/dialog';
import { BasketPanelBuylaterDialogComponent } from './basket-panel-buylater-dialog/basket-panel-buylater-dialog.component';



const numeral = numeral_;

@Component({
  selector: 'ta-core-basket-panel',
  templateUrl: './basket-panel.component.html',
  styleUrls: ['./basket-panel.component.scss']
})
export class BasketPanelComponent extends BasketPanelItems implements OnInit, AfterViewInit, OnDestroy {
  @Input() convertCompleteBtn = false;
  @Input() hideAgreementSection = false;
  @Input() hideBuylaterButton = false;
  @Input() hideContinueShoppingButton = false;

  @ViewChild('panelItemContainer', { read: ViewContainerRef }) panelItemContainer: ViewContainerRef;

  acceptPromotion = new FormControl(false);
  buylaterMessage: BehaviorSubject<any> = new BehaviorSubject(null);

  isMobile: boolean;
  isBasket = false;
  buylaterButton = true;
  smsLabel = true;
  kdvLabel = true;

  panelItemsRef: ComponentRef<any>[] = [];

  constructor(
    public basketService: BasketService,
    public router: Router,
    public appService: AppService,
    public homePageService: HomePageService,
    public dialog: DialogService,
    public contactApi: BasketContactApiService,
    public app: AppService,
    public translate: TranslateService,
    breakpointObserver: BreakpointObserver,
    public portalInjection: PortalInjectionService,
    public cdr: ChangeDetectorRef,
    private emailService: EmailService,
    private smsService: SmsService,
    private portalService: PortalService,
    private acRoute: ActivatedRoute,
    private matDialog: MatDialog,
  ) {
    super(
      breakpointObserver,
      moment,
      numeral,
      basketService
    );

    this.basketService.basketConfig.subscribe(val => {
      this.buylaterButton = val.BUYLATERBUTTON_VISIBLE;
      this.smsLabel = val.BASKET_RESERVATION_INFO;
      this.kdvLabel = val.BASKET_KDV_SERVICE_MSG_VISIBLE;
    });

  }

  ngOnInit() {
    this.acceptPromotion.valueChanges.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
      const basket = this.basketService.basket.get();
      basket.BeAwareOfPromotions = value;
      this.basketService.basket.set(basket);
    });
  }

  ngAfterViewInit(): void {
    this.portalInjection.BASKET_PANEL_ITEMS_COMPONENT_FACTORIES.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
      this.panelItemContainer.clear();
      for (const Key of Object.keys(value)) {
        const componentRef = this.panelItemContainer.createComponent(value[Key]);
        this.panelItemsRef.push(componentRef);
      }
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.panelItemsRef.map(value => {
      value.destroy();
    });
  }

  method() {
    setTimeout(() => {
      this.router.navigate(['/Completed/270159']);
    }, 1000);
  }

  async sendToBasket() {
    /* await this.extraService.getBasketExtraService();
    const thereExtraService = this.extraService.extraServiceList.getValue().length;

    if (thereExtraService > 0) {
      this.router.navigate(['/Extra-Service'], {queryParamsHandling: 'preserve'});
    } else {
      this.router.navigate(['/Basket'], {queryParamsHandling: 'preserve'});
    } */
    this.router.navigate(['/Basket'], { queryParamsHandling: 'preserve' });
    // if (this.isMobile) {
    //   window.scrollTo(0, 0);
    //   this.sidenavService.rightSide.next();
    // }
  }

  async onBuyLater(isPreRes: Boolean) {
    const basket = this.basketService.basket.get();

    if (!basket.BuyLater) {
      const response: { phone: string, email: string } | boolean = await this.matDialog.open(BasketPanelBuylaterDialogComponent, {
        maxWidth: '90%',
        maxHeight: '90%'
      }).afterClosed().toPromise();
      if (typeof response === 'boolean') {
        return;
      }
      basket.Profile.Phone = response.phone;
      basket.Profile.Email = response.email;
      this.basketService.basket.set(basket);
    }

    const resp = await this.basketService.contactUpdate();
    if (!resp) {
      const snapshot = this.acRoute.snapshot;
      const fields = this.contactApi.fields.get();
      for (const key of Object.keys(fields)) {
        if (fields[key].visibility) {
          this.contactApi.formGroup.get(key).markAsDirty();
          this.contactApi.formGroup.get(key).markAsTouched();
        }
      }
      this.buylaterMessage.next({ 'message': 'LBL_BUYLATER_FILL_CONTACT', 'class': 'ErrorRed' });
      return;
    } else {
      this.buylaterMessage.next({
        'message': 'LBL_BUYLATER_OK_MESSAGE',
        'class': 'OkGreen'
      });

      const url = window.location.host;
      const protocol = window.location.protocol;
      const contentUrl = protocol + '//' + url + '/Basket?UID=' + basket.BuyLater.Id;
      let wireTransfer = '';
      
      await basket.PaymentType.filter(f => { return f.Id === 3 }).forEach(async row => {
        wireTransfer = wireTransfer + '<br><br>' + row.Name;
      });

      if (basket.Profile.Email) {

          let contentMail = this.translate.getKey('MSG_BUYLATER') +
          '<br>' + wireTransfer + '<br><br>' +contentUrl;

        const email = {
          Email: basket.Profile.Email,
          Subject: 'Hotel Reservation Reminder',
          ContentObj: null,
          Content: contentMail,
          ContentType: 'Basket',
          HotelId: this.appService.hotelID,
          PortalId: this.appService.portalID,
          CcTo: this.portalService.portalConfig.CCTO || null
        };
        await this.emailService.SendEmail(email, basket);
      }

      if (basket.Profile.Phone) {
        const contentSms = this.translate.getKey('MSG_BUYLATER') + '              ' + contentUrl;

        const smsCont = {
          Phone: basket.Profile.Phone,
          ContentObj: null,
          Content: contentSms,
          ContentType: 'Basket'
        };
        await this.smsService.SendSms(smsCont);
      }

      const val = this.translate.data['LBL_BUYLATER_OK_MESSAGE'];
      const currn = this.appService.currency.getValue() || 'TRY';
      const ref = this.dialog.openHtml(val);
      ref.afterClosed().subscribe(result => {
        this.basketService.resetBasket();
        this.router.navigateByUrl('/');
      });
    }
  }

  async onBasketClear() {
    if (await this.basketService.clearAllItems() === false) {
      return;
    }
    if (this.acRoute.snapshot['_routerState'].url === '/Basket') {
      await this.router.navigateByUrl(this.appService.homePageRoute.getValue());
    }
  }

  async getAgreement(type: number) {
    const agreementData = await this.homePageService.getAgreement(type, null);
    if (agreementData && agreementData.AGREEMENT) {
      this.dialog.openAgreement(agreementData.AGREEMENT);
    }
  }

  continueShopping() {
    const url = this.appService.homePageRoute.getValue();
    this.router.navigateByUrl(url);
  }
}
