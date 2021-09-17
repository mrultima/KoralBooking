import { APP_INITIALIZER, NgModule, ErrorHandler } from '@angular/core';
import { AppStarterService } from './app-starter.service';
import {
  CacheRegistrationService,
  LanguageCurrencyCodes,
  StyleManager,
  UriCachingInterceptor,
  PortalErrorHandler,
  ErrorInterceptor,
} from '../shared';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

export function setupPortalFactory(mockService: AppStarterService): Function {
  const abc = () => mockService.getConfig();
  return abc;
}

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    AppStarterService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupPortalFactory,
      deps: [AppStarterService],
      multi: true
    },
    {provide: ErrorHandler, useClass: PortalErrorHandler},
    CacheRegistrationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UriCachingInterceptor,
      multi: true
    },
    StyleManager,
    LanguageCurrencyCodes
  ]
})
export class CoreModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events.pipe(filter(e => e instanceof Scroll)).subscribe((e: Scroll) => {
      if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor);
      } else {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
