import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { AppService, SortingModel } from '../../shared';

@Component({
  selector: 'ta-core-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
export class SortingComponent implements OnInit {
  sortedItem: SortingModel;

  @Input() sortingConfig: SortingModel[];

  @Input() multiple = false;

  @Input() mode: 'Flight' | 'Transfer' = 'Flight';

  @Input() showSortingLabel: 'show' | 'hide' = 'show';

  @Output() sortedData = new BehaviorSubject(null);

  sortValues = {};

  isMobile = false;

  private sortedLastData;

  constructor(public breakpointObserver: BreakpointObserver, private  appService: AppService) {
    breakpointObserver.observe('(max-width: 959px)').subscribe(value => {
        this.isMobile = value.matches;
      }
    );
  }

  private _disabled = false;

  get disabled() {
    return this._disabled;
  }

  @Input() set disabled(disabled: boolean | number) {
    this._disabled = !!disabled;
  }

  @Input() set triggerSorting(triggerSorting: SortingModel) {
    if (triggerSorting && this.data) {
      this.sortByList(triggerSorting);
    }
  }

  private _data;

  get data() {
    return this._data;
  }

  @Input() set data(data: Array<any>) {
    if (data) {
      this._data = data;
      if (this.sortedLastData !== data) {
        this.sortedLastData = data;
      }
    }
  }

  ngOnInit() {
  }

  sortByMultipleList(el: SortingModel) {
    if (!this.data) {
      return;
    }

    const ccc = this.data.map(x => {
      if (this.mode === 'Flight') {
        x.flightOptionList = this.sort(el, x.flightOptionList);
      } else if (this.mode === 'Transfer') {
        x.transferOptionList = this.sort(el, x.transferOptionList);
      }
      return x;
    });

    if (el.ascSort) {
      this.sortedItem.sortIcon = this.sortedItem.ascIcon;
      this.sortedItem.ascSort = false;
      this.sortedItem.decsSort = true;
    } else {
      this.sortedItem.sortIcon = this.sortedItem.descIcon;
      this.sortedItem.ascSort = true;
      this.sortedItem.decsSort = false;
    }

    this.sortedData.next(ccc);
  }

  sortByList(el: SortingModel) {
    if (this.multiple) {
      this.sortByMultipleList(el);
      return;
    } else {
      this.sortedData.next(this.sort(el, this.data));
    }
  }

  sort(el: SortingModel, list: Array<any>) {
    if (el != null) {
      this.sortedItem = el;
      this.sortingConfig.forEach(val => {
        if (val) {
          val.sortIcon = '';
        }
      });

      let goodSide = [];
      let badSide = [];

      list.map(x => {
        if (x[this.sortedItem.fieldName]) {
          goodSide.push(x);
          return x;
        } else {
          x[this.sortedItem.fieldName] = null;
          badSide.push(x);
        }
        return x;
      });

      let data: Array<any>;

      if (!goodSide.length) {
        goodSide = [...badSide];
        badSide = [];
      }

      const sample = _.get(goodSide[0], this.sortedItem.fieldName);

      if (!isNaN(Number(sample))) {
        data = goodSide.sort((a, b) => _.get(a, this.sortedItem.fieldName) - _.get(b, this.sortedItem.fieldName));
      } else {
        data = goodSide.sort((first, second) => {
          return new Intl.Collator(this.appService.language.getValue()).compare(_.get(first, this.sortedItem.fieldName),
            _.get(second, this.sortedItem.fieldName));
        });
      }

      if (this.sortedItem.ascSort) {
        if (!this.multiple) {
          this.sortedItem.sortIcon = this.sortedItem.ascIcon;
          this.sortedItem.ascSort = false;
          this.sortedItem.decsSort = true;
        }
      } else {
        data = data.reverse();
        if (!this.multiple) {
          this.sortedItem.sortIcon = this.sortedItem.descIcon;
          this.sortedItem.ascSort = true;
          this.sortedItem.decsSort = false;
        }
      }

      return data.concat(badSide);
    }
  }
}
