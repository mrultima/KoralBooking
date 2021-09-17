import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(textStr) {
    return _.capitalize(textStr);
  }
}
