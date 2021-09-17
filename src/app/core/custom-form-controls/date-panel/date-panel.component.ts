import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';


import * as _ from 'lodash';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../shared';
import { FormDialogData, FormDialogComponent } from '../../dialogs/form-dialog';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

export const MomentFormatWithHour = 'YYYY-MM-DD HH:mm';


@Component({
  selector: 'ta-core-date-panel',
  templateUrl: './date-panel.component.html',
  styleUrls: ['./date-panel.component.scss']
})
export class DatePanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() i: number;
  @Input() addDay: number;
  @Input() isWhite = false;
  @Input() multi = false;
  @Input() showReturnDate = false;
  @Input() startOfAfterDay: number;
  @Input() mode: 'flight' | 'transfer' | 'hotel' = 'flight';
  @Input() itinerariesControl: FormGroup;
  @Input() hotelFirstDateControl: FormControl;
  @Input() hotelSecondDateControl: FormControl;
  // TODO - low : Make this SETTER. NOT BEHAVIOR SUBJECT
  @Input() trigger: BehaviorSubject<boolean>;
  @Input() mobile = false;
  @Input() triggerNextDay = false;
  @Output() dateChanged = new EventEmitter<{ event: MatDatepickerInputEvent<any>, index: number }>();
  @Output() datePanelClosed = new EventEmitter();

  @ViewChild('mainElement') target;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild('picker0') firstDateToggle;
  @ViewChild('picker1') secondDateToggle;

  panelWidth$ = new BehaviorSubject('300px');
  isDatePanelOpen = false;
  firstDate: FormControl;
  secondDate: FormControl;
  _;
  ltmd;
  smallPcViewport;
  smallHeight;
  moment = moment;

  isOneWay = new FormControl();

  data = new BehaviorSubject<FormDialogData>(null);

  latestFormDialogIsFirst;

  dateFormat = 'YYYY-MM-DD';

  isDestroyed = new Subject();

  strategy;

  get fc() {
    return this.itinerariesControl.get('0').get('isSecondDateOpen');
  }

  filterForPastDays = (d: Date): boolean => {
    return moment(d).startOf('day').diff(moment().startOf('day')) > -1;
    // tslint:disable-next-line:semicolon
  };

  filterForSecondDate = (d: Date): boolean => {
    return moment(d).startOf('day').diff(moment(this.firstDate.value).startOf('day')) >= 0;
    // tslint:disable-next-line:semicolon
  };

  constructor(
    breakpointObserver: BreakpointObserver,
    public appService: AppService,
    private dialog: MatDialog,
    private sso: ScrollStrategyOptions,
  ) {

    this.strategy = this.sso.block();
    this._ = _;

    breakpointObserver.observe(['(max-height: 800px)', '(max-width: 959px)', '(max-width: 1280px)']).pipe(takeUntil(this.isDestroyed)).subscribe(value => {
        this.smallHeight = value.breakpoints['(max-height: 800px)'];
        this.ltmd = value.breakpoints['(max-width: 959px)'];
        this.smallPcViewport = value.breakpoints['(max-width: 1280px)'];
      }
    );
  }

  ngOnInit() {
    if (!this.startOfAfterDay) {
      this.startOfAfterDay = 0;
    }
    if (this.addDay < this.startOfAfterDay) {
      this.addDay = this.startOfAfterDay;
    }

    if (this.trigger) {
      this.trigger.pipe(takeUntil(this.isDestroyed)).subscribe(x => {
        if (x) {
          this.onDatePanel();
        }
      });
    }

    if (this.mode === 'hotel') {
      this.firstDate = this.hotelFirstDateControl;
      this.secondDate = this.hotelSecondDateControl;
    } else {
      this.firstDate = this.itinerariesControl.controls[this.i].get('dateControl') as FormControl;
      this.secondDate = this.itinerariesControl.controls[1].get('dateControl') as FormControl;
    }

    switch (this.mode) {
      case 'transfer':
        this.dateFormat = MomentFormatWithHour;
        break;
      case 'flight':
      case 'hotel':
        this.dateFormat = 'YYYY-MM-DD';
        break;
    }

    if (this.firstDate.value === '') {
      this.firstDate.setValue(this.mode === 'transfer' ? moment().format(MomentFormatWithHour) : moment().startOf('day'));
      if (this.addDay > 0) {
        const date = moment(this.firstDate.value).add(this.addDay, 'days');
        this.firstDate.setValue(this.mode === 'transfer' ? date.format(MomentFormatWithHour) : date.startOf('day'));
      }
    }

    this.isOneWay.setValue(this.secondDate.value ? 0 : 1);

    if (this.mode === 'hotel') {
      this.firstDate.valueChanges.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
        if (moment(value).add(1, 'day').diff(this.secondDate.value) >= -86400000) {
          this.secondDate.setValue(moment(value).add(1, 'day').format(this.dateFormat));
        }
      });
    }


    this.isOneWay.valueChanges.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
      if (value) {
        this.secondDate.setValue('');
      } else if (!this.secondDate.value) {
        this.secondDate.setValue(this.mode === 'hotel' ?
          moment(this.firstDate.value).add(1, 'day').format('YYYY-MM-DD') : this.firstDate.value);
      }
    });
  }


  firstDateEvent() {
    this.goRight();
    if (!this.showReturnDate) {
      setTimeout(() => {
        this.onDateBackdropClick();
      }, 0);
    }
  }


  secondDateEvent() {
    // setTimeout(() => {
    //   this.onDateBackdropClick();
    // }, 0);
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.mode !== 'flight' && this.mode !== 'transfer') {
        if (this.target.elementRef.nativeElement.clientWidth > 300) {
          this.panelWidth$.next(this.target.elementRef.nativeElement.clientWidth + 'px');
        }
      }
    }, 0);
  }


  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }

  onDatePanel() {
    // this.isDatePanelOpen = true;
    // setTimeout(() => {
    //   if (moment(this.firstDate.value ? this.firstDate.value : undefined).startOf('day').diff(moment()) <= 0 || !this.showReturnDate) {
    //     this.firstDateToggle.open();
    //   }
    // }, 0);
  }

  onDateBackdropClick() {
    this.isDatePanelOpen = false;
    this.datePanelClosed.next(true);
  }

  onDateChanged(e: MatDatepickerInputEvent<any>, number: number, isTime: boolean) {
    if (!isTime) {
      this.dateChanged.emit({event: e, index: number});
    }

    if (number) {
      this.secondDateEvent();
    } else {
      this.firstDateEvent();
    }
  }

  goRight() {
    this.tabGroup.selectedIndex = 1;
  }

  goLeft() {
    this.tabGroup.selectedIndex = 0;
  }

  onIndexChange(e: any) {
    if (e) {
      setTimeout(() => {
        if (this.mode === 'transfer') {
          return;
        }
        this.secondDateToggle.open();
      }, 500);
    }
  }

  matDatePanelClosed() {
    this.datePanelClosed.emit();
  }

  clearArrivalDate() {
    setTimeout(() => {
      this.secondDate.setValue('');
    }, 0);
  }

  onDateClick(isFirst: boolean) {
    const data = {
      mode: this.mode === 'transfer' ? 'time' : 'date',
      header: isFirst ?
        (this.mode === 'hotel' ? 'LBL_CHECKIN' : 'LBL_DEPARTURE_DATE') :
        (this.mode === 'hotel' ? 'LBL_CHECKOUT' : 'LBL_ARRIVAL_DATE'),
      dateStartAt: isFirst ? this.firstDate.value || moment() : this.secondDate.value || this.firstDate.value,
      value: isFirst ? this.firstDate.value : this.secondDate.value,
      dateMinDate: isFirst ? (this.mode === 'transfer' ? moment().add(this.startOfAfterDay, 'days') :
        moment().startOf('day')) : (this.mode === 'hotel' ? moment(this.firstDate.value).add(1, 'day') : this.firstDate.value),
      dateFormat: this.mode === 'transfer' ? MomentFormatWithHour : undefined,
    } as FormDialogData;

    if (this.multi && this.i > 0) {
      data.dateStartAt = data.dateMinDate = this.itinerariesControl.controls[this.i - 1].get('dateControl').value;
    }
    this.data.next(data);

    this.latestFormDialogIsFirst = isFirst;

    // if (this.ltmd) {
    if (this.smallPcViewport || (this.mode === 'transfer' && this.smallHeight)) {
      const dialogRef = this.dialog.open(FormDialogComponent, {
        // height: '100vh',
        width: '300px',
        maxHeight: '100%',
        disableClose: true,
        position: {top: '5vw', bottom: '5vw'},
        maxWidth: '100vw',
        panelClass: 'dialog-without-padding',
        data: data
      });

      const ref = dialogRef.componentInstance.close.subscribe(val => {
        dialogRef.close(dialogRef.componentInstance.figureOutData());
        ref.unsubscribe();
      });

      const tt = dialogRef.afterClosed().subscribe(value => {
        this.onFormDialog(value);
        tt.unsubscribe();
      });
    } else {
      this.isDatePanelOpen = true;
    }
  }

  onFormDialog(value: any) {
    if (this.multi && this.mode !== 'hotel') {
      const cLength = this.itinerariesControl.controls.length as unknown as any;
      for (let index = this.i; index < cLength - 1; index++) {
        if (moment(value) > moment(this.itinerariesControl.controls[index + 1].get('dateControl').value)) {
          this.itinerariesControl.controls[index + 1].get('dateControl').setValue(moment(value).format(this.dateFormat));
        }
      }
    }
    if (this.latestFormDialogIsFirst) {
      this.firstDate.setValue(moment(value).format(this.dateFormat));
      if (!this.multi && this.secondDate.value) {
        if (moment(value).diff(moment(this.secondDate.value)) > 0) {
          this.secondDate.setValue(moment(value).format(this.dateFormat));
        }
      }

      setTimeout(() => {
        if (!this.multi && this.triggerNextDay) {
          this.onDateClick(false);
        }
      }, 300);
    } else {
      this.secondDate.setValue(moment(value).format(this.dateFormat));
      this.isOneWay.setValue(0);
    }
  }

  onFormDialogClose() {
    this.isDatePanelOpen = false;
  }

  onRemoveButtonClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOneWay.setValue(1);
  }
}
