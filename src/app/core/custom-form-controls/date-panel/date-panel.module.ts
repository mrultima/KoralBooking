import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePanelComponent } from './date-panel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared';
import { FormDialogModule } from '../../dialogs/form-dialog';

const datePanelExports = [
  DatePanelComponent
];

@NgModule({
  declarations: datePanelExports,
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCheckboxModule,
    OverlayModule,
    MatIconModule,
    MatButtonModule,
    FormDialogModule,
  ],
  exports: datePanelExports
})
export class DatePanelModule {
}
