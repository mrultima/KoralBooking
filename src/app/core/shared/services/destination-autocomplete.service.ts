import { Injectable } from '@angular/core';
// import { GoogleAutocompleteResult } from '../../custom-form-controls/google-autocomplete/google-autocomplete.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinationAutocompleteService {

  // googleAutocompleteData: BehaviorSubject<GoogleAutocompleteResult> = new BehaviorSubject<GoogleAutocompleteResult>({
  //   config: {
  //     COUNTRYCODE: 'TR',
  //     MAXLATITUDE: '36.9755861',
  //     MAXLONGITUDE: '30.855250999999953',
  //     MINLATITUDE: '36.820289',
  //     MINLONGITUDE: '30.580959099999973',
  //     VALUE: 'Antalya, Turkey',
  //   }
  // });

  basicAutocompleteData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
  }
}
