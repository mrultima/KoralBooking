import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService, AppService } from '../../shared';

@Component({
  selector: 'ta-core-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent extends MatPaginatorIntl implements OnInit {
  @ViewChild('paginator', {static: true}) paginator: MatPaginator;
  private _list: Array<any>;
  @Input() set list(list) {
    this._list = list;
    this.resendInitialList();
  }

  get list() {
    return this._list;
  }

  @Input() pageSizeOptions: Array<number> = [15, 25, 50, 100];
  @Input() pageSize = 15;

  lastPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: this.pageSize,
    length: this.list ? this.list.length : 0,
    previousPageIndex: 0
  };


  @Input() set setPage(setPage) {
    if (setPage && this.paginator && this.lastPageEvent) {
      this.paginator.pageIndex = setPage - 1;
      this.lastPageEvent.pageIndex = setPage - 1;
      this.onPage(this.lastPageEvent);
    }
  }

  @Output() partialList = new EventEmitter();
  @Output() pageEvent = new EventEmitter<PageEvent>();

  constructor(public translate: TranslateService, public appService: AppService) {
    super();
    this.itemsPerPageLabel = this.translate.getKey('LBL_ITEMS_PER_PAGE');
    this.nextPageLabel = this.translate.getKey('LBL_NEXT_PAGE');
    this.previousPageLabel = this.translate.getKey('LBL_PREVIOUS_PAGE');
    this.firstPageLabel = this.translate.getKey('LBL_FIRST_PAGE');
    this.lastPageLabel = this.translate.getKey('LBL_LAST_PAGE');
    this.getRangeLabel = this.paginatorRangeLabel.bind(this);

    this.appService.language.subscribe(async value => {
      this.itemsPerPageLabel = this.translate.getKey('LBL_ITEMS_PER_PAGE');
      this.nextPageLabel = this.translate.getKey('LBL_NEXT_PAGE');
      this.previousPageLabel = this.translate.getKey('LBL_PREVIOUS_PAGE');
      this.firstPageLabel = this.translate.getKey('LBL_FIRST_PAGE');
      this.lastPageLabel = this.translate.getKey('LBL_LAST_PAGE');
    });
  }

  ngOnInit() {
  }

  private paginatorRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return this.translate.transform('PAGINATION_RANGE_PAGE_LABEL1', [{length: length}]);
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translate.transform('PAGINATION_RANGE_PAGE_LABEL2', [{startIndex: startIndex + 1}, {endIndex: endIndex}, {length: length}]);
  }

  resendInitialList() {
    this.paginator.firstPage();
    this.partialList.emit(this.list.slice(0, this.pageSize));
  }

  onPage(e: PageEvent) {
    this.pageEvent.emit(e);
    this.lastPageEvent = e;
    this.partialList.emit(this.list.slice(e.pageIndex * e.pageSize, (e.pageIndex + 1) * e.pageSize));
  }
}
