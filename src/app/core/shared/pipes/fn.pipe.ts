import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fn'
})
export class FnPipe implements PipeTransform {

    transform(value: any, fn: Function | string): any {
        return typeof fn === 'function' ? fn() : fn;
    }

}
