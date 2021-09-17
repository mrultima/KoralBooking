import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '../../shared';
import { merge } from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Filter, FilterTypeOption, FilterTypeSearch, FilterTypeSlider, FilterTypeSlideToggle } from './filter';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent<T = any> implements OnInit {

  @ViewChild('FilterTypeOptionTpl', { read: TemplateRef, static: true })
  filterTypeOptionTpl: TemplateRef<FilterTypeOption>;

  @ViewChild('FilterTypeSearchTpl', { read: TemplateRef, static: true })
  filterTypeSearchTpl: TemplateRef<FilterTypeSearch>;

  @ViewChild('FilterTypeSlideToggleTpl', { read: TemplateRef, static: true })
  filterTypeSlideToggleTpl: TemplateRef<FilterTypeSlideToggle>;

  @ViewChild('FilterTypeSliderTpl', { read: TemplateRef, static: true })
  filterTypeSliderTpl: TemplateRef<FilterTypeSlider>;

  isDestroy$ = new Subject();

  @Input() data: T[];

  @Input() autoFilter = false;

  @Input() resetButton = false;

  @Output() filteredList = new EventEmitter<T[]>();

  data$ = new BehaviorSubject<T[]>([]);

  @Input() filter: Filter<T>;

  initFilter$ = new Subject();

  constructor(
    public ngZone: NgZone,
    public translateService: TranslateService,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  apply(): void {
    if (!this.filter) {
      return;
    }
    this.filteredList.emit(
      this.filter.apply()
    );
  }

  private initFilterEvents(): void {

    this.initFilter$.next();
    this.filter.changed.pipe(
      takeUntil(merge(this.isDestroy$, this.initFilter$))
    ).subscribe({
      next: () => {
        if (this.autoFilter) {
          this.apply();
        }
        this.cdr.detectChanges();
      }
    });

    this.data$.pipe(
      takeUntil(merge(this.isDestroy$, this.initFilter$))
    ).subscribe({
      next: data => {
        this.filter.setData(data);
        if (!this.autoFilter) {
          this.apply();
        }
        this.cdr.detectChanges();
      }
    });
  }

  ngOnChanges(c: SimpleChanges): void {
    if (c?.filter) {
      /* if (this.filter) {
        this.filter.destroy();
        this.filter = null;
      } */
      if (c.filter.currentValue instanceof Filter) {
        c.filter.currentValue.getAllFilterType().forEach(x => {
          if (!x.template) {
            if (x instanceof FilterTypeOption) {
              x.setTemplate(this.filterTypeOptionTpl)
            } else if (x instanceof FilterTypeSearch) {
              x.setTemplate(this.filterTypeSearchTpl);
            } else if (x instanceof FilterTypeSlideToggle) {
              x.setTemplate(this.filterTypeSlideToggleTpl)
            } else if (x instanceof FilterTypeSlider) {
              x.setTemplate(this.filterTypeSliderTpl);
            }
          }
        });
        this.filter = c.filter.currentValue;
        this.initFilterEvents();
      }
    }
    if (c?.data && Array.isArray(c.data.currentValue)) {
      this.data$.next(c.data.currentValue);
    }
  }

  ngOnDestroy(): void {
    this.isDestroy$.next();
    this.isDestroy$.complete();
  }

  reset(): void {
    this.filter.reset();
    this.apply();
  }
}
