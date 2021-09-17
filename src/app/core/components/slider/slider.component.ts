import { Component, OnDestroy, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PortalService, HomePageService, SliderItems } from '../../shared';

@Component({
  selector: 'ta-core-slider',
  templateUrl: './slider.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./slider.component.scss', '../../src/lib/bootstrap/css/bootstrap.min.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 6000, noPause: true, showIndicators: true } }
  ]
})
export class SliderComponent implements OnInit, OnDestroy {
  slides: SliderItems[] = [];
  noWrapSlides = false;
  activeSlideIndex = 0;
  isMobile = false;
  isDestroyed = false;
  searchBoxPosition = 0;
  sliderHeight = '600px';
  @Input() sliderImages: string[] = [];

  constructor(public portalService: PortalService, public homePageService: HomePageService,
    breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe('(max-width: 959px)').subscribe(value => {
      this.isMobile = value.matches;
    });

    this.portalService.portalConfig$.subscribe(portalConfig => {
      if (!portalConfig) {
        return;
      }
      this.searchBoxPosition = portalConfig.SEARCHBOXPOSITION || 0;
      if (this.searchBoxPosition === 4 && this.isMobile === false) {
        this.sliderHeight = '500px';
      } else if ((this.searchBoxPosition === 5 || this.searchBoxPosition === 6) && this.isMobile === false) {
        this.sliderHeight = '350px';
      }
    });
  }

  ngOnInit() {
    this.slides = this.sliderImages.reduce((acc, v) => {
      acc.push({
        Url: v
          || 'https://erspublic.blob.core.windows.net/test/16cb33de-75c9-9659-8428-69e015de8000.jpg',
        Title: '',
        Active: true,
        Content: '',
        RouterLink: '',
      });
      return acc;
    }, []);
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }
}
