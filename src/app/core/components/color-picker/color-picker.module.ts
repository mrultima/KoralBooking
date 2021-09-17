import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker.component';


const colorPickerExports = [
  ColorPickerComponent
];


@NgModule({
  declarations: colorPickerExports,
  imports: [
    CommonModule
  ],
  exports: colorPickerExports
})
export class ColorPickerModule {
}
