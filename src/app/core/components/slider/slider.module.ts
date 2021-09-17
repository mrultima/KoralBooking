import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SharedModule } from '@travelaps/core/shared';


@NgModule({
  declarations: [SliderComponent],
  imports: [
    CommonModule,
    SharedModule,
    CarouselModule.forRoot()
  ],
  exports: [SliderComponent],
})
export class SliderModule {
}
