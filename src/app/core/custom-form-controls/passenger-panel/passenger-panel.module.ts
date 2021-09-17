import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerPanelComponent } from './passenger-panel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormDialogModule } from '../../dialogs/form-dialog';
import { SharedModule } from '../../shared';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const PassengerPanelExports = [
  PassengerPanelComponent
];

@NgModule({
  declarations: PassengerPanelExports,
  imports: [
    CommonModule,
    OverlayModule,
    FormDialogModule,
    SharedModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: PassengerPanelExports
})
export class PassengerPanelModule {
}
