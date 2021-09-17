import { ComponentFactoryResolver, Directive, ElementRef, Host, HostListener, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatSpinner } from '@angular/material/progress-spinner';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[taCoreClearAndLoading]'
})
export class ClearAndLoadingDirective {
  progressElement: any;
  button: HTMLButtonElement;

  @Input() fc: AbstractControl;

  @HostListener('click', ['$event']) onClick(e: MouseEvent) {
    // e.stopPropagation();
    // e.preventDefault();
    // if (this.fc) {
    //   this.fc.setValue('');
    // }
  }

  @Input() set taCoreClearAndLoading(value: boolean) {
    // this.toggle(value);
  }


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
    @Host() private parent: MatFormField,
    private elementRef: ElementRef,
  ) {
    
    // this.loadComponent();
  }

  loadComponent() {
    this.viewContainerRef.clear();

    // Get factory
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MatSpinner);

    // Create component
    const matProgress = this.viewContainerRef.createComponent(componentFactory, 2);
    matProgress.instance.mode = 'indeterminate';
    matProgress.instance.color = 'accent';

    // Move it
    this.progressElement = matProgress.injector.get(MatSpinner)._elementRef.nativeElement;
    this.renderer.appendChild(this.elementRef.nativeElement, this.progressElement);

    // Add custom class
    this.parent._elementRef.nativeElement.classList.add('mat-load-button');

    this.button = document.createElement('button') as HTMLButtonElement;
    this.button.classList.add('mat-icon-button');
    this.button.style.width = '24px';
    this.button.style.height = '24px';
    this.button.style.color = 'var(--a-c-5)';

    this.button.setAttribute('type', 'button');

    const icon = document.createElement('mat-icon');
    icon.classList.add(...['mat-icon', 'notranslate', 'material-icons', 'mat-icon-no-color']);
    icon.innerHTML = 'clear';

    this.button.append(icon);
    // progressBar.setAttribute('style',
    //   `position: absolute;
    //                  bottom: 0px;
    //                  left: 0;
    //                  border-bottom-left-radius: 50px;
    //                  border-bottom-right-radius: 50px;');`);
    this.renderer.appendChild(this.elementRef.nativeElement, this.button);
  }

  toggle(condition: boolean) {
    condition ? this.show() : this.hide();
  }

  show() {
    this.progressElement.style.display = 'block';
    this.button.style.display = 'none';
    // this.matButton.disabled = true;
  }

  hide() {
    this.button.style.display = 'block';
    this.progressElement.style.display = 'none';
    // this.matButton.disabled = false;
  }

}
