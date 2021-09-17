import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YandexMapDialogComponent } from './yandex-map-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared';
import { YandexMapModule } from '../../components/yandex-map';


const YandexMapDialogExports = [
  YandexMapDialogComponent
];


@NgModule({
  declarations: YandexMapDialogExports,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    SharedModule,
    YandexMapModule,
  ],
  exports: YandexMapDialogExports,
  entryComponents: YandexMapDialogExports
})
export class YandexMapDialogModule {
}
