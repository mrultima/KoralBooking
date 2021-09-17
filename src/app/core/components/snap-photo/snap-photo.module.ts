import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnapPhotoComponent } from './snap-photo.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../../shared';


const COMPONENTS = [
  SnapPhotoComponent
];

@NgModule({
  declarations: [COMPONENTS],
  exports: [COMPONENTS],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule,
    SharedModule
  ]
})
export class SnapPhotoModule { }
