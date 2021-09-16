import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  rates = [];
  rates$ = new BehaviorSubject([])

  private readonly progress$ = new BehaviorSubject(false);

  constructor(
    private api: ApiService
  ) { }

  async getRates(hotelId: number) {

    if (this.progress$.getValue()) {
      while (!this.progress$.getValue()) {
        await timer(100).toPromise();
      }
    }
    const lk = '_er',
      l = JSON.parse(localStorage.getItem(lk)) || {},
      d = +new Date(), o = l[hotelId] || {}, k = Object.keys(o);
    if (k.length > 0 && Math.round((d - (+k[0])) / 6e4) < 90) {
      this.rates = o[k[0]];
      this.rates$.next(this.rates);
      return;
    }
    this.progress$.next(true);
    await this.api.execSP
      ({
        Object: 'SP_PORTALV4_EXCHANGELIST',
        Parameters: { 'HOTELID': hotelId }
      }
      ).then(
        x => {
          l[hotelId] = { [d]: x };
          localStorage.setItem(lk, JSON.stringify(l));
          this.rates = x;
          this.rates$.next(this.rates);
        }
      ).finally(() => {
        this.progress$.next(false);
      });
  }
}
