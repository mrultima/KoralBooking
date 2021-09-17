import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';


const loadingSpinnerExports = [
  LoadingSpinnerComponent
];

@NgModule({
  declarations: loadingSpinnerExports,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
  ],
  exports: loadingSpinnerExports
})
export class LoadingSpinnerModule {
}
