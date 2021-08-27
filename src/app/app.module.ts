import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SearchboxComponent } from "./searchbox/searchbox.component";
import { RoomsComponent } from "./rooms/rooms.component";
import { ExtrasComponent } from "./extras/extras.component";
import { ContactComponent } from "./contact/contact.component";
import { GuestsComponent } from "./guests/guests.component";
import { PaymentComponent } from "./payment/payment.component";
import { BasketComponent } from "./basket/basket.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { HotelinfoComponent } from "./hotelinfo/hotelinfo.component";
import { HotelphotoComponent } from "./hotelphoto/hotelphoto.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatStepperModule } from "@angular/material/stepper";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FacilitysComponent } from "./facilitys/facilitys.component";
import { MatBadgeModule } from "@angular/material/badge";
import {MatSidenavModule} from '@angular/material/sidenav';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { YandexMapComponent } from './yandex-map/yandex-map.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AngularYandexMapsModule, YaConfig, YA_CONFIG } from 'angular8-yandex-maps';
import {MatTabsModule} from '@angular/material/tabs';


const mapConfig: YaConfig = {
  apikey: 'pdct.1.1.20210826T094816Z.38a0996dbc78ac17.41b3a82bfec8250e2c0a1a474905ff08070601ff',
  lang: 'en_US',
};
@NgModule({
  declarations: [
    AppComponent,
    SearchboxComponent,
    RoomsComponent,
    ExtrasComponent,
    ContactComponent,
    GuestsComponent,
    PaymentComponent,
    BasketComponent,
    HeaderComponent,
    FooterComponent,
    HotelinfoComponent,
    HotelphotoComponent,
    FacilitysComponent,
    YandexMapComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    NoopAnimationsModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTooltipModule,
    MatStepperModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatSidenavModule,
    HttpClientModule,
    MatDialogModule,
    AngularYandexMapsModule.forRoot(mapConfig),
    
  
    MatTabsModule
   
  ],
  entryComponents: [YandexMapComponent],
  providers: [{
    provide: YA_CONFIG,
    useValue: {
      apikey: 'pdct.1.1.20210826T094816Z.38a0996dbc78ac17.41b3a82bfec8250e2c0a1a474905ff08070601ff',
      lang: 'en_US',
    },
  },],
  bootstrap: [AppComponent],
})
export class AppModule {}
