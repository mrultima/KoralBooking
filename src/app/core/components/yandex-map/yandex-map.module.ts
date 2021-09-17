import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YandexMapComponent } from './yandex-map.component';


const yandexMapExports = [
  YandexMapComponent
];

@NgModule({
  declarations: yandexMapExports,
  imports: [
    CommonModule,
  ],
  exports: yandexMapExports
})
export class YandexMapModule {
}
