import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppService } from './app.service';
import { TranslateService } from './translate.service';

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