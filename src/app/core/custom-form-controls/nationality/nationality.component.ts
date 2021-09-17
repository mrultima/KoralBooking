import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AppService, TranslateService } from '../../shared';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';
import * as _ from 'lodash';

@Component({
  selector: 'ta-core-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NationalityComponent),
      multi: true
    }
  ]
})
export class NationalityComponent implements OnInit, OnDestroy, ControlValueAccessor {
  nationalityValues = [
    { key: 'TR', value: 'LNG_TR' },
    { key: 'US', value: 'LNG_US' },
    { key: 'CZ', value: 'LNG_CZ' },
    { key: 'HU', value: 'LNG_HU' },
    { key: 'AT', value: 'LNG_AT' },
    { key: 'CH', value: 'LNG_CH' },
    { key: 'PL', value: 'LNG_PL' },
    { key: 'RO', value: 'LNG_RO' },
    { key: 'RU', value: 'LNG_RU' },
    { key: 'NL', value: 'LNG_NL' },
    { key: 'ES', value: 'LNG_ES' },
    { key: 'FR', value: 'LNG_FR' },
    { key: 'IT', value: 'LNG_IT' },
    { key: 'TN', value: 'LNG_TN' },
    { key: 'MA', value: 'LNG_MA' },
    { key: 'EG', value: 'LNG_EG' },
    { key: 'AU', value: 'LNG_AU' },
    { key: 'PR', value: 'LNG_PR' },
    { key: 'CL', value: 'LNG_CL' },
    { key: 'AR', value: 'LNG_AR' },
    { key: 'BR', value: 'LNG_BR' },
    { key: 'DK', value: 'LNG_DK' },
    { key: 'AE', value: 'LNG_AE' },
    { key: 'LB', value: 'LNG_LB' },
    { key: 'SI', value: 'LNG_SI' },
    { key: 'GB', value: 'LNG_GB' },
    { key: 'BA', value: 'LNG_BA' },
    { key: 'GR', value: 'LNG_GR' },
    { key: 'CA', value: 'LNG_CA' },
    { key: 'DE', value: 'LNG_DE' },
    { key: 'VN', value: 'LNG_VN' },
    { key: 'NP', value: 'LNG_NP' },
    { key: 'JP', value: 'LNG_JP' },
    { key: 'CN', value: 'LNG_CN' },
    { key: 'BE', value: 'LNG_BE' },
    { key: 'SE', value: 'LNG_SE' },
    { key: 'MC', value: 'LNG_MC' },
    { key: 'MT', value: 'LNG_MT' },
    { key: 'PT', value: 'LNG_PT' },
    { key: 'SC', value: 'LNG_SC' },
    { key: 'CU', value: 'LNG_CU' },
    { key: 'ZA', value: 'LNG_ZA' },
    { key: 'MV', value: 'LNG_MV' },
    { key: 'MU', value: 'LNG_MU' },
    { key: 'KE', value: 'LNG_KE' },
    { key: 'MY', value: 'LNG_MY' },
    { key: 'BG', value: 'LNG_BG' },
    { key: 'ID', value: 'LNG_ID' },
    { key: 'IN', value: 'LNG_IN' },
    { key: 'LV', value: 'LNG_LV' },
    { key: 'UA', value: 'LNG_UA' },
    { key: 'DZ', value: 'LNG_DZ' },
    { key: 'UZ', value: 'LNG_UZ' },
    { key: 'HR', value: 'LNG_HR' },
    { key: 'MK', value: 'LNG_MK' },
    { key: 'SY', value: 'LNG_SY' },
    { key: 'JO', value: 'LNG_JO' },
    { key: 'EC', value: 'LNG_EC' },
    { key: 'ET', value: 'LNG_ET' },
    { key: 'TH', value: 'LNG_TH' },
    { key: 'SG', value: 'LNG_SG' },
    { key: 'IL', value: 'LNG_IL' },
    { key: 'BO', value: 'LNG_BO' },
    { key: 'CO', value: 'LNG_CO' },
    { key: 'PY', value: 'LNG_PY' },
    { key: 'UY', value: 'LNG_UY' },
    { key: 'PE', value: 'LNG_PE' },
    { key: 'VE', value: 'LNG_VE' },
    { key: 'NZ', value: 'LNG_NZ' },
    { key: 'MX', value: 'LNG_MX' },
    { key: 'NO', value: 'LNG_NO' },
    { key: 'JM', value: 'LNG_JM' },
    { key: 'FI', value: 'LNG_FI' },
    { key: 'LK', value: 'LNG_LK' },
    { key: 'BS', value: 'LNG_BS' },
    { key: 'EE', value: 'LNG_EE' },
    { key: 'NI', value: 'LNG_NI' },
    { key: 'CY', value: 'LNG_CY' },
    { key: 'KR', value: 'LNG_KR' },
    { key: 'HT', value: 'LNG_HT' },
    { key: 'IE', value: 'LNG_IE' },
    { key: 'IS', value: 'LNG_IS' },
    { key: 'CR', value: 'LNG_CR' },
    { key: 'TW', value: 'LNG_TW' },
    { key: 'LV', value: 'LNG_LV' },
    { key: 'LU', value: 'LNG_LU' },
    { key: 'AZ', value: 'LNG_AZ' },
    { key: 'RS', value: 'LNG_RS' },
    { key: 'AL', value: 'LNG_AL' },
    { key: 'SA', value: 'LNG_SA' },
    { key: 'DO', value: 'LNG_DO' },
    { key: 'PH', value: 'LNG_PH' },
    { key: 'KG', value: 'LNG_KG' },
    { key: 'KZ', value: 'LNG_KZ' },
    { key: 'PA', value: 'LNG_PA' },
    { key: 'PK', value: 'LNG_PK' },
    { key: 'NA', value: 'LNG_NA' },
    { key: 'SN', value: 'LNG_SN' },
    { key: 'IR', value: 'LNG_IR' },
    { key: 'ER', value: 'LNG_ER' },
    { key: 'GE', value: 'LNG_GE' },
    { key: 'MD', value: 'LNG_MD' },
    { key: 'IQ', value: 'LNG_IQ' },
    { key: 'AM', value: 'LNG_AM' },
    { key: 'TJ', value: 'LNG_TJ' },
    { key: 'CW', value: 'LNG_CW' },
    { key: 'LT', value: 'LNG_LT' },
  ];
  translatedValues = new BehaviorSubject(null);
  filteredValues = new BehaviorSubject(null);

	@Input() color: ThemePalette = 'primary';
	@Input() required: Boolean = false;
	nationality = new FormControl('');

  isDestroyed = new Subject();
  latestFilteredValue = '';

  constructor(
    public appService: AppService,
    public translateService: TranslateService
  ) {
    this.appService.language.pipe(takeUntil(this.isDestroyed)).subscribe(() => {
      const arr = this.nationalityValues.map(x => {
        return { key: x.key, value: this.translateService.data[x.value] || x.value };
      });
      const sortedArr = _.sortBy(arr, 'value');
      this.translatedValues.next(sortedArr);
      this.filter(this.latestFilteredValue);
    });
  }

  ngOnInit() {

		if (this.required) {
			this.nationality.setValidators(Validators.required)
		}

    this.nationality.valueChanges.pipe(
      takeUntil(this.isDestroyed),
      startWith('')
    ).subscribe(value => {

      if (typeof (value) === 'object') {
        this.onChange(value.key);
      } else {
        this.filter(value.toString());
      }
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }

  writeValue(val: any): void {
    if (typeof (val) === 'object') {
      this.nationality.setValue(val);
    }

    if (typeof (val) === 'string') {
      const arr = this.filteredValues.getValue();
      const resp = arr.filter(x => x.key === val);
      if (resp && resp.length) {
        this.nationality.setValue(resp[0]);
      }
    }
  }

  public onChange(fn: any) {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  displayFn(option?: any) {
    return option ? option.value : '';
  }

  filter(value: string) {
    this.latestFilteredValue = value;
    const filteredData = [];
    for (const q of this.translatedValues.getValue()) {
      if (q['value'].toString().trim().toLowerCase().startsWith(value.toString().trim().toLowerCase())) {
        filteredData.push(q);
      }
    }

    this.filteredValues.next(filteredData);
  }
}
