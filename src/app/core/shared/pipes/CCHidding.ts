import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'CCHidding'
  })
  export class CCHiddingPipe implements PipeTransform {
    constructor() {
    }

    transform(value: any) {
        const replaceValue = value;
        let retValue = '';
        if (replaceValue && replaceValue.length > 4) {
            const b = 4;
            const a = replaceValue.length - b;
            const subValue = replaceValue.substr(a, b);
            for (let i = 0; i < a; i++) {
                retValue += '*';
            }
            retValue = retValue + subValue;
        }
      return retValue;
    }
  }