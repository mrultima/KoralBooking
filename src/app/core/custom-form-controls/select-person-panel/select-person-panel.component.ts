import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DialogService, TranslateService } from '../../shared';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';


export interface SelectPersonPanelPriceItem {
  EXCURSIONRATEID: string;
  UID: string;
  TOURID: string;
  EXTRASERVICE_ENABLE: boolean;
  MAXADULT?: any;
  MAXCHILD?: any;
  ADULTCOUNT?: any;
  CHILDCOUNT?: any;
  BABYCOUNT?: any;
  STUDENTCOUNT?: any;
  SPTOCOUNT?: any;
  MAXSTUDENT?: any;
  MAXINFANT?: any;
  MAXSPECIAL?: any;
  MINADULT: number;
  MINCHILD?: any;
  MINPAX?: any;
  MAXPAX?: any;
  TICKETTYPE: string;
  TICKETTYPEID: number;
  MARKET: string;
  MARKETID?: any;
  BASEPRICE: number;
  ADULT: number;
  CHILD: number;
  BABY: number;
  SP1: number;
  SP2: number;
  CAMPAIGNID?: any;
  CAMPAIGN?: any;
  EMAIL: string;
  DAYDIFFERENCE: number;
  SINGLEDATE?: any;
  DISCOUNTPERCENT?: any;
  DISCOUNTAMOUNT?: any;
  DISPLAYORDER: number;
  TOTAL: number;
}

const ChildrenSelectorDatepickerProvider = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => SelectPersonPanelComponent),
  multi: true
};

@Component({
  selector: 'ta-core-select-person-panel',
  templateUrl: './select-person-panel.component.html',
  styleUrls: ['./select-person-panel.component.scss']
})
export class SelectPersonPanelComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  @Input() priceItem: SelectPersonPanelPriceItem;
  @Input() mode: string;
  @Input() actionmode: string;
  @Output() change: EventEmitter<any> = new EventEmitter();

  @ViewChild('panel') panel: ElementRef;
  @ViewChild('portalContent') portalContent;
  @ViewChild('mainElement') mainElement;

  isPanelOpen: boolean;
  formGroup: FormGroup;
  isDestroyed = new Subject();
  ltmd;

  disableObservables: {
    adult: { min: Observable<boolean>, max: Observable<boolean> },
    child: { min: Observable<boolean>, max: Observable<boolean> },
    baby: { min: Observable<boolean>, max: Observable<boolean> },
    student: { min: Observable<boolean>, max: Observable<boolean> },
    spTo: { min: Observable<boolean>, max: Observable<boolean> }
  };

  constructor(
    private overlay: Overlay,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private translateService: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver.observe('(max-width: 599px)').subscribe(value => {
      this.ltmd = value.matches;
    });

    this.formGroup = this.fb.group({
      adultCount: 0,
      childCount: 0,
      babyCount: 0,
      studentCount: 0,
      spToCount: 0
    });
  }

  ngOnInit() {
    this.setMinMaxPaxValues();
    this.setDisableObservables();

    const arr = {
      adultCount: {max: 'MAXADULT', min: 'MINADULT'},
      childCount: {max: 'MAXCHILD', min: 'MINCHILD'},
      babyCount: {max: 'MAXINFANT', min: undefined},
      studentCount: {max: 'MAXSTUDENT', min: undefined},
      spToCount: {max: 'MAXSPECIAL', min: undefined},
    };

    for (const [control, field] of Object.entries(arr)) {
      const fc = this.formGroup.get(control);
      fc.valueChanges.pipe(takeUntil(this.isDestroyed)).subscribe(value => {
        if (typeof value !== 'number') {
          value = parseFloat(value);
          fc.setValue(isNaN(value) ? 0 : value);
          return;
        }

        if (value > this.priceItem[field.max]) {
          fc.setValue(this.priceItem[field.max]);
          this.dialogService.openShowErrors([{
            message: this.translateService.transform('MSG_ERROR_TICKET_MAX_PAX_COUNT', [{paxCount: this.priceItem[field.max]}])
          }]).afterClosed().toPromise();
        }

        if (field.min && value < this.priceItem[field.min]) {
          fc.setValue(this.priceItem[field.min]);
          this.dialogService.openShowErrors([{
            message: this.translateService.transform('MSG_ERROR_TICKET_MIN_PAX_COUNT', [{paxCount: this.priceItem[field.min]}])
          }]).afterClosed().toPromise();
        }
      });
    }

    if (this.actionmode === 'onchange') {
      this.formGroup.valueChanges.pipe(
        startWith(this.formGroup.value),
        takeUntil(this.isDestroyed)
      ).subscribe(value => {
        this.change.emit({
          priceItem: this.priceItem,
          formValue: this.formGroup.value
        });
      });
    }
  }

  setDisableObservables() {

    const biggerThanZero = (x, z = 0) => this.formGroup.get(x).valueChanges.pipe(startWith(this.formGroup.get(x).value as number), map(y => y - z <= 0));
    const lowerThanMax = (x, y) => this.formGroup.get(x).valueChanges.pipe(startWith(this.formGroup.get(x).value as number), map(z => z >= this.priceItem[y]));
    this.disableObservables = {
      adult: {min: biggerThanZero('adultCount', this.priceItem.MINADULT), max: lowerThanMax('adultCount', 'MAXADULT')},
      baby: {min: biggerThanZero('babyCount'), max: lowerThanMax('babyCount', 'MAXINFANT')},
      child: {min: biggerThanZero('childCount'), max: lowerThanMax('childCount', 'MAXCHILD')},
      spTo: {min: biggerThanZero('spToCount'), max: lowerThanMax('spToCount', 'MAXSPECIAL')},
      student: {min: biggerThanZero('studentCount'), max: lowerThanMax('studentCount', 'MAXSTUDENT')},
    };
  }

  private setMinMaxPaxValues() {
    if (this.priceItem) {
      this.formGroup.get('adultCount').setValue(0);
      if (this.priceItem.MAXADULT == null) {
        this.priceItem.MAXADULT = 99;
      }
      if (this.priceItem.MAXCHILD == null) {
        this.priceItem.MAXCHILD = 99;
      }
      this.priceItem.MAXINFANT = 99;
      this.priceItem.MAXSTUDENT = 99;
      this.priceItem.MAXSPECIAL = 99;

      if (this.priceItem.MAXPAX != null) {
        const arr = [
          'MAXADULT',
          'MAXCHILD',
          'MAXINFANT',
          'MAXSTUDENT',
          'MAXSPECIAL'
        ];

        for (const field of arr) {
          if (this.priceItem[field] > this.priceItem.MAXPAX) {
            this.priceItem[field] = this.priceItem.MAXPAX;
          }
        }
      }

      if (this.priceItem.MINADULT != null) {
        this.formGroup.get('adultCount').setValue(this.priceItem.MINADULT);
      }

      if (this.priceItem.MINCHILD != null) {
        this.formGroup.get('childCount').setValue(this.priceItem.MINCHILD);
      }

      if (this.priceItem.ADULTCOUNT && this.priceItem.ADULTCOUNT > this.priceItem.MINADULT && this.priceItem.ADULTCOUNT < this.priceItem.MAXADULT) {
        this.formGroup.get('adultCount').setValue(this.priceItem.ADULTCOUNT);
      }

      if (this.priceItem.CHILDCOUNT && this.priceItem.CHILDCOUNT > this.priceItem.MINCHILD && this.priceItem.ADULTCOUNT < this.priceItem.MAXCHILD) {
        this.formGroup.get('childCount').setValue(this.priceItem.CHILDCOUNT);
      }

      if (this.priceItem.BABYCOUNT && this.priceItem.BABYCOUNT < this.priceItem.MAXINFANT) {
        this.formGroup.get('babyCount').setValue(this.priceItem.BABYCOUNT);
      }

      if (this.priceItem.ADULTCOUNT > 0 || this.priceItem.CHILDCOUNT > 0 ) {
        this.change.emit({
          priceItem: this.priceItem,
          formValue: this.formGroup.value
        });
      }
    }
  }

  public onChangeFn(fn: any) {
  }

  public onTouchedFn(fn: any) {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: string): void {
  }

  ngAfterViewInit(): void {
  }

  onBackdropClick() {
    this.isPanelOpen = false;
  }

  onOpenClosePanel() {
    this.isPanelOpen = true;
  }

  minusPax(type) {
    let typeCount = parseFloat(this.formGroup.get(type).value);
    if (typeCount > 0) {
      typeCount -= 1;
    }
    this.formGroup.get(type).setValue(typeCount);
  }

  plusPax(type) {
    let typeCount = parseFloat(this.formGroup.get(type).value);
    typeCount += 1;
    this.formGroup.get(type).setValue(typeCount);
  }

  onSubmit() {
    this.change.emit({
      priceItem: this.priceItem,
      formValue: this.formGroup.value
    });

    this.isPanelOpen = false;
  }

  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }

  valuechange(e) {
    const ss = e.target.value.replace(/[^\w\s]/gi, '');
    e.target.value = parseInt(ss, 10);
  }
}
