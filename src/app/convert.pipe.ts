import {Pipe, PipeTransform} from '@angular/core';
import {AppService} from '../services/app.service';
import {switchMap} from 'rxjs/operators';
import * as numeral_ from 'numeral'; const numeral = numeral_;


// html template içinden currency cinsinden fiyat döndürür
// {{value|convert|async}}
@Pipe({
  name: 'convert'
})
export class ConvertPipe implements PipeTransform {
  constructor(private appService: AppService) {
  }

  transform(value: any) {
    return this.appService.currency.pipe(switchMap(async value1 => {
      return numeral(this.appService.convert(numeral(value).value())).format('0,0.00');
    }));
  }
}
