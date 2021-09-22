import { Pipe, PipeTransform } from '@angular/core';

import * as numeral_ from 'numeral';
import { map } from 'rxjs/operators';
import { AppService } from './services/app.service';


const numeral = numeral_;

@Pipe({
  name: 'numeral'
})
export class NumeralPipe implements PipeTransform {
  numeral = numeral;

  constructor(
    private appService: AppService,
  ) {
  }

  transform(value: any, format?: string): any {
    return this.appService.language.pipe(map(value1 => {
      return this.numeral(value).format(format || '0,0.00');
    }));
  }
}
