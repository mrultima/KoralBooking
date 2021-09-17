import { registerLocaleData } from '@angular/common';

export function localeInitializer(localeId: string): Promise<any> {
  return import(
    /* webpackInclude: /(tr|en|de|ru|ar|az|fr|nl|ro)\.js$/ */
    `@angular/common/locales/${localeId}.js`
    ).then(module => registerLocaleData(module.default));
}
