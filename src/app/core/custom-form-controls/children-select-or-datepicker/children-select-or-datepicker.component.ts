import { AfterViewInit, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import * as moment from 'moment';


import { Overlay } from '@angular/cdk/overlay';
import { BehaviorSubject, Subscription } from 'rxjs';
import { skip, startWith } from 'rxjs/operators';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { DialogService, AppService, TranslateService } from '../../shared';


const ChildrenSelectorDatepickerProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ChildrenSelectOrDatepickerComponent),
  multi: true
};

@Component({
  selector: 'ta-core-children-select-or-datepicker',
  templateUrl: './children-select-or-datepicker.component.html',
  styleUrls: ['./children-select-or-datepicker.component.scss'],
  providers: [ChildrenSelectorDatepickerProvider]
})
export class ChildrenSelectOrDatepickerComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnDestroy {
  @Input() label: string;
  @Input() mode: 'select' | 'datepicker';
  @Input() maxChildAge = 6;
  @Input() maxChild = 6;
  @Input() checkIn: string;
  @Input() appearance: MatFormFieldAppearance;
  @Input() isPanel = true;
  @Input() minChildAge = 0;
  @ViewChild('mainElement') target;
  @ViewChild('panel') panel: ElementRef;
  @ViewChild('portalContent') portalContent;

  panelWidth$ = new BehaviorSubject('300px');

  childCountFC = new FormControl();

  formGroup: FormGroup;

  private childCount;
  isPanelOpen = new BehaviorSubject<boolean>(false);

  ref: Subscription;
  ref2: Subscription;
  ref3: Subscription;
  ref4: Subscription;

  hints = new BehaviorSubject([]);

  constructor(
    private formBuilder: FormBuilder,
    private overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private dialogService: DialogService,
    public appService: AppService,
    public translateService: TranslateService,
  ) {

    this.formGroup = new FormGroup({children: new FormArray([])});
    this.ref2 = this.isPanelOpen.pipe(skip(1)).subscribe(value => {
      if (this.mode === 'select') {
        return;
      }

      setTimeout(() => {
        if (value) {
          this.ref = this.formGroup.valueChanges.pipe(startWith(this.formGroup.value as Object)).subscribe(value1 => {
            this.hints.next(this.findChildAgeFromDate(value1.children).map(x => x || ''));
          });
        } else {
          if (this.ref) {
            this.ref.unsubscribe();
            this.hints.next([]);
          }
        }
      }, 0);

    });
  }

  arrowfilter = (d: Date): boolean => {
    return (moment(d).startOf('day').diff(moment().startOf('day')) < 0)
      && (Math.abs(moment(d).startOf('day').diff(moment().startOf('day'), 'years')) < this.maxChildAge);
    // tslint:disable-next-line:semicolon
  };

  toFormArray(limit: number) {
    const array = [];
    for (let i = 0; i < limit; i++) {
      array.push(new FormControl('', Validators.required));
    }
    return new FormGroup({children: this.formBuilder.array(array)});
  }

  ngOnInit() {
    if (!this.isPanel) {
      this.ref3 = this.childCountFC.valueChanges.subscribe(value => {
        setTimeout(() => {
          this.onBackdropClick();
        }, 0);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.unsubscribe();
    }
    if (this.ref2) {
      this.ref2.unsubscribe();
    }
    if (this.ref3) {
      this.ref3.unsubscribe();
    }
    if (this.ref4) {
      this.ref4.unsubscribe();
    }
  }

  public onChangeFn(fn: any) {
  }

  public onTouchedFn() {
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
    // this.childCountFC.valueChanges.pipe(distinctUntilChanged()).subscribe(value => fn(value));
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.childCountFC.disable() : this.childCountFC.enable();
  }

  writeValue(obj: string): void {
    if (obj) {
      let childAges: Array<string>;
      childAges = Array.isArray(obj) ? obj : obj.split(' ');
      childAges = childAges.map(value => '' + value);
      this.childCountFC.setValue(childAges.length);
      this.formGroup.setControl('children', this.formBuilder.array(childAges || []));
      this.onBackdropClick();
    } else {
      this.childCountFC.setValue(0);
    }
  }

  createMockArray(num: number) {
      return Array(num);
  }

  createArrayRange(num: number) {
    let list = [];
    for (var i = this.minChildAge; i <= num-1; i++) {
        list.push(i);
    }
    return list;
}

  ngAfterViewInit(): void {
    this.ref4 = this.childCountFC.valueChanges.subscribe(value => {
      if (value) {

        if (this.isPanel) {
          this.isPanelOpen.next(true);
        }

        const childCount = (this.formGroup.get('children') as FormArray).controls.length;

        // if (this.childCount) {
        if (childCount - value > 0) {
          for (let i = 0; i < childCount - value; i++) {
            (this.formGroup.get('children') as FormArray).removeAt(childCount - i - 1);
          }
        } else if (childCount - value <= 0) {
          for (let i = 0; i < -1 * (childCount - value); i++) {
            (this.formGroup.get('children') as FormArray).push(new FormControl('', Validators.required));
          }
        }
        // } else {
        //   this.formGroup = this.toFormArray(value);
        // }

      } else {
        (this.formGroup.get('children') as FormArray).clear();
        this.onChangeFn(null);
      }
    });

    setTimeout(() => {
      if (this.target.elementRef.nativeElement.clientWidth > 250) {
        this.panelWidth$.next(this.target.elementRef.nativeElement.clientWidth + 'px');
      }
    }, 0);
  }

  triggerChildrenErrors() {
    for (const Key of (this.formGroup.get('children') as FormArray).controls) {
      Key.markAsTouched();
      Key.markAsDirty();
      Key.updateValueAndValidity();
    }
  }

  onBackdropClick() {
    if (this.formGroup.invalid) {
      if (this.isPanel) {
        this.triggerChildrenErrors();
      } else {
        return;
      }

      const message = this.translateService.getKey('MSG_CHILD_AGE_REQUIRED');
      this.dialogService.openShowErrors([{message}]);
      return;
    }
    this.isPanelOpen.next(false);
    const childAgesArray: Array<string | null> = this.formGroup.get('children').value;
    if (this.mode === 'datepicker') {
      const result = this.findChildAgeFromDate(childAgesArray);
      this.onChangeFn(result);
    } else if (this.mode === 'select') {
      this.onChangeFn(childAgesArray);
    }
  }

  findChildAgeFromDate(arr: Array<string>) {
    const result = [];
    arr.forEach(childBirthDate => {
      if (childBirthDate && childBirthDate !== '0') {
        result.push(Math.ceil(moment(this.checkIn).diff(childBirthDate) / 31557600000));
      } else {
        result.push(null);
      }
    });
    return result;
  }

  onSelectionChange() {
    if (!this.isPanel) {
      this.onBackdropClick();
    }
  }
}
