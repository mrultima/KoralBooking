import { NgModule, ModuleWithProviders, Provider, Optional, Injector } from '@angular/core';
import { ConvertPipe } from './pipes/convert.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { GroupByPipe } from './pipes/groupBy.pipe';
import { DigitOrTextOnlyDirective } from './directives/digit-or-text-only.directive';
import { ErrorDirective } from './directives/error.directive';
import { ScrollDirective } from './directives/scroll.directive';
import { ClearAndLoadingDirective } from './directives/clear-and-loading.directive';
import { ImageOnErrorDirective } from './directives/image-on-error.directive';
import { ComponentLoaderDirective } from './directives/component-loader.directive';
import { RunScriptsDirective } from './directives/run-scripts.directive';
import { PortalEnvironment, PORTAL_ENV } from './services/portal-injection.service';
import { AgreementDialogComponent } from './sharedDialogs/agreement-dialog/agreement-dialog.component';
import { HtmlDialogComponent } from './sharedDialogs/html-dialog/html-dialog.component';
import { LoadingOverlayComponent } from './sharedDialogs/loading-overlay/loading-overlay.component';
import { ShowErrorsComponent } from './sharedDialogs/show-errors/show-errors.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { startWith } from 'rxjs/operators';
import * as moment from 'moment';
import { DateAdapter } from '@angular/material/core';
import { AppService } from './services/app.service';
import { ConfirmationDialogComponent } from './sharedDialogs/confirmation-dialog/confirmation-dialog.component';
import { IsNullPipe } from './pipes/is-null.pipe';
import { NumeralPipe } from './pipes/numeral.pipe';
import { MomentPipe } from './pipes/moment.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { CCHiddingPipe } from './pipes/CCHidding';
import { AlertMessagesComponent } from './sharedDialogs/alert-messages/alert-messages.component';
import { localeInitializer } from '../shared/localize';
import { LazyImageDirective } from './directives/lazy-image.directive';
import { FnPipe } from './pipes/fn.pipe';


const entryExports = [
  AgreementDialogComponent,
  HtmlDialogComponent,
  LoadingOverlayComponent,
  ShowErrorsComponent,
  ConfirmationDialogComponent,
  AlertMessagesComponent
];

const sharedExports = [
  ConvertPipe,
  CCHiddingPipe,
  TranslatePipe,
  SafePipe,
  GroupByPipe,
  IsNullPipe,
  NumeralPipe,
  MomentPipe,
  CapitalizePipe,
  DigitOrTextOnlyDirective,
  RunScriptsDirective,
  ErrorDirective,
  ClearAndLoadingDirective,
  ScrollDirective,
  ImageOnErrorDirective,
  ComponentLoaderDirective,
  LazyImageDirective,
  FnPipe,
  ...entryExports
];

@NgModule({
  declarations: [
    ...sharedExports,
    AlertMessagesComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMomentDateModule,
  ],
  exports: [
    sharedExports,
  ],
  entryComponents: [
    ...entryExports,
    MatSpinner,
  ],
  // providers: [
  //   {provide: MatPaginatorIntl, useClass: PaginationComponent},
  // ]
})
export class SharedModule {

  constructor(
    private adapter: DateAdapter<any>,
    private appService: AppService,
    inj: Injector
  ) {
    // form dialog has the similar function if any changes make it in here probably gonna make there to
    this.appService.language.pipe(startWith('tr')).subscribe(async value => {

      if (!value) {
        return;
      }

      await localeInitializer(value);

      let dateTimeAdapter: any;
      try {
        dateTimeAdapter = inj.get(await import('@danielmoncada/angular-datetime-picker').then(x => x.DateTimeAdapter));
      } catch (e) {
        dateTimeAdapter = null;
      }
      if (value.toLowerCase().startsWith('en')) {
        this.adapter.setLocale('en-gb');
        if (dateTimeAdapter) {
          dateTimeAdapter.setLocale('en-gb');
        }
        moment.locale('en-gb');
      } else {
        this.adapter.setLocale(value);
        moment.locale(value);
        if (dateTimeAdapter) {
          dateTimeAdapter.setLocale(value);
        }
      }
    });
  }


  static forRoot(environment: PortalEnvironment): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: PORTAL_ENV,
          useValue: environment
        }
      ] as Provider[]
    };
  }
}
