import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectPersonPanelComponent } from './select-person-panel.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared';
import { ReactiveFormsModule } from '@angular/forms';

const SelectPersonPanelExports = [
  SelectPersonPanelComponent
];

@NgModule({
  declarations: SelectPersonPanelExports,
  imports: [
    CommonModule,
    OverlayModule,
    MatButtonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: SelectPersonPanelExports
})
export class SelectPersonPanelModule {
}
