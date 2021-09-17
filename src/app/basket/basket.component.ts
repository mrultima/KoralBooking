import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef, ElementRef,
  OnDestroy,
  OnInit, QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { MatVerticalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, merge, Observable, Subject, Subscription, of, timer } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay, startWith, takeUntil, switchMap, distinctUntilChanged } from 'rxjs/operators';
import {
  Basket,
  BasketService,
  HomePageService,
  DialogService,
  PaymentService,
  ApiService,
  AppService,
  PortalInjectionService,
  BasketContactApiService,
  PortalService,
  EmailService,
  SmsService,
  TranslateService,
  ExchangeRateService
} from '../core/shared';
import { MatDialog } from '@angular/material/dialog';
import { BasketPanelBuylaterDialogComponent } from '../core/components/basket-panel/basket-panel-buylater-dialog/basket-panel-buylater-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'ta-pages-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit, AfterViewInit, OnDestroy {
  isContactAppliedtoGuest1 = false;

  @ViewChild('stepper') stepper: MatVerticalStepper;
  @ViewChild('BasketGuestContainer', { read: ViewContainerRef }) basketGuestContainer: ViewContainerRef;
  basketGuestRefs: ComponentRef<any>[] = [];

  @ViewChildren('BasketExtraStep', { read: ViewContainerRef }) basketExtraSteps: QueryList<ViewContainerRef>;
  basketExtraStepFormGroup = new FormGroup({
    steps: new FormArray([])
  });
  basketExtraStepData: { label: string, factory: any, showContent }[] = [];
  basketExtraStepRefs: ComponentRef<any>[] = [];
  basketExtraStepControlRefs: Subscription[] = [];
  basketCompleteClicked = false;


  // this is a workaround. Material step not want a boolean for if step is valid or not it wants a form group so this is kinda mock form group
  basketGuestContainerFormGroup = new FormGroup({
    1: new FormControl('', Validators.required)
  });

  isChecked = new FormControl(false);
  isCheckedKvkk = new FormControl(false);
  // payNowPrice = new FormControl();
  showComplete: Observable<boolean>;

  personVisibility = new BehaviorSubject(false);

  isOpenBasketLayout = false;
  isMobile = false;
  buylaterMessage: BehaviorSubject<any> = new BehaviorSubject(null);
  basket: Basket;
  isLocalPriceChecked = new FormControl(false);
  isDestroyed = new Subject();
  showCommission = new BehaviorSubject(false)
  isCustomer = new BehaviorSubject(true)
  btnBuyLater: string = 'BTN_CALLME' + (this.portalService.portalConfig.BUYLATER_LABEL === null ? "" : String(this.portalService.portalConfig.BUYLATER_LABEL));

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public basketService: BasketService,
    public contactApi: BasketContactApiService,
    public agreementService: DialogService,
    public homePageService: HomePageService,
    public paymentService: PaymentService,
    public api: ApiService,
    public app: AppService,
    public breakpointObserver: BreakpointObserver,
    public dialogService: DialogService,
    public portalInjection: PortalInjectionService,
    public cdr: ChangeDetectorRef,
    public portalService: PortalService,
    private emailService: EmailService,
    private smsService: SmsService,
    private acRoute: ActivatedRoute,
    private matDialog: MatDialog,
    public dialog: DialogService,
    public translate: TranslateService,
    private exchangeRateService: ExchangeRateService,

  ) {
    this.exchangeRateService.getRates(this.app.hotelID);
    this.basketService.commissionFormGroup.get('commTypeFc').setValue(this.app.commissionType === 'ALL' ? 'GROSS' : this.portalService.portalConfig.COMMISSIONTYPE);

    if (Number(portalService.portalConfig.BASKET_TIMEOUTDURATION) > 0) {
      let localBasket = this.basketService.basket.get();
      localBasket.ValidUntil = moment().add(Number(portalService.portalConfig.BASKET_TIMEOUTDURATION), 'minutes').toISOString();
      this.basketService.basket.set(localBasket);
      localStorage.setItem('basket', JSON.stringify(localBasket));
    }

    this.app.loginUser
      .pipe(
        takeUntil(this.isDestroyed),
        distinctUntilChanged()
      )
      .subscribe(val => {
        if (val) {
          const isLoggedInUser = ['H', 'C', 'O'].indexOf(val.LOGINTYPE) >= 0;
          if (isLoggedInUser) {
            this.showCommission.next(isLoggedInUser);
            this.btnBuyLater = 'BTN_SEND_PAY_LINK';
          } else {
            this.btnBuyLater = 'BTN_CALLME' + (this.portalService.portalConfig.BUYLATER_LABEL === null ? "" : String(this.portalService.portalConfig.BUYLATER_LABEL));
          }
          this.isCustomer.next(!isLoggedInUser);
        }
      })

    this.route.data.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
      this.basketService.basketConfig.next(value.basketConfig[0]);
      this.basketService.paymentsSettings.next(value.basketConfig[1]);
    });

    this.basket = this.basketService.basket.get();
    // this.payNowPrice.setValue(this.basket.Server.Price);
    if (this.basket.Server && !this.basket.Server.PayType) {
      const config = this.basketService.basketConfig.getValue();
      switch (config.PAYTYPE) {
        case 'FULL':
          this.basket.Server.PayType = 1;
          break;
        case 'NET':
          this.basket.Server.PayType = 3;
          break;
      }
    }

    breakpointObserver.observe('(max-width: 767px)').subscribe(value => {
      this.isMobile = value.matches;
    }
    );

    this.showComplete = combineLatest([
      this.paymentService.isPaymentValid.pipe(map(x => {
        if (x.valid && x.type == '3' && this.isCustomer.getValue()) {
          let basketConfig = this.basketService.basketConfig.value;
          if (basketConfig.HIDEPAYMENT_IF_WIRETRANSFER)
            return false
        }
        return x.valid
      }
      )),
      // this.isLocalPriceChecked.valueChanges.pipe(startWith(this.isLocalPriceChecked.value as unknown), map(x => {
      //   if (this.basketService.checkLocalPriceExist()) {
      //     return x;
      //   } else {
      //     return true;
      //   }
      // })),
      this.isChecked.valueChanges.pipe(startWith(this.isChecked.value as unknown), shareReplay(1)),
      this.basketService.basketConfig.pipe(switchMap(x => {
        if (x.BASKET_AGREEMENTKVKK_CHECK_VISIBLE) {
          return this.isCheckedKvkk.valueChanges.pipe(startWith(this.isCheckedKvkk.value as unknown), shareReplay(1));
        } else { return of(true); }
      })),
      this.exchangeRateService.rates$.pipe(map(x => x.length > 0))
    ]).pipe(map(x => {
      return x.every(y => y);
    }));

    this.basketService.getBasketPayment();
    if (this.portalService.portalConfig$.getValue()['HOSTING3DPAYENABLED']) {
      this.basketService.get3DPayHosting();
    }
  }

  ngOnInit() {


    this.checkPersonVisibility();
    const basket = this.basketService.basket.get();
    this.isOpenBasketLayout = ((basket.Items.HotelItems ? basket.Items.HotelItems.length : 0)) > 0;
    this.basketService.basket.data$.subscribe(value => {
      this.isOpenBasketLayout = ((value.Items.HotelItems ? value.Items.HotelItems.length : 0)) > 0;
    });

    this.portalInjection.BASKET_STEP_FACTORIES.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
      const arr: Array<any> = Object.entries(value);
      if (arr.length) {
        for (let i = 0; i < arr.length; i++) {
          const arrElement = arr[i];
          (this.basketExtraStepFormGroup.get('steps') as FormArray).setControl(i, new FormControl('', Validators.required));
          this.basketExtraStepData.push({ ...arrElement[1], showContent: true });
        }
      } else {
        (this.basketExtraStepFormGroup.get('steps') as FormArray).clear();
        this.basketExtraStepData = [];
      }
    });

    if (this.app.commissionType) {
      this.basketService.commissionFormGroup.get('commTypeFc').setValue(this.app.commissionType);
    }

    if (this.basket?.DeltaPrice?.FinalPrice && this.basket?.DeltaPrice?.FinalPrice > 0) {
      this.basketService.commPriceFocus = true;
      this.basketService.priceFg.patchValue(
        { lastPriceFc: this.basket.DeltaPrice.FinalPrice },
        { onlySelf: false, emitEvent: true }
      );
      this.basketService.commPriceFocus = false;
    }

  }

  ngAfterViewInit(): void {
    this.basketExtraStepControlRefs.forEach(value1 => {
      value1.unsubscribe();
    });

    this.basketExtraSteps.forEach((item, index) => {
      item.clear();

      // create component
      const componentRef = item.createComponent(this.basketExtraStepData[index].factory);
      this.basketExtraStepRefs.push(componentRef);

      // look for if component has a 'valid' property
      if (componentRef.instance.hasOwnProperty('valid')) {
        const ref = (componentRef.instance['valid'] as BehaviorSubject<boolean>).subscribe(value1 => {
          const fc = (this.basketExtraStepFormGroup.get('steps') as FormArray).at(index);

          if (value1) {
            fc.setValue('a');
          } else {
            fc.setValue('');
          }
        });
        this.basketExtraStepControlRefs.push(ref);
      }

      // look for if component has a 'showContent' property
      if (componentRef.instance.hasOwnProperty('showContent')) {
        const ref = (componentRef.instance['showContent'] as BehaviorSubject<boolean>).subscribe(value1 => {
          this.basketExtraStepData[index].showContent = value1;
        });
        this.basketExtraStepControlRefs.push(ref);
        this.cdr.detectChanges();
      }
    });

    if (this.basketGuestContainer) {
      this.portalInjection.BASKET_GUEST_ITEM_FACTORIES.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
        this.basketGuestContainer.clear();
        const validSubjects = [];
        for (const Key of Object.keys(value)) {
          // create component
          const componentRef = this.basketGuestContainer.createComponent(value[Key]);
          this.basketGuestRefs.push(componentRef);

          // look for if component has a 'valid' property
          if (componentRef.instance.hasOwnProperty('valid')) {
            validSubjects.push(componentRef.instance['valid']);
          }
        }
        // if any of the components has a 'valid' property look that property
        if (validSubjects.length) {
          combineLatest(validSubjects).pipe(takeUntil(this.isDestroyed)).subscribe(value1 => {
            // if every component is valid then user can pass guest step
            if (value1.every(x => x as boolean)) {
              this.basketGuestContainerFormGroup.get('1').setValue('a');
            } else {
              this.basketGuestContainerFormGroup.get('1').setValue('');
            }
          });
        } else {
          this.basketGuestContainerFormGroup.get('1').setValue('a');
        }

        this.cdr.detectChanges();
      });
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete();

    this.basketGuestRefs.map(value => {
      value.destroy();
    });

    this.basketExtraStepControlRefs.forEach(value1 => {
      value1.unsubscribe();
    });

    this.basketExtraStepRefs.forEach(value => {
      value.destroy();
    });
  }

  onSelectionChange(e: StepperSelectionEvent) {
    this.basketService.gatherData();
  }

  async getAgreement(type: number) {
    const agreementData = await this.homePageService.getAgreement(type, null);
    if (agreementData && agreementData.AGREEMENT) {
      const basket = this.basketService.basket.get();
      basket.Agreement = agreementData.AGREEMENT;
      basket.AgreementNotShowVoucher = agreementData.NOTSHOWVOUCHER;
      await this.basketService.basket.set(basket);
    }
  }

  async showagreement() {
    const basket = this.basketService.basket.get();
    const ref = await this.dialogService.openFullscreenLoading('agreement');
    await this.getAgreement(0);
    ref.detach();
    await timer(100).toPromise();
    this.agreementService.openAgreement(basket.Agreement);
  }

  async showagreementKvkk() {
    const basket = this.basketService.basket.get();
    const ref = await this.dialogService.openFullscreenLoading('agreement');
    const agreementData = await this.homePageService.getAgreement(7, null);
    if (agreementData && agreementData.AGREEMENT) {
      basket.KvkkAgreement = agreementData.AGREEMENT;
      this.basketService.basket.set(basket);
    }

    ref.detach();
    this.agreementService.openAgreement(basket.KvkkAgreement);
  }

  async basketComplete() {
    if (this.basketCompleteClicked) {
      return;
    }
    this.basketCompleteClicked = true;
    // const basket = this.basketService.basket.get();
    const ref = await this.dialogService.openFullscreenLoading('agreement');
    await this.getAgreement(0);
    try {
      await this.basketService.completeBasket();
    } catch (err) {
      console.error(err);
    } finally {
      ref.detach();
      this.basketCompleteClicked = false;
    }
  }

  goToShopping() {
    const url = this.app.homePageRoute.getValue();
    this.router.navigateByUrl(url);
  }

  // async onBuyLater() {
  //   const resp = await this.basketService.contactUpdate();
  //   if (!resp) {
  //     if (this.stepper.selectedIndex !== 0) {
  //       this.stepper.selectedIndex = 0;
  //     }
  //     const fields = this.contactApi.fields.get();
  //     for (const key of Object.keys(fields)) {
  //       if (fields[key].visibility) {
  //         this.contactApi.formGroup.get(key).markAsDirty();
  //         this.contactApi.formGroup.get(key).markAsTouched();
  //       }
  //     }
  //     this.buylaterMessage.next({'message': 'LBL_BUYLATER_FILL_CONTACT', 'class': 'ErrorRed'});

  //   } else {
  //     this.buylaterMessage.next({
  //       'message': 'LBL_BUYLATER_OK_MESSAGE',
  //       'class': 'OkGreen'
  //     });
  //     this.basketService.resetBasket();
  //   }
  // }

  async onBuyLater(sender: boolean) {
    const basket = this.basketService.basket.get();

    /*
    // buy Later olunca sepette indirim uygulanmış ise bunu daha sonra UID ile çağırınca aynı indirimi tekrar uygulayabilmemiz için gerekli.
    */
    basket.DeltaPrice = basket.Server;
    this.basketService.basket.set(basket);
    /* */

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

    const resp = await this.basketService.contactUpdate(sender, this.isCustomer.value);
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
      const contentUrl = protocol + '//' + url + '/Basket?UID=' + basket.BuyLater.Id + '&language=' + this.app.language.value;
      let wireTransfer = '';

      await basket.PaymentType.filter(f => { return f.Id === 3 }).forEach(async row => {
        wireTransfer = wireTransfer + '<br><br>' + row.Name;
      });

      if (basket.Profile.Email) {
        let contentMail = this.translate.getKey('MSG_BUYLATER') +
          '<br>' + wireTransfer + '<br><br>' + contentUrl;


        const email = {
          Email: basket.Profile.Email,
          Subject: 'Hotel Reservation Reminder',
          ContentObj: null,
          Content: contentMail,
          ContentType: 'Basket',
          HotelId: this.app.hotelID,
          PortalId: this.app.portalID,
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
      const currn = this.app.currency.getValue() || 'TRY';
      const ref = this.dialog.openHtml(val);
      ref.afterClosed().subscribe(result => {
        this.basketService.resetBasket();
        this.router.navigateByUrl('/');
      });
    }
  }

  checkPersonVisibility() {
    let hotelPersonVisibility = false;
    if ((this.basket.Items.HotelItems && this.basket.Items.HotelItems.length > 0 && !this.basket.isPreReservation)
      && this.basketService.basketConfig.value.HOTELPERSON_ALLROW === true) {
      hotelPersonVisibility = true;
    }
    // tslint:disable-next-line:max-line-length
    this.personVisibility.next(hotelPersonVisibility);

    return this.personVisibility.getValue();
  }

  goCompleteNotForComplete() {
    this.router.navigateByUrl('/Complete?print=true');
  }

  onCommPriceFocus() {
    this.basketService.commPriceFocus = true;
  }

  onCommPriceBlur() {
    this.basketService.commPriceFocus = false;
  }

  test() {
    console.log('this.basketGuestContainerFormGroup', this.basketGuestContainerFormGroup);
  }

}
