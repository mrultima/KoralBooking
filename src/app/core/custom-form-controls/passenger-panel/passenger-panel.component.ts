import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, startWith, takeWhile } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormDialogData, FormDialogComponent } from '../../dialogs/form-dialog';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { AppService, PortalService } from '../../shared';
import {
  ScrollStrategyOptions
} from '@angular/cdk/overlay';

@Component({
  selector: 'ta-core-passenger-panel',
  templateUrl: './passenger-panel.component.html',
  styleUrls: ['./passenger-panel.component.scss']
})
export class PassengerPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(FormDialogComponent) dialogComponent: FormDialogComponent;
  @Input() formGroup: FormGroup;
  @Input() isWhite = false;
  @Input() maxAdultCount = 6;
  @Input() maxChildCount = 6;

  @Input() set trigger(trigger: boolean) {
    if (trigger) {
      this.onPassengerPanel();
    }
  }

  @Input() showCabinClass = false;
  @Input() mode: 'Flight' | 'Hotel' | 'Transfer' = 'Flight';
  @Input() hotelAdultFC: FormControl;
  @Input() hotelChildFC: FormControl;
  @Input() mobile = false;
  @Input() hideChildren = false;
  @Input() multi = false;
  @Input() maxChildAge: number;
  @Input() minChildAge = 0;

  @ViewChild('mainElement') target;
  panelWidth$ = new BehaviorSubject('250px');


  isPassengerPanelOpen = false;

  adultFC = new FormControl('');
  childFC = new FormControl('');

  passengerControl;

  ltsm;

  isMobile: boolean;
  smallPcViewport: boolean;

  adultCount = 0;
  childCount = 0;

  data = new BehaviorSubject<FormDialogData>(null);

  isDestroyed = false;

  strategy;

  get cabinClassFC(): FormControl {
    return this.formGroup.get('cabinClass') as FormControl;
  }

  constructor(
    public appService: AppService,
    public breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private portalService: PortalService,
    private sso: ScrollStrategyOptions,
    public el: ElementRef
  ) {
    this.strategy = this.sso.block();
    this.breakpointObserver.observe(['(max-width: 599px)', '(max-width: 959px)']).subscribe(value => {
      this.ltsm = value.breakpoints['(max-width: 599px)'];
      this.isMobile = value.breakpoints['(max-width: 959px)'];
    });

    this.breakpointObserver.observe('(max-width: 1280px)').subscribe(value => {
      this.smallPcViewport = value.matches;
    }
    );

    this.maxChildAge = this.portalService.portalConfig$.value.MAX_CHILD_AGE;
  }

  ngOnInit() {
    if (this.mode === 'Flight' || this.mode === 'Transfer') {
      this.passengerControl = this.formGroup.get('passengersControl');
      const ac = this.passengerControl.get('noOfAdultsControl').value;

      this.adultFC.valueChanges.pipe(takeWhile(() => !this.isDestroyed)).subscribe(value => {
        this.passengerControl.get('noOfAdultsControl').setValue(value);
      });

      this.passengerControl.get('noOfAdultsControl').valueChanges.pipe(
        takeWhile(() => !this.isDestroyed),
        distinctUntilChanged()
      ).subscribe(value => {
        if (!_.isEqual(this.adultFC.value, value)) {
          this.adultFC.setValue(value);
        }
      });

      this.passengerControl.get('childAgesControl').valueChanges.pipe(
        takeWhile(() => !this.isDestroyed),
        distinctUntilChanged()
      ).subscribe(value => {
        if (!_.isEqual(this.childFC.value, value)) {
          this.childFC.setValue(value);
        }
      });

      this.childFC.valueChanges.pipe(takeWhile(() => !this.isDestroyed)).subscribe(value => {
        this.passengerControl.get('noOfChildrenControl').setValue(value ? value.length : '0');
        this.passengerControl.get('childAgesControl').setValue(value ? value : []);
      });

      this.adultFC.setValue(ac ? ac.toString() : '1');
      this.childFC.setValue(this.passengerControl.get('childAgesControl').value);

    } else {

      this.hotelAdultFC.valueChanges.pipe(takeWhile(() => !this.isDestroyed), distinctUntilChanged()).subscribe(value => {
        if (!_.isEqual(this.adultFC.value, value)) {
          this.adultFC.setValue(value);
        }
      });

      this.hotelChildFC.valueChanges.pipe(takeWhile(() => !this.isDestroyed), distinctUntilChanged()).subscribe(value => {
        if (!_.isEqual(this.childFC.value, value)) {
          this.childFC.setValue(value);
        }
      });

      this.adultFC.valueChanges.pipe(takeWhile(() => !this.isDestroyed)).subscribe(value => {
        this.hotelAdultFC.setValue(value);
      });

      this.childFC.valueChanges.pipe(takeWhile(() => !this.isDestroyed)).subscribe(value => {
        this.hotelChildFC.setValue(value);
      });

      this.adultFC.setValue(this.hotelAdultFC.value || '2');
      this.childFC.setValue(this.hotelChildFC.value || '');
      // this.adultFC = this.hotelAdultFC;
      // this.childFC = this.hotelChildFC;
    }

    combineLatest([
      this.adultFC.valueChanges.pipe(startWith(this.adultFC.value as string)),
      this.childFC.valueChanges.pipe(startWith(this.childFC.value as string))
    ]).pipe(takeWhile(() => !this.isDestroyed)).subscribe(value => {
      this.adultCount = +value[0];

      this.childCount = 0;
      if (value && value[1] && value[1][0] !== '') {
        console.log(value)
        this.childCount = value[1].length
      }

    });
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.mode === 'Hotel') {
        if (this.target.elementRef.nativeElement.clientWidth > 250) {
          this.panelWidth$.next(this.target.elementRef.nativeElement.clientWidth + 'px');
        }
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }

  onPassengerPanel() {

    let header;

    switch (this.mode) {
      case 'Flight':
        header = 'LBL_CABIN_AND_PASSENGER_SELECTION';
        break;
      case 'Hotel':
        header = 'LBL_GUEST_SELECTION';
        break;
      case 'Transfer':
        header = 'LBL_PASSENGER_SELECTION';
        break;
    }


    const data = {
      mode: 'passenger',
      isCabinActive: this.showCabinClass,
      header: header,
      value: {
        adultCount: this.adultCount,
        child: this.childFC.value,
        cabin: (this.showCabinClass && this.cabinClassFC && this.cabinClassFC.value) || 0
      },
      hideChildren: this.hideChildren,
      maxChildAge: this.maxChildAge,
      minChildAge: this.minChildAge,
      maxAdultCount: this.maxAdultCount,
      maxChildCount: this.maxChildCount

    } as FormDialogData;

    this.data.next(data);

    if (this.smallPcViewport) {

      const dialogRef = this.dialog.open(FormDialogComponent, {
        // height: '100vh',
        width: this.ltsm ? '90vw' : '40vw',
        maxWidth: '90%',
        maxHeight: '100%',
        disableClose: true,
        position: { top: '5vw', bottom: '5vw' },
        panelClass: 'dialog-without-padding',
        data: this.data.getValue()
      });

      dialogRef.afterClosed().subscribe(value => {
        if (value) {
          this.adultFC.setValue(value.adultCount);
          this.childFC.setValue(value.child);
          if (this.showCabinClass) {
            this.cabinClassFC.setValue(value.cabin);
          }
        }
      });

    } else {
      this.isPassengerPanelOpen = true;
    }
  }

  mockArrayCreator(num: number) {
    return Array(num);
  }

  log(value: any) {
    console.log('value', value);
  }

  onFormDialog(value: any) {
    this.adultFC.setValue(value.adultCount);
    this.childFC.setValue(value.child);
    if (this.showCabinClass) {
      this.cabinClassFC.setValue(value.cabin);
    }
  }

  onFormDialogClose() {
    if (this.dialogComponent.childrenComponent && this.dialogComponent.childrenComponent.formGroup.invalid) {
      this.dialogComponent.childrenComponent.triggerChildrenErrors();
      return;
    }
    this.isPassengerPanelOpen = false;
  }
}
