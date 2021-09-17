import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isNull'
})
export class IsNullPipe implements PipeTransform {

  transform(value: any, config: { true: string, false?: string }): any {
    return value != null && value !== '' ? (config.true ? config.true.replace('@@', value) : value) : (config.false ? config.false : '');
  }

}
