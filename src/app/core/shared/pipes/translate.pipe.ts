import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';
import { AppService } from '../services/app.service';
import { map } from 'rxjs/operators';

// çevici dosyalarından key - value pairs okurken kullanılır
// <element>{{ 'KEY' | translate | async }}</element>
// <element title="{{ 'KEY' | translate | async }}"></element>
// <element [title]="property | translate | async"></element>
// {{'LOGIN_CONTAINER_TAB1' | translate :[{title:'loginTab'},{type:'tabItem'}] | async}} değişken göndermek için
// "LOGIN_CONTAINER_TAB1" : "Giriş @@title @@type", lang.json içinde ki tanım


@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService, private appService: AppService) {
  }

  transform(key: any, args?: Array<object> | string): any {
    return this.appService.language.pipe(map(value => {
      if (typeof args === 'string') {
        return this.translate.transform(key, undefined, args);
      }
      return this.translate.transform(key, args);
    }));
  }
}
