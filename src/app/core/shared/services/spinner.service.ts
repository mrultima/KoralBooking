import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  showSpinner: boolean = false;
  spinnerType: number = 1;

  constructor() { }

  async onSpinner (show: boolean, type: number) {
    // type; 1 = searchSpinner, 2= loadingPage
    this.showSpinner = show;
    this.spinnerType = type;
  }

}
