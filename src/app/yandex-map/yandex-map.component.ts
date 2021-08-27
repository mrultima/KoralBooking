import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { YandexMapData } from '../models/yandex-map-model';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';
import { ApiService } from '../api.service';
import { HotelinfoComponent } from '../hotelinfo/hotelinfo.component';
export interface YandexMapDialogData {
  objects: YandexMapData[];
  initialCoordinates: number[];
}
const mapConfig: YaConfig = {
  apikey: 'pdct.1.1.20210826T094816Z.38a0996dbc78ac17.41b3a82bfec8250e2c0a1a474905ff08070601ff',
  lang: 'en_US',
};
@NgModule({
  imports: [AngularYandexMapsModule.forRoot(mapConfig)],
})
export class AppModule {}
@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.css']
})
export class YandexMapComponent implements OnInit {
  
  

  constructor(public dialogRef: MatDialogRef<YandexMapComponent>,
    public matDialog: MatDialog,
    // @Input HotelinfoComponent: Hotel
    @Inject(MAT_DIALOG_DATA) public data: YandexMapDialogData) {
    
  }
  
  ngOnInit(): void {

    
  }
  closeMap(){
    this.matDialog.closeAll();
  }
  
}
