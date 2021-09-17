import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { YandexMapData } from '../../shared';

export interface YandexMapDialogData {
  objects: YandexMapData[];
  initialCoordinates: number[];
}

@Component({
  selector: 'ta-core-yandex-map-dialog',
  templateUrl: './yandex-map-dialog.component.html',
  styleUrls: ['./yandex-map-dialog.component.scss']
})
export class YandexMapDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<YandexMapDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: YandexMapDialogData) {
  }

  ngOnInit() {
  }

}
