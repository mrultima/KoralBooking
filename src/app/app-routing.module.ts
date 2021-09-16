import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AgreementDialogComponent } from './sharedDialogs/agreement-dialog/agreement-dialog.component';
import { AlertMessagesComponent } from './sharedDialogs/alert-messages/alert-messages.component';
import { ConfirmationDialogComponent } from './sharedDialogs/confirmation-dialog/confirmation-dialog.component';
import { HtmlDialogComponent } from './sharedDialogs/html-dialog/html-dialog.component';
import { LoadingOverlayComponent } from './sharedDialogs/loading-overlay/loading-overlay.component';
import { ShowErrorsComponent } from './sharedDialogs/show-errors/show-errors.component';

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
  HtmlDialogComponent,
  LoadingOverlayComponent,
  ShowErrorsComponent,
  ConfirmationDialogComponent,
  AlertMessagesComponent,
  AgreementDialogComponent,
  
]
