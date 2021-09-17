import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'intersection-observer',
  templateUrl: './intersection-observer.component.html',
  styleUrls: ['./intersection-observer.component.scss']
})
export class IntersectionObserverComponent implements OnInit, OnDestroy {

  private intersectionObserver: IntersectionObserver;

  readonly observe$ = new BehaviorSubject<boolean>(false);

  @Input() data: any = null;

  @Input() oneTime = true;

  @Input() threshold = .25;

  @Input() target: ElementRef | Element

  @Output() observe = new EventEmitter<any>();

  constructor(
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    if (!('IntersectionObserver' in self)) {
      this.observe$.next(true);
      this.observe.emit();
      return;
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    const target = this.target ? this.target instanceof ElementRef ? this.target?.nativeElement : this.target : this.elRef.nativeElement;
    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      if (entries.filter(x => x.isIntersecting).find(x => x.target === target)) {
        if (this.oneTime) {
          observer.unobserve(target);
        }
        this.observe$.next(true);
        this.observe.emit(this.data);
      }
    }, { threshold: this.threshold });
    this.intersectionObserver.observe(target);
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

}
