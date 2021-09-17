/* tslint:disable:max-line-length */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment'; 
import { BehaviorSubject, Subscription } from 'rxjs';
import { AppService, FilterModel, FilterTimeConfig } from '../../shared';

@Component({
  selector: 'ta-core-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() filterConfig: FilterModel[];

  @Input() set filterData(filterData) {
    if (filterData) {
      if (filterData.hasOwnProperty('searchValues')) {
        this.searchValues = JSON.parse(JSON.stringify(filterData.searchValues));
      }
      if (filterData.hasOwnProperty('dynamicValues')) {
        this.dynamicValues = JSON.parse(JSON.stringify(filterData.dynamicValues));
      }
      if (filterData.hasOwnProperty('departValues')) {
        this.departValues = JSON.parse(JSON.stringify(filterData.departValues));
      }
      if (filterData.hasOwnProperty('staticValues')) {
        this.staticValues = JSON.parse(JSON.stringify(filterData.staticValues));
      }
      if (filterData.hasOwnProperty('IconValues')) {
        this.IconValues = JSON.parse(JSON.stringify(filterData.IconValues));
      }
      if (filterData.hasOwnProperty('rangeValues')) {
        this.rangeValues = JSON.parse(JSON.stringify(filterData.rangeValues));
      }

      this.filter();
    }
  }

  @Input() set data(data: Array<any>) {
    if (data) {
      this._data = data;
      setTimeout(() => {
        this.setFilters();
      }, 0);
    }
  }

  private _isDisabled = false;
  @Input() set isDisabled(bool: boolean) {
    this._isDisabled = !!bool;
  }

  get isDisabled() {
    return this._isDisabled;
  }

  private _data;

  get data() {
    return this._data;
  }

  @Output() filteredData = new BehaviorSubject(null);

  @Output() state = new EventEmitter();

  searchValues = {};
  dynamicValues = {};
  departValues = {};
  staticValues = {};
  starValues = {};
  IconValues = {};
  rangeValues: {
    [k: string]: FilterTimeConfig
  } = {};

  timeRangeConfig = {
    format: {
      from: (value) => {
        if (value.search(':') >= 0) {
          const arr = value.split(':');
          const minute = (Number(arr[0]) * 60) + Number(arr[1]);
          return minute;
        } else {
          return value;
        }
      },
      to: (minutes) => {
        const hour = Math.floor(Math.floor(minutes) / 60);
        const minute = Math.floor(minutes) - hour * 60;
        return hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0');
      }
    }
  };

  // needed for currency
  isThereAnyRangeChecker = false;
  subs: Subscription;

  constructor(
    private appService: AppService) {
  }

  setFilters() {
    this.searchValues = {};
    this.dynamicValues = {};
    this.departValues = {};
    this.staticValues = {};
    this.starValues = {};
    this.rangeValues = {};
    this.IconValues = {};

    const list = {};
    for (const filter of this.filterConfig) {
      switch (filter.type.name) {
        case 'dynamicOption':
          list[filter.name] = _.compact(_.uniq(this.data.map(x => _.get(x, filter.name))));
          this.dynamicValues[filter.name] = {};
          for (const item of list[filter.name]) {
            this.dynamicValues[filter.name][item] = false;
          }
          break;
        case 'iconButton':
          const IconArray = _.compact(_.uniq(this.data.map(x => _.get(x, filter.name))));
          const IconList = _.compact(_.uniq(IconArray.join(',').split(',')));
          list[filter.name] = IconList;
          this.IconValues[filter.name] = {};
          for (const item of list[filter.name]) {
            this.IconValues[filter.name][item] = false;
          }
          break;
        case 'flightDepartStops':
          list[filter.name] = _.uniq(this.data.map(x => (_.get(x, filter.name) as Array<any>).length)).sort((a, b) => a - b);
          this.departValues[filter.name] = {};

          for (const item of list[filter.name]) {
            this.departValues[filter.name][(item - 1)] = false;
          }
          break;
        case 'flightAirport':
          list[filter.name] = _.compact(_.uniq((this.data as Array<any>).reduce((previousValue, currentValue) => {
              const valss = _.get(currentValue, filter.name);
              return [...previousValue, ...valss.map(x => x.arrivalAirport.name), ...valss.map(x => x.departureAirport.name)];
            }, [])
          ));

          this.dynamicValues[filter.name] = {};
          for (const item of list[filter.name]) {
            this.dynamicValues[filter.name][item] = false;
          }
          break;
        case 'staticOption':
          list[filter.name] = filter.type.staticValues;
          this.staticValues[filter.name] = {};
          for (const item of list[filter.name]) {
            this.staticValues[filter.name][item] = false;
          }
          break;
        case 'stars':
          list[filter.name] = filter.type.staticValues;
          this.staticValues[filter.name] = {};
          for (const item of list[filter.name]) {
            this.staticValues[filter.name][item] = false;
          }
          break;
        case 'range':
          const arr = _.compact(_.uniq(this.data.map(x => _.get(x, filter.name))));
          if (arr.length > 1) {
            this.isThereAnyRangeChecker = true;
            const sortedArray = arr.sort((a, b) => a - b);
            const num1 = Number(this.appService.convert(sortedArray[0]));
            const num2 = Number(this.appService.convert(sortedArray[sortedArray.length - 1]));
            this.rangeValues[filter.name] = {
              min: num1,
              max: num2,
              step: Math.abs((sortedArray[sortedArray.length - 1] - sortedArray[0]) / 100),
              start: [num1, num2]
            };
          }
          break;
        case 'time':
          const arrr = _.compact(_.uniq(this.data.map(x => _.get(x, filter.name))));
          if (arrr.length) {
            this.rangeValues[filter.name] = {
              min: 0,
              max: 60 * 24, // 1 day in minutes
              step: 15,
              start: [0, (60 * 24)]
            };
          }
          break;
        case 'search':
          this.searchValues[filter.name] = '';
          break;
        case 'date':
          const dateArr = _.compact(_.uniq(this.data.map(x => _.get(x, filter.name))));
          if (dateArr.length) {
            const sorted = _.sortBy(dateArr, (x, y) => moment(x).diff(moment(y)));

            const min = moment(sorted[0]).valueOf();
            const max = moment(sorted[sorted.length - 1]).valueOf();
            this.rangeValues[filter.name] = {
              min: min,
              max: max,
              start: [min, max],
            };
          }
          break;
      }
    }

    this.state.next({
      searchValues: this.searchValues,
      dynamicValues: this.dynamicValues,
      departValues: this.departValues,
      staticValues: this.staticValues,
      starValues: this.starValues,
      IconValues: this.IconValues,
      rangeValues: this.rangeValues
    });
  }

  objLength(obj) {
    return obj ? Object.keys(obj).length : 0;
  }

  ngOnInit() {
    this.subs = this.appService.currency.subscribe(value => {
      if (this.isThereAnyRangeChecker) {
        this.setFilters();
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  filter() {
    if (!this.data) {
      return;
    }

    let selectStars = false;
    this.state.next({
      searchValues: this.searchValues,
      dynamicValues: this.dynamicValues,
      departValues: this.departValues,
      staticValues: this.staticValues,
      starValues: this.starValues,
      IconValues: this.IconValues,
      rangeValues: this.rangeValues
    });

    this.filteredData.next(this.data.filter(item => {
      for (const filter of this.filterConfig) {
        switch (filter.type.name) {
          case 'search':
            const searchVal = (this.searchValues[filter.name] as string).toLowerCase();
            const itemParam = (_.get(item, filter.name) as string).toLowerCase();
            if (this.searchValues[filter.name] && itemParam.search(searchVal) === -1) {
              return false;
            }
            break;
          case 'stars':


            const booleans1 = [];

            selectStars = false;

            for (const e in Object(this.staticValues['Stars'])) {
              if (this.staticValues['Stars'][e] === true && e !== '0') {
                this.dynamicValues['AccomodationType']['hotel'] = true;
                selectStars = true;
              }
            }
            for (const prop in Object(this.dynamicValues['AccomodationType'])) {
              if (prop !== 'hotel' && this.staticValues['Stars']['0']) {
                this.dynamicValues['AccomodationType'][prop] = true;
              } else if (!selectStars && this.staticValues['Stars']['0']) {
                this.dynamicValues['AccomodationType']['hotel'] = false;
              } else if (prop !== 'hotel' && !this.staticValues['Stars']['0']) {
                this.dynamicValues['AccomodationType'][prop] = false;
              }

            }


            if (this.dynamicValues['AccomodationType']['hotel'] === false && this.staticValues['Stars'][0]) {
              booleans1.push(true);
            }
            const anArray1 = Object.entries(this.staticValues[filter.name]).map(x => {

              return [Number(x[0]), x[1]];
            });
            const value1 = _.get(item, filter.name);
            // if nothing selected then continue
            if (item.AccomodationType !== 'hotel' || Object.keys(_.pickBy(this.staticValues[filter.name], _.identity)).length === 0) {
              continue;
            }
            anArray1.forEach(([key, val], index) => {

              if (key !== 0) {
                const numKey1 = Number(key);
                if (val && value1 !== null && value1 !== undefined) {
                  const numValue = Number(value1);
                  const direction = filter.type.staticDirection || 'asc';
                  if (direction === 'asc') {
                    if (anArray1.length > index + 1) {
                      if (numKey1 <= numValue && numValue < anArray1[index + 1][0]) {
                        booleans1.push(true);
                      }
                    } else if (numKey1 <= numValue) {
                      booleans1.push(true);
                    }
                  } else {
                    if (anArray1.length > index + 1) {
                      if (numValue >= numKey1 && anArray1[index + 1][0] > numValue) {
                        booleans1.push(true);
                      }
                    } else if (numValue >= Number(numKey1)) {
                      booleans1.push(true);
                    }

                  }
                }
              }
            });
            if (!booleans1.length) {
              return false;
            }

            break;
          case 'iconButton':
            const booleanIconArray = Object.keys(_.pickBy(this.IconValues[filter.name], _.identity));
            if (booleanIconArray.length === 0) {
              continue;
            }
            if (_.get(item, filter.name).length === 0) {
              return false;
            }
            const arry = _.get(item, filter.name).some(val => {
              return _.includes(booleanIconArray, val);
            });

            if (!arry) {
              return false;
            }
            break;
          case 'dynamicOption':
            // this.dynamicValues[filter.name]'nin değeri {
            //  "AI": false,
            //  "FB+": false,
            //  "OB": true,
            //  "BB": true,
            //  "UAI": true,
            //  "HB": false,
            //  "ALL": false
            // }
            //
            // _.pickBy(this.dynamicValues[filter.name], _.identity) kodu alttaki hale getiriyor.
            // {
            //  "OB": true,
            //  "BB": true,
            //  "UAI": true,
            // }
            // sonra da _.get(x, filter.name) bize şuandaki item'in gerekli filtre değerini alarak yukarıdaki objede var mı diye bakıyor.
            // yok ise false
            const booleanArray = Object.keys(_.pickBy(this.dynamicValues[filter.name], _.identity));
            if (booleanArray.length > 0 && !_.includes(booleanArray, _.get(item, filter.name))) {
              return false;
            }
            break;
          case 'staticOption':
            const anArray = Object.entries(this.staticValues[filter.name]).map(x => {
              return [Number(x[0]), x[1]];
            });
            const value = _.get(item, filter.name);
            const booleans = [];
            // if nothing selected then continue
            if (Object.keys(_.pickBy(this.staticValues[filter.name], _.identity)).length === 0) {
              continue;
            }
            anArray.forEach(([key, val], index) => {
              const numKey = Number(key);
              if (val && value !== null && value !== undefined) {
                const numValue = Number(value);
                const direction = filter.type.staticDirection || 'asc';
                if (direction === 'asc') {
                  if (anArray.length > index + 1) {
                    if (numKey <= numValue && numValue < anArray[index + 1][0]) {
                      booleans.push(true);
                    }
                  } else if (numKey <= numValue) {
                    booleans.push(true);
                  }
                } else {
                  if (anArray.length > index + 1) {
                    if (numValue >= numKey && anArray[index + 1][0] > numValue) {
                      booleans.push(true);
                    }
                  } else if (numValue >= Number(numKey)) {
                    booleans.push(true);
                  }

                }
              }
            });
            if (!booleans.length) {
              return false;
            }
            break;
          case 'flightAirport':
            const booleanArray1 = Object.keys(_.pickBy(this.dynamicValues[filter.name], _.identity));
            // const airports = _.compact(_.uniq(_.get(item, filter.name).reduce((previousValue, currentValue) => {
            //     previousValue.push(currentValue.departureAirport.name);
            //     previousValue.push(currentValue.arrivalAirport.name);
            //     return previousValue;
            //   }, [])
            // ));
            const airports = _.compact(_.uniq(_.get(item, filter.name).reduce((previousValue, currentValue) => {
                previousValue.push(currentValue.departureAirport.name);
                previousValue.push(currentValue.arrivalAirport.name);
                return previousValue;
              }, [])
            ));
            if (booleanArray1.length > 0 && !booleanArray1.some(booleanArray1val => {
              return _.includes(airports, booleanArray1val as any);
            })) {
              return false;
            }
            break;
          case 'flightDepartStops':
            const booleanArrayd = Object.keys(_.pickBy(this.departValues[filter.name], _.identity));

            if (booleanArrayd.length > 0 && !_.includes(booleanArrayd, (_.get(item, filter.name).length - 1) + '')) {
              return false;
            }
            break;
          case 'range':
            if (Object.keys(this.rangeValues).length === 0) {
              continue;
            }
            if (!this.rangeValues[filter.name]) {
              continue;
            }
            if (this.rangeValues[filter.name].start[0] === this.rangeValues[filter.name].min && this.rangeValues[filter.name].start[1] === this.rangeValues[filter.name].max) {
              continue;
            }
            const va = Number(this.appService.convert(_.get(item, filter.name)));
            if (!_.get(item, filter.name) || this.rangeValues[filter.name].start[0] > va || va > this.rangeValues[filter.name].start[1]) {
              return false;
            }
            break;
          case 'onlyProperty':
            if (filter.displayCheck === false) {
              continue;
            }
            const valss = _.get(item, filter.name);
            if (item.HotelBedsId === 8082) {
            }
            if (valss !== 0 && valss != null) {
              continue;
            } else {
              return false;
            }

          case 'time':
            if (this.rangeValues[filter.name].start[0] === this.rangeValues[filter.name].min && this.rangeValues[filter.name].start[1] === this.rangeValues[filter.name].max) {
              continue;
            }
            const timeVal = _.get(item, filter.name);
            const time = moment(timeVal).minutes() + moment(timeVal).hours() * 60;
            if (!(this.rangeValues[filter.name].start[0] <= time && this.rangeValues[filter.name].start[1] >= time)) {
              return false;
            }
            break;
          case 'date':
            // if (this.rangeValues[filter.name].start[0] === this.rangeValues[filter.name].min && this.rangeValues[filter.name].start[1] === this.rangeValues[filter.name].max) {
            //   continue;
            // }
            const dateInUnix = moment(_.get(item, filter.name)).valueOf();
            if (!(this.rangeValues[filter.name].start[0] <= dateInUnix && this.rangeValues[filter.name].start[1] >= dateInUnix)) {
              return false;
            }
            break;
        }
      }
      return item;
    }));
  }

  onChange(search: string, filterName?: string, key?: boolean) {
    if (filterName != null && key !== undefined && key !== null) {
      this.IconValues[filterName][key] = !this.IconValues[filterName][key];
    }
    this.filter();
  }

  forArray(numbers: number) {
    if (numbers === undefined || numbers === null) {
      return [];
    }
    return Array(Math.floor(Math.abs(+numbers)));
  }

  changeToNumber(e) {
    return Number(e);
  }

  isArray(icon: string | Array<string>) {
    return Array.isArray(icon);
  }

  clearFilter() {
    this.setFilters();
    this.filter();
  }


}
