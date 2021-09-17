import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil, startWith, distinctUntilChanged, tap } from 'rxjs/operators';
import { AppService, TranslateService, CustomValidators } from '../../shared';
import { ThemePalette } from '@angular/material/core';

export const CountryConfig = [
  { 'ID': 1, 'NAME': 'Turkey' },
  { 'ID': 2, 'NAME': 'United States' },
  { 'ID': 3, 'NAME': 'Czech Republic' },
  { 'ID': 4, 'NAME': 'Hungary' },
  { 'ID': 5, 'NAME': 'Austria' },
  { 'ID': 6, 'NAME': 'Poland' },
  { 'ID': 7, 'NAME': 'Switzerland' },
  { 'ID': 8, 'NAME': 'Russia' },
  { 'ID': 9, 'NAME': 'Romania' },
  { 'ID': 10, 'NAME': 'Netherlands' },
  { 'ID': 11, 'NAME': 'Spain' },
  { 'ID': 12, 'NAME': 'France' },
  { 'ID': 13, 'NAME': 'Italy' },
  { 'ID': 14, 'NAME': 'Tunis' },
  { 'ID': 15, 'NAME': 'Morocco' },
  { 'ID': 16, 'NAME': 'Egypt' },
  { 'ID': 18, 'NAME': 'Australia' },
  { 'ID': 19, 'NAME': 'Puerto Rico' },
  { 'ID': 20, 'NAME': 'Chile' },
  { 'ID': 21, 'NAME': 'Argentina' },
  { 'ID': 22, 'NAME': 'Brazil' },
  { 'ID': 23, 'NAME': 'Denmark' },
  { 'ID': 24, 'NAME': 'United Arab Emirates' },
  { 'ID': 25, 'NAME': 'Lebanon' },
  { 'ID': 26, 'NAME': 'Slovenia' },
  { 'ID': 27, 'NAME': 'United Kingdom' },
  { 'ID': 28, 'NAME': 'Bosnia and Herz' },
  { 'ID': 29, 'NAME': 'Greece' },
  { 'ID': 30, 'NAME': 'Northern Cyprus' },
  { 'ID': 31, 'NAME': 'Canada' },
  { 'ID': 32, 'NAME': 'Germany' },
  { 'ID': 33, 'NAME': 'Vietnam' },
  { 'ID': 34, 'NAME': 'Nepal' },
  { 'ID': 35, 'NAME': 'Japan' },
  { 'ID': 36, 'NAME': 'China' },
  { 'ID': 38, 'NAME': 'Belgium' },
  { 'ID': 39, 'NAME': 'Sweden' },
  { 'ID': 40, 'NAME': 'Monaco' },
  { 'ID': 41, 'NAME': 'Malta' },
  { 'ID': 42, 'NAME': 'Portugal' },
  { 'ID': 43, 'NAME': 'Seychelles' },
  { 'ID': 44, 'NAME': 'Cuba' },
  { 'ID': 45, 'NAME': 'South Africa' },
  { 'ID': 46, 'NAME': 'Maldives' },
  { 'ID': 47, 'NAME': 'Mauritius Islands' },
  { 'ID': 48, 'NAME': 'Kenya' },
  { 'ID': 49, 'NAME': 'Malaysia' },
  { 'ID': 50, 'NAME': 'Bulgaria' },
  { 'ID': 51, 'NAME': 'Indonesia' },
  { 'ID': 52, 'NAME': 'India' },
  { 'ID': 53, 'NAME': 'Latvia' },
  { 'ID': 54, 'NAME': 'Ukraine' },
  { 'ID': 55, 'NAME': 'Algeria' },
  { 'ID': 56, 'NAME': 'Uzbekistan' },
  { 'ID': 57, 'NAME': 'Croatia' },
  { 'ID': 58, 'NAME': 'Macedonia' },
  { 'ID': 59, 'NAME': 'Syria' },
  { 'ID': 60, 'NAME': 'Jordan' },
  { 'ID': 61, 'NAME': 'Equator' },
  { 'ID': 62, 'NAME': 'Ethiopia' },
  { 'ID': 63, 'NAME': 'Thailand' },
  { 'ID': 64, 'NAME': 'Singapore' },
  { 'ID': 65, 'NAME': 'Israel' },
  { 'ID': 66, 'NAME': 'Bolivia' },
  { 'ID': 67, 'NAME': 'Colombia' },
  { 'ID': 68, 'NAME': 'Paraguay' },
  { 'ID': 69, 'NAME': 'Uruguay' },
  { 'ID': 70, 'NAME': 'Peru' },
  { 'ID': 71, 'NAME': 'Venezuelan' },
  { 'ID': 72, 'NAME': 'New Zealand' },
  { 'ID': 73, 'NAME': 'Mexico' },
  { 'ID': 74, 'NAME': 'Norway' },
  { 'ID': 75, 'NAME': 'Jamaika' },
  { 'ID': 76, 'NAME': 'Tahiti' },
  { 'ID': 77, 'NAME': 'Finland' },
  { 'ID': 78, 'NAME': 'Sri Lanka' },
  { 'ID': 79, 'NAME': 'Bahamas' },
  { 'ID': 80, 'NAME': 'Estonia' },
  { 'ID': 81, 'NAME': 'Southern Ireland' },
  { 'ID': 82, 'NAME': 'Northern Ireland' },
  { 'ID': 83, 'NAME': 'South Cyprus' },
  { 'ID': 84, 'NAME': 'South Korea' },
  { 'ID': 85, 'NAME': 'Haiti' },
  { 'ID': 86, 'NAME': 'Scotland' },
  { 'ID': 87, 'NAME': 'Iceland' },
  { 'ID': 88, 'NAME': 'Canary Islands' },
  { 'ID': 89, 'NAME': 'Montenegro' },
  { 'ID': 90, 'NAME': 'Taiwan' },
  { 'ID': 91, 'NAME': 'Lithuanian' },
  { 'ID': 92, 'NAME': 'Luxembourg' },
  { 'ID': 93, 'NAME': 'Azerbaijan' },
  { 'ID': 94, 'NAME': 'Srbija' },
  { 'ID': 95, 'NAME': 'Albania' },
  { 'ID': 96, 'NAME': 'Saudi Arabia' },
  { 'ID': 97, 'NAME': 'Dominican Republic' },
  { 'ID': 98, 'NAME': 'Tasmania' },
  { 'ID': 99, 'NAME': 'Philippines' },
  { 'ID': 100, 'NAME': 'Kirghizistan' },
  { 'ID': 101, 'NAME': 'Kazakhistan' },
  { 'ID': 102, 'NAME': 'El Salvador' },
  { 'ID': 103, 'NAME': 'Nicaragua' },
  { 'ID': 104, 'NAME': 'Costa Rica' },
  { 'ID': 105, 'NAME': 'Panama' },
  { 'ID': 106, 'NAME': 'Pakistan' },
  { 'ID': 107, 'NAME': 'Namibia' },
  { 'ID': 108, 'NAME': 'Senegal' },
  { 'ID': 109, 'NAME': 'Mali' },
  { 'ID': 110, 'NAME': 'İran' },
  { 'ID': 111, 'NAME': 'Tanzania' },
  { 'ID': 112, 'NAME': 'Georgia' },
  { 'ID': 245, 'NAME': 'Moldova' },
  { 'ID': 246, 'NAME': 'Iraq' },
  { 'ID': 247, 'NAME': 'Turkmenistan' },
  { 'ID': 250, 'NAME': 'Armenia' },
  { 'ID': 251, 'NAME': 'Tajikistan' },
  { 'ID': 252, 'NAME': 'Belarus' },
  { 'ID': 253, 'NAME': 'Palestine' },
  { 'ID': 632, 'NAME': 'Afghanistan' },
  { 'ID': 633, 'NAME': 'American Samoa' },
  { 'ID': 634, 'NAME': 'Andorra' },
  { 'ID': 635, 'NAME': 'Angola' },
  { 'ID': 636, 'NAME': 'Anguilla' },
  { 'ID': 637, 'NAME': 'Antarctica' },
  { 'ID': 638, 'NAME': 'Antigua and Barbuda' },
  { 'ID': 639, 'NAME': 'Aruba' },
  { 'ID': 640, 'NAME': 'Bahrain' },
  { 'ID': 641, 'NAME': 'Bangladesh' },
  { 'ID': 642, 'NAME': 'Barbados' },
  { 'ID': 643, 'NAME': 'Belize' },
  { 'ID': 644, 'NAME': 'Benin' },
  { 'ID': 645, 'NAME': 'Bermuda' },
  { 'ID': 646, 'NAME': 'Bhutan' },
  { 'ID': 647, 'NAME': 'Botswana' },
  { 'ID': 648, 'NAME': 'British Indian Ocean Territory' },
  { 'ID': 649, 'NAME': 'British Virgin Islands' },
  { 'ID': 650, 'NAME': 'Brunei' },
  { 'ID': 651, 'NAME': 'Burkina Faso' },
  { 'ID': 652, 'NAME': 'Burundi' },
  { 'ID': 653, 'NAME': 'Cambodia' },
  { 'ID': 654, 'NAME': 'Cameroon' },
  { 'ID': 655, 'NAME': 'Cape Verde' },
  { 'ID': 656, 'NAME': 'Cayman Islands' },
  { 'ID': 657, 'NAME': 'Central African Republic' },
  { 'ID': 658, 'NAME': 'Chad' },
  { 'ID': 659, 'NAME': 'Christmas Island' },
  { 'ID': 660, 'NAME': 'Cocos Islands' },
  { 'ID': 661, 'NAME': 'Comoros' },
  { 'ID': 662, 'NAME': 'Cook Islands' },
  { 'ID': 663, 'NAME': 'Costa Rica' },
  { 'ID': 664, 'NAME': 'Curacao' },
  { 'ID': 665, 'NAME': 'Democratic Republic of the Congo' },
  { 'ID': 666, 'NAME': 'Djibouti' },
  { 'ID': 667, 'NAME': 'Dominica' },
  { 'ID': 668, 'NAME': 'East Timor' },
  { 'ID': 669, 'NAME': 'Equatorial Guinea' },
  { 'ID': 670, 'NAME': 'Eritrea' },
  { 'ID': 671, 'NAME': 'Falkland Islands' },
  { 'ID': 672, 'NAME': 'Faroe Islands' },
  { 'ID': 673, 'NAME': 'Fiji' },
  { 'ID': 674, 'NAME': 'French Polynesia' },
  { 'ID': 675, 'NAME': 'Gabon' },
  { 'ID': 676, 'NAME': 'Gambia' },
  { 'ID': 677, 'NAME': 'Ghana' },
  { 'ID': 678, 'NAME': 'Gibraltar' },
  { 'ID': 679, 'NAME': 'Greenland' },
  { 'ID': 680, 'NAME': 'Grenada' },
  { 'ID': 681, 'NAME': 'Guam' },
  { 'ID': 682, 'NAME': 'Guatemala' },
  { 'ID': 683, 'NAME': 'Guernsey' },
  { 'ID': 684, 'NAME': 'Guinea' },
  { 'ID': 685, 'NAME': 'Guinea-Bissau' },
  { 'ID': 686, 'NAME': 'Guyana' },
  { 'ID': 687, 'NAME': 'Honduras' },
  { 'ID': 688, 'NAME': 'Hong Kong' },
  { 'ID': 689, 'NAME': 'Isle of Man' },
  { 'ID': 690, 'NAME': 'Ivory Coast' },
  { 'ID': 691, 'NAME': 'Jersey' },
  { 'ID': 692, 'NAME': 'Kiribati' },
  { 'ID': 693, 'NAME': 'Kosovo' },
  { 'ID': 694, 'NAME': 'Kuwait' },
  { 'ID': 695, 'NAME': 'Laos' },
  { 'ID': 696, 'NAME': 'Lebanon' },
  { 'ID': 697, 'NAME': 'Lesotho' },
  { 'ID': 698, 'NAME': 'Liberia' },
  { 'ID': 699, 'NAME': 'Libya' },
  { 'ID': 700, 'NAME': 'Liechtenstein' },
  { 'ID': 701, 'NAME': 'Macau' },
  { 'ID': 702, 'NAME': 'Madagascar' },
  { 'ID': 703, 'NAME': 'Malawi' },
  { 'ID': 704, 'NAME': 'Marshall Islands' },
  { 'ID': 705, 'NAME': 'Mauritania' },
  { 'ID': 706, 'NAME': 'Mauritius' },
  { 'ID': 707, 'NAME': 'Mayotte' },
  { 'ID': 708, 'NAME': 'Micronesia' },
  { 'ID': 709, 'NAME': 'Mongolia' },
  { 'ID': 710, 'NAME': 'Montserrat' },
  { 'ID': 711, 'NAME': 'Mozambique' },
  { 'ID': 712, 'NAME': 'Myanmar' },
  { 'ID': 713, 'NAME': 'Nauru' },
  { 'ID': 714, 'NAME': 'Netherlands Antilles' },
  { 'ID': 715, 'NAME': 'New Caledonia' },
  { 'ID': 716, 'NAME': 'Nicaragua' },
  { 'ID': 717, 'NAME': 'Niger' },
  { 'ID': 718, 'NAME': 'Nigeria' },
  { 'ID': 719, 'NAME': 'Niue' },
  { 'ID': 720, 'NAME': 'North Korea' },
  { 'ID': 722, 'NAME': 'Oman' },
  { 'ID': 723, 'NAME': 'Palau' },
  { 'ID': 724, 'NAME': 'Palestine' },
  { 'ID': 725, 'NAME': 'Papua New Guinea' },
  { 'ID': 726, 'NAME': 'Pitcairn' },
  { 'ID': 727, 'NAME': 'Puerto Rico' },
  { 'ID': 728, 'NAME': 'Qatar' },
  { 'ID': 729, 'NAME': 'Republic of the Congo' },
  { 'ID': 730, 'NAME': 'Reunion' },
  { 'ID': 731, 'NAME': 'Rwanda' },
  { 'ID': 732, 'NAME': 'Saint Barthelemy' },
  { 'ID': 733, 'NAME': 'Saint Helena' },
  { 'ID': 734, 'NAME': 'Saint Kitts and Nevis' },
  { 'ID': 735, 'NAME': 'Saint Lucia' },
  { 'ID': 736, 'NAME': 'Saint Martin' },
  { 'ID': 737, 'NAME': 'Saint Pierre and Miquelon' },
  { 'ID': 738, 'NAME': 'Saint Vincent and the Grenadines' },
  { 'ID': 739, 'NAME': 'Samoa' },
  { 'ID': 740, 'NAME': 'San Marino' },
  { 'ID': 741, 'NAME': 'Sao Tome and Principe' },
  { 'ID': 742, 'NAME': 'Seychelles' },
  { 'ID': 743, 'NAME': 'Sierra Leone' },
  { 'ID': 744, 'NAME': 'Sint Maarten' },
  { 'ID': 745, 'NAME': 'Slovakia' },
  { 'ID': 746, 'NAME': 'Solomon Islands' },
  { 'ID': 747, 'NAME': 'Somalia' },
  { 'ID': 748, 'NAME': 'South Sudan' },
  { 'ID': 749, 'NAME': 'Sri Lanka' },
  { 'ID': 750, 'NAME': 'Sudan' },
  { 'ID': 751, 'NAME': 'Suriname' },
  { 'ID': 752, 'NAME': 'Svalbard and Jan Mayen' },
  { 'ID': 753, 'NAME': 'Swaziland' },
  { 'ID': 754, 'NAME': 'Tajikistan' },
  { 'ID': 755, 'NAME': 'Tanzania' },
  { 'ID': 756, 'NAME': 'Togo' },
  { 'ID': 757, 'NAME': 'Tokelau' },
  { 'ID': 758, 'NAME': 'Tonga' },
  { 'ID': 759, 'NAME': 'Trinidad and Tobago' },
  { 'ID': 760, 'NAME': 'Turks and Caicos Islands' },
  { 'ID': 761, 'NAME': 'Tuvalu' },
  { 'ID': 762, 'NAME': 'U.S. Virgin Islands' },
  { 'ID': 763, 'NAME': 'Uganda' },
  { 'ID': 764, 'NAME': 'Vanuatu' },
  { 'ID': 765, 'NAME': 'Vatican' },
  { 'ID': 766, 'NAME': 'Vietnam' },
  { 'ID': 767, 'NAME': 'Wallis and Futuna' },
  { 'ID': 768, 'NAME': 'Western Sahara' },
  { 'ID': 769, 'NAME': 'Yemen' },
  { 'ID': 770, 'NAME': 'Zambia' },
  { 'ID': 771, 'NAME': 'Zimbabwe' }
];
@Component({
  selector: 'ta-core-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountryComponent),
      multi: true
    }
  ]
})
export class CountryComponent implements OnInit {
  countryList: BehaviorSubject<any[]> = new BehaviorSubject(CountryConfig);
  filteredValues = new BehaviorSubject(null);

  @Input() color: ThemePalette = 'primary';
  @Input() notLabel = true;
  @Input() returnValue: 'ID' | 'NAME' = 'ID';
  country = new FormControl('', [CustomValidators.isValueObject(true)]);
  isDestroyed = new Subject();
  latestFilteredValue = '';

  proxyValue: any;

  constructor(
    public appService: AppService,
    public translateService: TranslateService
  ) {
    this.country.valueChanges.pipe(
      takeUntil(this.isDestroyed),
      startWith(''),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value && typeof (value) === 'object') {
        this.onChangedFn(value[this.returnValue]);
      } else {
        this._filter(value);
      }
    });
  }

  ngOnInit() {

  }

  private _filter(value: any) {
    let filterValue = null;
    if (value && typeof (value) === 'object') {
      filterValue = value.NAME.toString().toLowerCase();
    } else if (value) {
      filterValue = value.toString().toLowerCase();
    } else {
      filterValue = '';
    }

    if (value) {
      const setVal = this.countryList.getValue().filter(option =>
        option.NAME.toString().trim().toLowerCase().includes(filterValue.toString().trim()));
      this.filteredValues.next(setVal);
    } else {
      const setVal = this.countryList.getValue();
      this.filteredValues.next(setVal);
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }

  writeValue(val: any): void {
    if (typeof (val) === 'number') {
      const arr = this.filteredValues.getValue();
      const resp = arr.filter(x => x.ID === val);
      if (resp && resp.length) {
        this.country.setValue(resp[0]);
      }
    }

    if (typeof (val) === 'string') {
      const arr = this.filteredValues.getValue();
      const resp = arr.filter(x => (x.ID === val) || (x.NAME === val));
      if (resp && resp.length) {
        this.country.setValue(resp[0]);
      }
    }

    if (typeof (val) === 'object') {
      this.country.setValue(val);
    }
  }

  onChangedFn: (any) => void = () => {
    // tslint:disable-next-line:semicolon
  }

  onOptionSelected(e: MatAutocompleteSelectedEvent) {
  }

  registerOnChange(fn: any): void {
    this.onChangedFn = fn;
  }

  registerOnTouched(fn: any): void {

  }


  displayFn(option: any): string {
    return option ? option.NAME : '';
  }


  onSelectionChanged(event$) {
    this.proxyValue = event$.option.value;
  }
}
