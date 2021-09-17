import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared';
import { HmtlAlertsComponent } from './html-alerts.component';


@NgModule({
  declarations: [HmtlAlertsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    SharedModule,
  ],
  exports: [HmtlAlertsComponent]
})
export class HtmlAlertsModule {
}
