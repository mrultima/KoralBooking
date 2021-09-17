import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AppService } from './app.service';



@Injectable({
  providedIn: 'root'
})
export class SearchboxCacheService {

  mainKey = 'searchboxCache';
  cache: {
    [k: string]: {
      date: string,
      value: string,
      lang: string
    }
  };

  constructor(
    private appService: AppService,
  ) {
    const data = localStorage.getItem(this.mainKey);
    if (!data) {
      this.cache = {};
    } else {
      this.cache = JSON.parse(data);
    }
  }

  setCache(key: string, value: Object, date: string | Date): void {
    const data = this.getLatestCache(key);
    if (data) {
      for (const field of Object.keys(value)) {
        if (value[field] !== undefined && value[field] !== null) {
          data[field] = value[field];
        }
      }
      this.cache[key] = {
        value: JSON.stringify(data),
        date: this.appService.getDate(date),
        lang: this.appService.language.getValue(),
      };
    } else {
      this.cache[key] = {
        value: JSON.stringify(value),
        date: this.appService.getDate(date),
        lang: this.appService.language.getValue(),
      };

    }
    localStorage.setItem(this.mainKey, JSON.stringify(this.cache));
  }

  getLatestCache(key: string): Object | undefined {
    if (this.cache.hasOwnProperty(key) && moment().startOf('day').diff(moment(this.cache[key].date)) <= 0) {
      return JSON.parse(this.cache[key].value);
    } else {
      return;
    }
  }
}
