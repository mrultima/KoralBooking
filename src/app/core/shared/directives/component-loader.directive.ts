import { ComponentFactory, ComponentRef, Directive, Input, OnDestroy, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[taCoreComponentLoader]'
})
export class ComponentLoaderDirective implements OnDestroy {

  _data;
  _compRef: ComponentRef<any>;

  @Input() set taCoreComponentLoaderData(data: any) {
    this._data = data;
    if (this._compRef) {
      this.triggerData();
    }
  }

  @Input() set taCoreComponentLoader(componentFactory: ComponentFactory<any>) {
    this._compRef = this.viewContainerRef.createComponent(componentFactory);

    if (this._data) {
      this.triggerData();
    }
  }

  triggerData() {
    for (const Key of Object.keys(this._data)) {
      this._compRef.instance[Key] = this._data[Key];
    }
  }

  constructor(public viewContainerRef: ViewContainerRef) {
  }

  ngOnDestroy(): void {
    if (this._compRef) {
      this._compRef.destroy();
    }
  }
}
