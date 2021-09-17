import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared';
import { PaletteSelectorComponent } from './palette-selector.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ColorPickerModule } from '../../components/color-picker';


const paletteSelectorExports = [
  PaletteSelectorComponent
];

@NgModule({
  declarations: paletteSelectorExports,
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    MatRippleModule,
    MatButtonModule,
    ColorPickerModule,
  ],
  exports: paletteSelectorExports,
  entryComponents: paletteSelectorExports
})
export class PaletteSelectorModule {
}
