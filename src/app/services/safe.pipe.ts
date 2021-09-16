import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value, type = 'html') {
    switch (type) {
      default: return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'resourceurl': return this.sanitizer.bypassSecurityTrustResourceUrl(value)
    }

  }
}
