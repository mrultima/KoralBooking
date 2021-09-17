import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';

import { merge } from 'rxjs';
import { ChildrenSelectOrDatepickerComponent } from '../../custom-form-controls/children-select-or-datepicker';
import { AppService, SearchboxCacheService } from '../../shared';

@Component({
  selector: 'ta-core-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})

export class FormDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(ChildrenSelectOrDatepickerComponent) childrenComponent: ChildrenSelectOrDatepickerComponent;

  @Input() set dataFromAbove(data: FormDialogData) {
    this.data = data;
  }

  @Output() fcData = new EventEmitter();
  @Output() close = new EventEmitter();

  @Input() mode: 'dialog' | 'component' = 'dialog';

  fc = new FormControl();

  cabinClassFC = new FormControl();
  adultFC = new FormControl();
  childFC = new FormControl();

  dateFormat = 'YYYY-MM-DD';
  minDate = moment();
  maxDate;

  showChildren = true;

  flightPopularList = [
    {
      'AIRPORTCODE': 'AYT',
      'AIRPORTNAME': 'Antalya (Antalya-AYT)',
      'CITYCODE': 'AYT',
      'CITYNAME': 'Antalya',
      'COUNTRYCODE': 'TR',
      'COUNTRYNAME': 'Turkey',
      'LOCATIONTYPE': 'A',
      'ORDERID': 1,
      'RANK': 0
    },
    {
      'AIRPORTCODE': 'SAW',
      'AIRPORTNAME': 'Istanbul (Sabiha Gokcen-SAW)',
      'CITYNAME': 'Istanbul',
      'CITYCODE': 'IST',
      'COUNTRYNAME': 'Turkey',
      'COUNTRYCODE': 'TR',
      'LOCATIONTYPE': 'A',
      'ORDERID': 1,
      'RANK': 0
    },
    {
      'AIRPORTCODE': 'PAR',
      'AIRPORTNAME': 'Paris',
      'CITYNAME': 'Paris',
      'CITYCODE': 'PAR',
      'COUNTRYNAME': 'France',
      'COUNTRYCODE': 'FR',
      'LOCATIONTYPE': 'C',
      'ORDERID': 1,
      'RANK': 0
    },
    {
      'AIRPORTCODE': 'BER',
      'AIRPORTNAME': 'Berlin',
      'CITYNAME': 'Berlin',
      'CITYCODE': 'BER',
      'COUNTRYNAME': 'Germany',
      'COUNTRYCODE': 'DE',
      'LOCATIONTYPE': 'C',
      'ORDERID': 1,
      'RANK': 0
    },
    {
      'AIRPORTCODE': 'ATL',
      'AIRPORTNAME': 'Atlanta',
      'CITYNAME': 'Atlanta',
      'CITYCODE': 'ATL',
      'COUNTRYNAME': 'United States',
      'COUNTRYCODE': 'US',
      'LOCATIONTYPE': 'C',
      'ORDERID': 1,
      'RANK': 0
    }
  ];

  latestSearches = [];

  data: FormDialogData;
  maxAdultCount = 6;
  maxChildCount = 6;

  constructor(
    @Optional() public dialogRef: MatDialogRef<FormDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public datae: FormDialogData,
    public appService: AppService,
    private cacheService: SearchboxCacheService,
  ) {
  }

  ngOnInit() {
    if (this.mode === 'dialog') {
      this.data = this.datae;
    }

    if (this.data.maxAdultCount) {
      this.maxAdultCount = this.data.maxAdultCount;
    }

    if (this.data.maxChildCount) {
      this.maxChildCount = this.data.maxChildCount;
    }

    this.dateFormat = this.data.dateFormat || this.dateFormat;
    this.minDate = this.data.dateMinDate || this.minDate;
    this.maxDate = moment().add(this.data.dateMaxDateNumber || 1, 'year');
    if (this.data.value) {
      switch (this.data.mode) {
        case 'transfer-autocomplete':
        case 'time':
        case 'date':
        case 'flight-autocomplete':
          this.fc.setValue(this.data.value);
          break;
        case 'passenger':
          this.adultFC.setValue(this.data.value.adultCount);
          this.cabinClassFC.setValue(this.data.value.cabin);
          this.childFC.setValue(this.data.value.child);
          break;
      }
    }
    const isThereAnyCaches = localStorage.getItem(this.data.mode);
    if (isThereAnyCaches) {
      let caches = [];
      try {
        caches = JSON.parse(localStorage.getItem(this.data.mode)) || [];
      } catch (e) {
      }
      this.latestSearches = caches;
    }

    this.showChildren = !(this.data.hasOwnProperty('hideChildren') && this.data.hideChildren);

    merge(this.fc.valueChanges, this.childFC.valueChanges, this.adultFC.valueChanges, this.cabinClassFC.valueChanges).subscribe(value => {
      this.fcData.next(this.figureOutData());
      if (this.data.mode !== 'time' && this.data.mode !== 'passenger') {
        this.close.emit();
      }
    });

  }

  figureOutData(value = this.fc.value) {
    let data;
    switch (this.data.mode) {
      case 'time':
      case 'date':
        try {
          if (moment.isMoment(value)) {
            data = value.format(this.dateFormat);
          } else if (value) {
            data = moment(value).format(this.dateFormat);
          } else {
            data = this.minDate;
          }
        } catch (e) {
        }
        break;
      case 'flight-autocomplete':
        this.setCache();
        data = value;
        break;
      case 'transfer-autocomplete':
        data = value;
        break;
      case 'passenger':
        const passengerData = {
          adultCount: this.adultFC.value,
          child: this.childFC.value,
          cabin: this.cabinClassFC.value
        };
        data = passengerData;
        break;
    }
    return data;
  }


  closeDialog() {
    if (this.mode === 'dialog') {
      this.dialogRef.close(this.figureOutData());
    } else {
      this.fcData.emit(this.figureOutData());
      this.close.emit();
    }
  }

  setCache() {
    if (this.fc.value && typeof this.fc.value !== 'string') {
      let isThereAnyCaches = [];
      try {
        isThereAnyCaches = JSON.parse(localStorage.getItem(this.data.mode)) || [];
      } catch (e) {
      }
      const filteredArr = isThereAnyCaches.filter(value => {
        if (this.data.mode === 'flight-autocomplete') {
          return value.AIRPORTCODE !== this.fc.value.AIRPORTCODE;
        }
        // if (this.data.mode === 'transfer-autocomplete') {
        //   return value.VALUE !== this.fc.value.VALUE;
        // }
      });
      filteredArr.unshift(this.fc.value);
      localStorage.setItem(this.data.mode, JSON.stringify(filteredArr.slice(0, 5)));
    }
  }

  ngAfterViewInit(): void {
  }

  onSelection(e: Moment) {
    try {
      this.fcData.emit(this.figureOutData());
      this.close.emit();
      this.dialogRef.close(this.figureOutData());
    } catch (ef) {
    }
  }

  onFlightOptionSelected(val) {
    if (this.data.mode === 'flight-autocomplete') {
      this.setCache();
    }

    this.fcData.emit(val);
    this.dialogRef.close(val);
  }

  mockArrayCreator(num) {
    return Array(num);
  }

  onClick(e: MouseEvent) {
    // @ts-ignore
    if (typeof e.target.className === 'string' && e.target.className.search('cell-selected') >= 0) {
      this.fcData.next(this.figureOutData());
      if (this.data.mode !== 'time') {
        this.close.emit();
      }
    }
  }
}

export interface FormDialogData {
  hideChildren?: boolean;
  maxChildAge?: number;
  minChildAge?: number;
  mode: 'time' | 'date' | 'flight-autocomplete' | 'passenger' | 'transfer-autocomplete';
  header: string;
  placeholder?: string;
  dateFormat?: string;
  dateStartAt?: Moment;
  value?: any;
  // default today
  dateMinDate?: Moment;
  // default (1) year
  dateMaxDateNumber?: number;
  isCabinActive?: boolean;
  firstAutocomplete?: boolean;
  latlonForTransfer?: string[];
  autoCompleteFn?;
  maxAdultCount?: number;
  maxChildCount?: number;
  maxChild?: number;
}
