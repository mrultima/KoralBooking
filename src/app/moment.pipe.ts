import { Pipe, PipeTransform } from '@angular/core';


import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { AppService } from './services/app.service';



@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  constructor(
    private appService: AppService,
  ) {
  }

  moment = moment;

  transform(value: any, format: string): any {
    return this.appService.language.pipe(map(value1 => {
      return value ? this.moment(value).format(format) : '';
    }));
  }
}
