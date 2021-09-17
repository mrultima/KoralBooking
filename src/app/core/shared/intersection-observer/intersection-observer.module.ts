import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntersectionObserverComponent } from './intersection-observer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IntersectionObserverComponent],
  exports: [IntersectionObserverComponent]
})
export class IntersectionObserverModule { }
