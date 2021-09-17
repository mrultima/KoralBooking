import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasketPanelComponent } from './core/components/basket-panel';
import { BasketPanelBuylaterDialogComponent } from './core/components/basket-panel/basket-panel-buylater-dialog/basket-panel-buylater-dialog.component';
import { ListNoItemComponent } from './core/components/list-no-item';
import { DatePanelComponent } from './core/custom-form-controls/date-panel';
import { PaginatorComponent } from './core/custom-form-controls/paginator';
import { LightBoxComponent } from './core/dialogs/light-box';
import { AppLookupComponent } from './core/shared/lookup/lookup.component';
import { AgreementDialogComponent } from './core/shared/sharedDialogs/agreement-dialog/agreement-dialog.component';
import { AlertMessagesComponent } from './core/shared/sharedDialogs/alert-messages/alert-messages.component';
import { ConfirmationDialogComponent } from './core/shared/sharedDialogs/confirmation-dialog/confirmation-dialog.component';
import { HtmlDialogComponent } from './core/shared/sharedDialogs/html-dialog/html-dialog.component';
import { LoadingOverlayComponent } from './core/shared/sharedDialogs/loading-overlay/loading-overlay.component';
import { ShowErrorsComponent } from './core/shared/sharedDialogs/show-errors/show-errors.component';
import { LoginComponent } from './login/login.component';
import { YandexMapComponent } from './yandex-map/yandex-map.component';
const routes: Routes = [
  { path: 'Login' , component : LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  LoginComponent, 
  BasketPanelBuylaterDialogComponent,
  BasketPanelComponent,
  ListNoItemComponent,
  YandexMapComponent,
  DatePanelComponent,
  PaginatorComponent,
  AppLookupComponent,
  AgreementDialogComponent,
  AlertMessagesComponent,
  ConfirmationDialogComponent,
  HtmlDialogComponent,
  LoadingOverlayComponent,
  ShowErrorsComponent,  
  LightBoxComponent,
]
