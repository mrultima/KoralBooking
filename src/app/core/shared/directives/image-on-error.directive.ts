import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[taCoreImageOnError]'
})
export class ImageOnErrorDirective {

  constructor(private renderer: Renderer2, private e: ElementRef) {

  }

  @Input() set taCoreImageOnError(mode: string) {
    if (mode === 'Hotel') {
      // tslint:disable-next-line:max-line-length
      this.renderer.setAttribute(this.e.nativeElement, 'onerror', 'this.src="https://erspublic.blob.core.windows.net/test/1721248f-f039-5867-86fc-2e5b0a257000.jpg"');
    } else if (mode) {
      this.renderer.setAttribute(this.e.nativeElement, 'onerror', `this.src="${mode}"`);
    }
  }
}
