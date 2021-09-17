import { Injectable, Inject, NgZone } from '@angular/core';
import { ApiService } from './api.service';
import { PORTAL_ENV, PortalEnvironment, PortalInjectionService } from './portal-injection.service';
import { first, delay } from 'rxjs/operators';
import { of, race, timer } from 'rxjs';
import { LocalCache } from '../helpers/local-cache';
@Injectable({ providedIn: 'root' })
export class TranslateService {
  data: any = {};
  status = false;
  reqStatus = false;
  cache: LocalCache;
  mCache: LocalCache;
  constructor(
    private api: ApiService,
    @Inject(PORTAL_ENV) public env: PortalEnvironment,
    public injService: PortalInjectionService,
    public zone: NgZone
  ) {
    this.cache = new LocalCache({
      name: 'AppLanguage',
      disable: !this.env.production,
      timeout: {
        time: 7,
        unit: 'days'
      },
      onClear: async () => {
        if (!this.status) {
          return;
        }
        await this.use(this.injService.APP_SERVICE.language.value);
      },
      onDelete: (lang: string) => {
        if (!this.status) {
          return;
        }
        if (lang === this.injService.APP_SERVICE.language.value) {
          this.use(this.injService.APP_SERVICE.language.value).then(() => { }).catch(() => { });
        }
      }
    });
  }

  async use(lang: string, {
    prefix = null,
    languageConfigNameFn = null
  }: {
    prefix?: string;
    languageConfigNameFn?: (lang: string) => string;
  } = {
      prefix: null,
      languageConfigNameFn: null
    }) {
    let tLang = lang;
    if (lang.indexOf(':') !== -1) {
      [lang, tLang] = lang.split(':');
    }
    while (this.reqStatus) {
      await timer(75).toPromise();
    }
    lang = lang.toLowerCase();
    tLang = tLang.toLowerCase();
    this.reqStatus = true;
    const configName = (languageConfigNameFn ?
      languageConfigNameFn(tLang) : `portalV4.${tLang || 'tr'}.config`),
      cacheId = String(lang).toUpperCase(),
      cacheData = await this.cache.getItem(cacheId, {
        defaultValue: {},
        merge: configName,
        callback: (d) => Object.keys(d).length > 0
      });

    return await (cacheData ? of<{}>(cacheData).toPromise() : this.api.getConfig(configName)).then(async translation => {
      this.data = prefix ? { ...this.data, ...{ [prefix]: translation || {} } } :
        { ...this.data, ...(translation || {}) };
      if (!cacheData) {
        await this.cache.setItem(cacheId, this.data, { merge: configName });
      }
      this.status = true;
      await race(
        this.zone.onStable.pipe(first(x => !!x), delay(100)),
        timer(1000)
      ).toPromise();
      this.injService.APP_SERVICE.language.next(lang);
    }).catch(error => {
      console.error(error);
      // this.data = {};
      this.status = true;
    }).finally(() => {
      this.reqStatus = false;
    });
  }

  transform(key: any, args?: Array<object> | object, staticValue?: any): any {
    if (!this.status) {
      return '';
    }
    if (Array.isArray(args)) {
      let keyValue = this.data[key];
      if (keyValue !== undefined) {
        args.forEach(item => {
          const property = Object.keys(item)[0];
          if (property) {
            const valueString = '@@' + property;
            if (keyValue.indexOf(valueString) > -1) {
              keyValue = keyValue.replace(valueString, item[property]);
            }
          }
        });
      }
      return keyValue || key;
    } else if (args && typeof args === 'object') {
      const rt = this.data[key] || staticValue || key;
      return typeof rt === 'string' ? rt.replace(/@@([a-z0-9_]+)/mgi, (match: string, p1: string, _offset: number, _string: string) => {
        const rv = p1 in args ? args[p1] : match;
        return rv === null ? '' : rv;
      }) : '';
    } else {
      return this.data[key] || staticValue || key;
    }
  }

  getKey(str: string): string {
    return this.data[str] || str;
  }
}
