import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import {FlexLayoutServerModule} from '@angular/flex-layout/server';
// import { GlobalService } from './global.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FlexLayoutServerModule,
  ],
  bootstrap: [AppComponent],
  // providers: [GlobalService],
})
export class AppServerModule {}
