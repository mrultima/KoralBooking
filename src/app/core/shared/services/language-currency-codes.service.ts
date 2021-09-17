import { Injectable } from '@angular/core';
import * as _ from 'lodash';

export interface Language {
  langKey: string;
  langFlag: string;
  langLong: string;
}

export interface Currency {
  curCode: string;
  curIcon: string;
}


@Injectable()
export class LanguageCurrencyCodes {

  languages: Language[] = [
    { langKey: 'tr', langFlag: 'assets/images/flags/TR.png', langLong: 'Türkçe' },
    { langKey: 'en', langFlag: 'assets/images/flags/EN.png', langLong: 'English' },
    { langKey: 'de', langFlag: 'assets/images/flags/DE.png', langLong: 'Deutsch' },
    { langKey: 'ru', langFlag: 'assets/images/flags/RU.png', langLong: 'Pусский' },
    { langKey: 'ar', langFlag: 'assets/images/flags/AR.png', langLong: 'العربية' },
    { langKey: 'az', langFlag: 'assets/images/flags/AZ.png', langLong: 'Azərbaycan Dili' },
    { langKey: 'fr', langFlag: 'assets/images/flags/FR.png', langLong: 'Français' },
    { langKey: 'nl', langFlag: 'assets/images/flags/NL.png', langLong: 'Dutch' },
    { langKey: 'ro', langFlag: 'assets/images/flags/RO.png', langLong: 'Română' }
  ];

  currencies: Currency[] = [
    { curCode: 'TRY', curIcon: 'TL' },
    { curCode: 'GBP', curIcon: 'GBP' },
    { curCode: 'EUR', curIcon: 'EUR' },
    { curCode: 'USD', curIcon: 'USD' },
    { curCode: 'RUB', curIcon: 'RUB' },
    { curCode: 'BYN', curIcon: 'BYN' },
    { curCode: 'AZN', curIcon: 'AZN' },
    { curCode: 'MKD', curIcon: 'MKD' },
    { curCode: 'LYD', curIcon: 'LYD' },
    { curCode: 'IRR', curIcon: 'IRR' },
    { curCode: 'AUD', curIcon: 'AUD' },
    { curCode: 'DKK', curIcon: 'DKK' },
    { curCode: 'CHF', curIcon: 'CHF' },
    { curCode: 'SEK', curIcon: 'SEK' },
    { curCode: 'CAD', curIcon: 'CAD' },
    { curCode: 'KWD', curIcon: 'KWD' },
    { curCode: 'NOK', curIcon: 'NOK' },
    { curCode: 'SAR', curIcon: 'SAR' },
    { curCode: 'JPY', curIcon: 'JPY' },
    { curCode: 'BGN', curIcon: 'BGN' },
    { curCode: 'RON', curIcon: 'RON' },
    { curCode: 'RUB', curIcon: 'RUB' },
    { curCode: 'CNY', curIcon: 'CNY' },
    { curCode: 'PKR', curIcon: 'PKR' },
    { curCode: 'QAR', curIcon: 'QAR' },
    { curCode: 'MAD', curIcon: 'MAD' }
  ];

  getLangConfigs(langs?: Array<string>): Array<Language> | undefined {
    if (langs && langs.length > 0) {
      const conf: Language[] = [];
      const distinctLangs = _.uniqBy(langs, x => x);
      const distinctLowerKeyLangs = distinctLangs.map(value => value.toLowerCase());
      for (const lang of distinctLowerKeyLangs) {
        const result = this.languages.find(x => x.langKey === lang);
        if (result) {
          conf.push(result);
        }
      }
      if (conf.length > 0) {
        return conf;
      }
      return this.languages;
    }
    return this.languages;
  }

  getCurrConfigs(currs?: Array<string>) {
    if (currs && currs.length > 0) {
      const conf: Currency[] = [];
      const distinctCurrs = _.uniqBy(currs, x => x);
      for (const lang of distinctCurrs) {
        const result = this.currencies.find(x => x.curCode === lang);
        if (result) {
          conf.push(result);
        }
      }
      if (conf.length > 0) {
        return conf;
      }
      return this.currencies;
    }
    return this.currencies;
  }
}
