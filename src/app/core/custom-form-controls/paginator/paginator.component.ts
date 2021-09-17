import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {BehaviorSubject} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'ta-core-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  _maxSize = 5;
  @Input() maxSize = 5;
  @Input() itemsPerPage = 15;

  _totalItems;
  @Input() set totalItems(totalItems) {
    this._totalItems = totalItems;
    this.pages.next(this.getPages(1, this.itemsPerPage, this.totalItems));
    this.setCurrentPage(1);
  }

  get totalItems() {
    return this._totalItems;
  }

  @Input() set pageEvent(pageEvent: PageEvent) {
    if (pageEvent) {
      this.itemsPerPage = pageEvent.pageSize;
      this.pages.next(this.getPages(pageEvent.pageIndex + 1, this.itemsPerPage, this.totalItems));
      this.setCurrentPage(pageEvent.pageIndex + 1);
    }
  }

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>(true);

  currentPage: number;
  lastPage: number;
  pages: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

  constructor(breakpointObserver: BreakpointObserver) {
    this.pageChange.subscribe(value => {
      this.pages.next(this.getPages(value, this.itemsPerPage, this.totalItems));
    });

    breakpointObserver.observe('(max-width: 599.99px)').subscribe(value => {
        this.maxSize = value.matches ? 3 : this._maxSize;
        this.pages.next(this.getPages(this.currentPage, this.itemsPerPage, this.totalItems));
      }
    );
  }

  ngOnInit() {
    this.setCurrentPage(1);
    this._maxSize = this.maxSize;
  }

  setCurrentPage(page: number): void {
    if (page && this.currentPage !== page) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
    return;
  }

  getPages(currentPage: number, itemsPerPage: number, totalItems: number): any {
    const pages: any = [];

    // Default page limits
    const totalPages: number = this.lastPage = Math.ceil(totalItems / itemsPerPage);

    let startPage = 1;
    let endPage: number = totalPages;
    const isMaxSized: boolean = this.maxSize && this.maxSize < totalPages;

    // recompute if maxSize
    if (isMaxSized) {

      // current page is displayed in the middle of the visible ones
      startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
      endPage = startPage + this.maxSize - 1;

      // Adjust if limit is exceeded
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - this.maxSize + 1;
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      pages.push(number);
    }

    return pages;
  }
}
