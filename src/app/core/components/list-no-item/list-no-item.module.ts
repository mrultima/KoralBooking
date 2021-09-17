import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListNoItemComponent } from './list-no-item.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared';

const listNoItemExports = [
  ListNoItemComponent
];

@NgModule({
  declarations: listNoItemExports,
  imports: [
    CommonModule,
    MatIconModule,
    SharedModule,
  ],
  exports: listNoItemExports
})
export class ListNoItemModule {
}
