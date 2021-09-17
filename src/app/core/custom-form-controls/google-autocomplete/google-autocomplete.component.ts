import {AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatFormFieldAppearance} from '@angular/material/form-field';

// import PlaceResult = google.maps.places.PlaceResult;

export interface GoogleAutocompleteResult {
  place?: any;
  config?: {
    'MINLATITUDE'?: string;
    'MAXLATITUDE'?: string;
    'MINLONGITUDE'?: string;
    'MAXLONGITUDE'?: string;
    'COUNTRYCODE'?: string;
    'VALUE'?: string;
  };
}

const GoogleAutocompleteProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GoogleAutocompleteComponent),
  multi: true
};

@Component({
  selector: 'ta-core-google-autocomplete',
  templateUrl: './google-autocomplete.component.html',
  styleUrls: ['./google-autocomplete.component.scss'],
  providers: [GoogleAutocompleteProvider]
})
export class GoogleAutocompleteComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Output() setAddress: EventEmitter<GoogleAutocompleteResult> = new EventEmitter();
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @ViewChild('addresstext') addresstext: any;

  autocompleteInput = new FormControl();

  constructor() {
  }

  onChangedFn: (any) => void = () => {
    // tslint:disable-next-line:semicolon
  };
  onTouchedFn: () => void = () => {
    // tslint:disable-next-line:semicolon
  };

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    // if (window['google']) {
    //   const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {types: ['(cities)']});
    //   google.maps.event.addListener(autocomplete, 'place_changed', () => {
    //     const place = autocomplete.getPlace();
    //     this.invokeEvent(place);
    //   });
    // } else {
    //   const ref = interval(100).subscribe(x => {
    //     if (window['google']) {
    //       const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {types: ['(cities)']});
    //       google.maps.event.addListener(autocomplete, 'place_changed', () => {
    //         const place = autocomplete.getPlace();
    //         this.invokeEvent(place);
    //       });
    //       ref.unsubscribe();
    //     }
    //   });
    // }
  }

  invokeEvent(place: any) {
    const result: GoogleAutocompleteResult = {
      place: place, config: {
        COUNTRYCODE: '',
        MAXLATITUDE: '',
        MAXLONGITUDE: '',
        MINLATITUDE: '',
        MINLONGITUDE: '',
        VALUE: '',
      }
    };

    const countryAddress = place.address_components ? place.address_components.filter(x => x.types.some(y => y === 'country')) : '';
    if (countryAddress && countryAddress.length > 0) {
      result.config.COUNTRYCODE = countryAddress[0].short_name;
    }
    if (place.formatted_address) {
      result.config.VALUE = place.formatted_address;
    }
    const coordinate = place.geometry.viewport.toJSON();
    result.config.MAXLATITUDE = coordinate.north + '';
    result.config.MINLATITUDE = coordinate.south + '';
    result.config.MAXLONGITUDE = coordinate.east + '';
    result.config.MINLONGITUDE = coordinate.west + '';

    this.onChangedFn(result);

    this.setAddress.emit(result);
  }

  registerOnChange(fn: any): void {
    this.onChangedFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.autocompleteInput.disable() : this.autocompleteInput.enable();
  }

  writeValue(val: GoogleAutocompleteResult): void {
    if (val) {
      if (typeof val === 'string') {
        this.autocompleteInput.setValue(val);
      } else {
        this.autocompleteInput.setValue(val.config.VALUE);
        this.onChangedFn(val);
      }
    }
  }
}
