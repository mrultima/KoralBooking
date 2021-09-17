import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightBoxComponent } from './light-box.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared';
import { MatButtonModule } from '@angular/material/button';


const lightBoxExports = [
  LightBoxComponent
];

@NgModule({
  declarations: lightBoxExports,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    SharedModule,
    MatButtonModule,
  ],
  exports: lightBoxExports,
  entryComponents: lightBoxExports
})
export class LightBoxModule {
}
