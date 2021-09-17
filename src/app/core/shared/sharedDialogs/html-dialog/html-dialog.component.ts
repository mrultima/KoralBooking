import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-html-dialog',
  templateUrl: './html-dialog.component.html',
  styleUrls: ['./html-dialog.component.scss']
})
export class HtmlDialogComponent implements OnInit {

  isCC = new BehaviorSubject(false);

  @ViewChild('container', {read: ViewContainerRef, static: true}) container: ViewContainerRef;

  @ViewChild('template', {read: TemplateRef, static: true}) template: TemplateRef<any>;

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) private ref: HtmlDialogComponent
  ) {
  }

  ngOnInit() {
  }

  html(content: string) {
    this.container.createEmbeddedView(this.template, {
      $implicit: this.sanitizer.bypassSecurityTrustHtml(content)
    });
  }

  openCC(content: string) {
    this.isCC.next(true);
    this.html(content);

    setTimeout(() => {
      const form1 = document.querySelector('form[name="downloadForm"]') as HTMLFormElement;
      const form2 = document.querySelector('form[name="PostForm"]') as HTMLFormElement;
      const form3 = document.querySelector('form[name="frmMpiForm"]') as HTMLFormElement;
      const form4 = document.querySelector('form[name="webform0"]') as HTMLFormElement;
      if (form1 || form2 || form3 || form4) {
        try {
          if (form1) { form1.submit(); }
          if (form2) { form2.submit(); }
          if (form3) { form3.submit(); }
          if (form4) { form4.submit(); }
        } catch (e) {
          console.log('formunNameiStaticdeYok', e);
        }
      }
    }, 1000);
  }
}
