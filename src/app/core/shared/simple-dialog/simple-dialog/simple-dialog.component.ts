import { Component, ViewChild, ViewContainerRef, TemplateRef, Type, ComponentFactoryResolver, EmbeddedViewRef, Injector, StaticProvider, ComponentRef, ViewEncapsulation, Inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { SIMPLE_DIALOG_REF } from "../simple-dialog.token";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'simple-dialog-component',
    templateUrl: './simple-dialog.component.html',
    styleUrls: ['./simple-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SimpleDialogComponent {

    private counter = 0;

    @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

    @ViewChild('tpl', { read: TemplateRef }) tpl: TemplateRef<any>;

    constructor(
        private resolver: ComponentFactoryResolver,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) private ref: any
    ) { }

    clear() { this.container.clear(); this.counter = 0; }

    html(content: string): EmbeddedViewRef<any> {
        return this.container.createEmbeddedView(this.tpl, {
            $implicit: this.sanitizer.bypassSecurityTrustHtml(content)
        }, this.counter++)
    }

    template<T>(tpl: TemplateRef<T>, context?: T): EmbeddedViewRef<T> {
        return this.container.createEmbeddedView(tpl, context, this.counter++);
    }

    component<T>(content: Type<T>, providers?: StaticProvider[]): ComponentRef<T> {
        const fc = this.resolver.resolveComponentFactory(content);
        const refProvider = {
            provide: SIMPLE_DIALOG_REF,
            useValue: this.ref
        } as StaticProvider;
        if (!providers) providers = [];
        providers.push(refProvider);
        return this.container.createComponent(fc, this.counter++, Injector.create(providers));
    }
}