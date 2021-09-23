import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';


import { BehaviorSubject, config, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { HotelConfig } from '../types';
import { SearchBoxService } from './searchbox.service';


@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit, OnDestroy {
  mock60 = Array(60);

  isDestroyed = new Subject();
  searchFormGroup = this.searchboxService.searchFormGroup;

  minDate: Date;
  maxDate: Date;
  minLos = new BehaviorSubject(2);
  minDayFilter = new BehaviorSubject(moment().format('YYYY-MM-DD'));
  adultCount = this.api.hotelConfig?.MaxAdult;
  childCount = this.api.hotelConfig?.MaxChild;


  constructor(public api: ApiService, private searchboxService: SearchBoxService) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }
  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }

  async ngOnInit() {

    this.searchFormGroup.get('DAYS')?.valueChanges.pipe(
      distinctUntilChanged()
    ).pipe(
      takeUntil(this.isDestroyed)
    ).subscribe(
      {
        next: (days) => {
          this.searchFormGroup.get('CHECKOUT')?.setValue(
            moment(this.searchFormGroup.get('CHECKIN')?.value).add(days, 'days').toDate()   // inc by days
          );
        }
      }
    );

    this.searchFormGroup.get('CHECKIN')?.valueChanges.pipe(
      distinctUntilChanged()
    ).pipe(
      takeUntil(this.isDestroyed)
    ).subscribe(
      {
        next: () => {

          const cIn = this.searchFormGroup.get('CHECKIN')?.value;
          const cOut = this.searchFormGroup.get('CHECKOUT')?.value;
          var cInArr = parseInt(moment(cIn).format('DD')) + parseInt(moment(cIn).format('MM')) * 30 + parseInt(moment(cIn).format('YYYY')) * 365;
          var cOutArr = parseInt(moment(cOut).format('DD')) + parseInt(moment(cOut).format('MM')) * 30 + parseInt(moment(cOut).format('YYYY')) * 365 - this.minLos.value;

          this.searchFormGroup.get('CHECKOUT')?.setValue(
            moment(this.searchFormGroup.get('CHECKIN')?.value).add(this.minLos.value, "day").toDate()   // inc by days
          );
          if (!cIn || cOutArr < cInArr) {
            this.searchFormGroup.get('CHECKOUT')?.setValue(moment(cIn).add(+this.minLos.value, 'day').toISOString());
          } else {
            this.searchFormGroup.get('CHECKOUT')?.setValue(cOut);
          }
        }
      }
    );

    this.searchFormGroup.get('CHECKOUT')?.valueChanges.pipe(
      distinctUntilChanged(
        (x1, x2) => {
          return moment(x1).startOf('day').isSame(moment(x2).startOf('day'));
        }
      )
    ).pipe(
      takeUntil(this.isDestroyed)
    ).subscribe(
      {
        next: (checkout) => {
          const cin = moment(this.searchFormGroup.get('CHECKIN')?.value);
          const cout = moment(this.searchFormGroup.get('CHECKOUT')?.value);
          this.searchFormGroup.get('DAYS')?.setValue(
            moment.duration(cout.diff(cin)).asDays()   // find diff by days
          );
        }
      }
    )

  }

  onSearch(): void {
    const formValue = this.searchFormGroup.value;
    formValue.CHECKIN = moment(formValue.CHECKIN).format('YYYY-MM-DD') + ' 00:00';
    formValue.CHECKOUT = moment(formValue.CHECKOUT).format('YYYY-MM-DD' + ' 00:00');
    this.api.onSearch(formValue);
  }

  myFilter = (d: Date): boolean => {
    return moment(d).startOf('day').diff(moment(this.minDayFilter.getValue()).startOf('day')) > -1;
    // tslint:disable-next-line:semicolon
  };



}
