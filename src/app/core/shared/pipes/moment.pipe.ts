import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';


import * as moment from 'moment';
import { AppService } from '../services/app.service';
import { map, switchMap } from 'rxjs/operators';



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
