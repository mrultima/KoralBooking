import { Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";

@Directive({
    selector: '[lazy-src]',
})
export class LazyImageDirective implements OnDestroy, OnChanges {

    intersectionObserver: IntersectionObserver;

    @Input('lazy-src') src: string;

    constructor(
        public elRef: ElementRef<HTMLImageElement>,
        public ngZone: NgZone
    ) {
        this.initIntersectionObserver();
    }

    initIntersectionObserver() {
        if (!('IntersectionObserver' in self)) {
            this.elRef.nativeElement.src = this.src;
            return;
        }
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        this.elRef.nativeElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
        this.intersectionObserver = new IntersectionObserver((entries, observer) => {
            if (entries.filter(x => x.isIntersecting).find(x => x.target === this.elRef.nativeElement)) {
                observer.unobserve(this.elRef.nativeElement);
                setTimeout(() => {
                    this.ngZone.run(() => {
                        this.elRef.nativeElement.src = this.src;
                    });
                }, parseInt(String(Math.random() * 150)));
            }
        }, { threshold: .25 });
        this.intersectionObserver.observe(this.elRef.nativeElement);
    }

    ngOnChanges(s: SimpleChanges) {
        if (s['src']?.currentValue) {
            this.initIntersectionObserver();
        }
    }

    ngOnDestroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
    }
}