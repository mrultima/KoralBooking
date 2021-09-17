import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {AppService} from '../services/app.service';

export interface ScrollDirectiveConfig {
  // can be - or +. - for top , + for below
  offsetAfterScroll?: number;
}

@Directive({
  selector: '[taCoreScroll]'
})
export class ScrollDirective implements OnInit {
  @Input() taCoreScrollisActive = true;
  @Input() taCoreScrollConfig: ScrollDirectiveConfig;
  constructor(
    private elementRef: ElementRef,
    private appService: AppService,
  ) {
  }
  @HostListener('click', ['$event.target']) onClick(target: any) {
    if (this.taCoreScrollisActive) {
      const rect = (this.elementRef.nativeElement as HTMLElement).getBoundingClientRect();
      const headerHeight = document.querySelector('.header-position-fixed').getBoundingClientRect().height;

      let doc = document.documentElement;
      let top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

      // const coordinateToScroll = rect.top + pageYOffset + (-headerHeight);
      const coordinateToScroll = rect.top + pageYOffset;
      let offset = 0;

      if (this.taCoreScrollConfig && this.taCoreScrollConfig.hasOwnProperty('offsetAfterScroll')) {
        offset = this.taCoreScrollConfig.offsetAfterScroll;
      }

      if (top === (coordinateToScroll + offset)) {
        return;
      }

      window.scrollTo({behavior: 'smooth', top: coordinateToScroll, left: 0});
      if (this.taCoreScrollConfig && this.taCoreScrollConfig.hasOwnProperty('offsetAfterScroll')) {
        this.appService.scrollWhenScrollFinished(this.taCoreScrollConfig.offsetAfterScroll);
      }
    }
  }

  ngOnInit(): void {
  }
}
