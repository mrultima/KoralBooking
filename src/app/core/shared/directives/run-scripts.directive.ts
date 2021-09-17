import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

@Directive({
  selector: '[taCoreRunScripts]'
})
export class RunScriptsDirective implements OnInit {

  @Input() set taCoreRunScripts(a) {
    if (a) {
      setTimeout(() => {
        this.reinsertScripts();
      }, 0);
    }
  }

  constructor(
    private elementRef: ElementRef,
    private appService: AppService,
  ) {
  }

  ngOnInit(): void {
  }

  reinsertScripts(): void {
    const scripts = <HTMLScriptElement[]>this.elementRef.nativeElement.getElementsByTagName('script');
    const scriptsInitialLength = scripts.length;
    for (let i = 0; i < scriptsInitialLength; i++) {
      const script = scripts[i];
      const scriptCopy = <HTMLScriptElement>document.createElement('script');
      scriptCopy.type = script.type ? script.type : 'text/javascript';
      if (script.innerHTML) {
        scriptCopy.innerHTML = script.innerHTML;
      } else if (script.src) {
        scriptCopy.src = script.src;
      }
      scriptCopy.async = false;
      script.parentNode.replaceChild(scriptCopy, script);
    }
  }
}
