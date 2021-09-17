import { TemplateRef } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { debounceTime, startWith } from "rxjs/operators";

export function asFilterOption(arr: any[]): FilterOption[] {
    return arr.reduce((acc, v) => {
        acc.push({
            VALUE: v,
            VIEWVALUE: v
        });
        return acc;
    }, []);
}

export interface FilterPanelModel {
    HEADING?: string;
    EXPANDED?: boolean;
}

export interface FilterGroupModel {
    HEADING?: string;
}
export interface FilterSettings {
    debounceTime?: number;
}

export class Filter<T> {

    data: T[] = [];

    filteredData: T[] = [];

    filteredData$ = new BehaviorSubject<T[]>([]);

    readonly panels: FilterPanel[] = [];

    readonly form = new FormGroup({});

    readonly changed = new Subject();

    private isDestroy$ = new Subject();

    private changedSubscription: Subscription;

    dirty: boolean;

    constructor(
        public settings: FilterSettings
    ) { }

    destroy(): void {
        this.isDestroy$.next();
        this.isDestroy$.complete();
        this.changed.complete();
        this.data = [];
        this.filteredData = [];
        this.changedSubscription?.unsubscribe();
        this.callFilterTypeMethod('destroy');
    }

    addPanel(panel: FilterPanel): this {
        panel.filter = this;
        this.form.addControl(String(this.panels.length), panel.form);
        this.panels.push(panel);
        return this;
    }

    setData(data: T[]): this {
        this.data = data;
        this.filteredData = data;
        this.filteredData$.next(this.filteredData);
        this.init();
        this.count();
        this.changedSubscription?.unsubscribe();
        this.changedSubscription = this.form.valueChanges.pipe(
            startWith(null as string),
            debounceTime(Math.min(this.settings?.debounceTime || 50, 50))
        ).subscribe({
            next: () => {
                this.changed.next();
            }
        });
        return this;
    }

    getAllFilterType(): FilterType[] {
        const acc = [];
        for (const panel of this.panels) {
            for (const group of panel.groups) {
                for (const filterType of group.filterTypes) {
                    acc.push(filterType);
                }
            }
        }
        return acc;
    }

    private callFilterTypeMethod(method: keyof FilterType, ...args: any): void {
        this.getAllFilterType().forEach(filterType => {
            filterType[method](...args);
        });
    }

    private init(): void {
        this.callFilterTypeMethod('init');
        this.visible();
    }

    visible(): void {
        for (const panel of this.panels) {
            for (const group of panel.groups) {
                group.visible = group.filterTypes.length > 0 && group.filterTypes.some(x => x.visible());
                for (const type of group.filterTypes) {
                    type.hide = !type.visible();
                }
            }
            panel.visible = panel.groups.length > 0 && panel.groups.some(x => x.visible);
        }
    }

    apply(): T[] {
        this.filteredData = this.data;
        this.getAllFilterType().forEach(filterType => {
            if (!filterType.filterFn) {
                return;
            }
            this.filteredData = this.filteredData.filter(data => filterType.filterFn(data));
        });
        this.filteredCount();
        this.dirty = this.getAllFilterType().some(x => x.visible() && x.dirty());
        this.filteredData$.next(this.filteredData);
        return this.filteredData;
    }

    private count(): void {
        this.callFilterTypeMethod('count');
    }

    private filteredCount(): void {
        this.callFilterTypeMethod('filteredCount');
    }

    reset(): void {
        this.callFilterTypeMethod('reset');
    }

    getFilterTypeById(id: string): FilterType<any> {
        return this.getAllFilterType().find(x => x.id === id);
    }
}

export class FilterPanel {

    filter: Filter<any>;

    visible = true;

    readonly groups: FilterGroup[] = [];

    readonly form = new FormGroup({});

    constructor(public model: FilterPanelModel) { }

    addGroup(group: FilterGroup): this {
        group.panel = this;
        this.form.addControl(String(this.groups.length), group.form);
        this.groups.push(group);
        return this;
    }
}

export class FilterGroup {

    panel: FilterPanel;

    visible = true;

    readonly filterTypes: FilterType[] = [];

    readonly form = new FormGroup({});

    constructor(public model: FilterGroupModel) { }

    addFilterType(filter: FilterType): this {
        filter.group = this;
        this.form.addControl(String(this.filterTypes.length), filter.control);
        this.filterTypes.push(filter);
        return this;
    }
}

export abstract class FilterType<T = any, U = any, Z = any> {
    id: string;
    group: FilterGroup;
    control: AbstractControl = new FormArray([]);
    template: TemplateRef<T>;
    hide = false;
    filterFn: (data: any) => boolean;
    countFn: (data: any[], option: Z) => number;
    readonly context = { $implicit: this };
    constructor(public settings?: U) { }
    abstract setFilter<V = any>(fn: (data: V, value: any) => boolean): this;
    init(): void { }
    setTemplate(template: TemplateRef<T>): this { this.template = template; return this }
    setCount<V = any>(fn: (data: V[], value: Z) => number): this { this.countFn = fn; return this; }
    count(): void { }
    filteredCount(): void { }
    visible(): boolean { return true; }
    destroy(): void { }
    dirty(): boolean { return true; }
    reset(): void { this.control.reset(undefined, { emitEvent: false, onlySelf: true }); }
    setId(id: string): this { this.id = id; return this; }
}

/*  */

export interface FilterTypeOptionSettings {
    showmore?: boolean;
    limit?: number;
}
export interface FilterOption {
    VALUE: any;
    VIEWVALUE: string;
    COUNT?: number;
    DISPLAYED?: number;
    CONTROL?: AbstractControl;
}
export class FilterTypeOption extends FilterType<FilterTypeOption, FilterTypeOptionSettings, FilterOption> {
    private options: FilterOption[] = [];
    showmore = false;
    showmoreless = true;
    optionList: FilterOption[] = [];
    dynamicOptionsFn: (data: any[]) => FilterOption[];
    setOptions(options: FilterOption[]): this {
        (this.control as FormArray).controls = [];
        this.options = options.map((x, i) => {
            x.CONTROL = new FormControl(false);
            (this.control as FormArray).setControl(i, x.CONTROL);
            return x;
        });
        return this;
    }

    setDynamicOptions<T = any>(fn: (data: T[]) => FilterOption[]): this {
        this.dynamicOptionsFn = fn;
        return this;
    }

    init(): void {
        if (this.dynamicOptionsFn) {
            this.setOptions(this.dynamicOptionsFn(this.group.panel.filter.data));
        }
        this.setOptionList();
    }

    count(): void {
        if (this.countFn) {
            this.options.forEach(x => {
                x.COUNT = this.countFn(this.group.panel.filter.data, x);
            });
        }
    }

    filteredCount(): void {
        if (this.countFn) {
            this.options.forEach(x => {
                x.DISPLAYED = this.countFn(this.group.panel.filter.filteredData, x);
            });
        }
    }

    toggleShowMoreLess(): void {
        this.showmoreless = !this.showmoreless;
        this.setOptionList();
    }

    private setOptionList(): void {
        const limit = this.settings?.limit || 10;
        if (this.settings?.showmore) {
            this.showmore = this.options.length > limit;
        }
        this.optionList = this.showmore && this.showmoreless ? this.options.slice(0, limit) : this.options;
    }

    setFilter<V = any>(fn: (data: V, value: number[] | string[]) => boolean): this {
        this.filterFn = data => {
            const c = Object.entries<boolean>(this.control.value).filter(x => x[1]).map(x => this.options[x[0]].VALUE);
            return fn(data, c);
        };
        return this;
    }

    visible(): boolean {
        return this.options.length > 1;
    }

    dirty(): boolean {
        return this.control.value.some(x => x !== false && x !== null);
    }
}
/*  */

export interface FilterTypeSearchSettings {
    label?: string;
}
export class FilterTypeSearch extends FilterType<FilterTypeSearch, FilterTypeSearchSettings> {
    control = new FormControl();
    init(): void { }
    setFilter<V = any>(fn: (data: V, value: string) => boolean): this {
        this.filterFn = data => {
            return fn(data, this.control.value);
        };
        return this;
    }
    dirty(): boolean {
        return !(this.control.value === null || this.control.value === '');
    }
}

/*  */
export interface FilterTypeSlideToggleSettings {
    label?: string;
    value?: boolean;
}
export class FilterTypeSlideToggle extends FilterType<FilterTypeSlideToggle, FilterTypeSlideToggleSettings> {
    control = new FormControl(this.settings?.value);
    total: number;
    filtered: number;
    init(): void { }
    setFilter<V = any>(fn: (data: V, value: boolean) => boolean): this {
        this.filterFn = data => {
            return fn(data, this.control.value);
        };
        return this;
    }
    count(): void {
        if (this.countFn) {
            this.total = this.countFn(this.group.panel.filter.data, this.control.value);
        }
    }
    filteredCount(): void {
        if (this.countFn) {
            this.filtered = this.countFn(this.group.panel.filter.filteredData, this.control.value);
        }
    }
    dirty(): boolean {
        return this.control.value !== (this.settings?.value === undefined ? null : this.settings.value);
    }
    reset(): void {
        this.control.reset(this.settings?.value, { emitEvent: false, onlySelf: true });
    }
    visible(): boolean {
        return this.countFn ? this.countFn(this.group.panel.filter.data, true) > 0 : true;
    }
}

/*  */
export interface FilterTypeSliderSettings {
    label?: string;
    min: number;
    max: number;
    value?: number;
    step?: number;
    thumbLabel?: boolean;
    showTicks?: boolean;
    displayWith?: (value: number) => string | number;
}
export class FilterTypeSlider extends FilterType<FilterTypeSlider, FilterTypeSliderSettings> {
    control = new FormControl(this.settings?.value);
    init(): void { }
    setFilter<V = any>(fn: (data: V, value: number) => boolean): this {
        this.filterFn = data => {
            return fn(data, this.control.value);
        };
        return this;
    }
    dirty(): boolean {
        return this.control.value !== (this.settings?.value === undefined ? null : this.settings.value);
    }
    reset(): void {
        this.control.reset(this.settings?.value, { emitEvent: false, onlySelf: true });
    }
}
