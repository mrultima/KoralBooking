import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketPanelComponent } from './basket-panel.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule, TranslatePipe } from '../../shared';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { BasketPanelBuylaterDialogComponent } from './basket-panel-buylater-dialog/basket-panel-buylater-dialog.component';
import { IntlPhoneInputModule } from '../../custom-form-controls/intl-phone-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    BasketPanelComponent,
    BasketPanelBuylaterDialogComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    SharedModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    IntlPhoneInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FlexLayoutModule,
  ],
  exports: [
    BasketPanelComponent,
  ],
  entryComponents: [
    BasketPanelBuylaterDialogComponent,
  ]
})
export class BasketPanelModule {
}
