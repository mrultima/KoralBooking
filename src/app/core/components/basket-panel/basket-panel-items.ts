import { BreakpointObserver } from '@angular/cdk/layout';
import { Input, OnDestroy, Directive } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Directive()
export abstract class BasketPanelItems implements OnDestroy {
  @Input() hideReservationActions = false;
  isMobile;
  basketItemCount;
  isDestroyed = new Subject();
  basket;

  protected constructor(
    breakpointObserver: BreakpointObserver,
    public moment,
    public numeral,
    public basketService
  ) {
    breakpointObserver.observe('(max-width: 959px)').subscribe(value => {
        this.isMobile = value.matches;
      }
    );

    this.basketService.basket$.pipe(takeUntil<any>(this.isDestroyed)).subscribe(val => {
      if (val) {
        this.basketItemCount = (val.Items.HotelItems ? val.Items.HotelItems.length : 0);
      }
    });

    this.basketService.basket$.pipe(takeUntil<any>(this.isDestroyed)).subscribe(value => this.basket = value);
  }

  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete();
  }
}
