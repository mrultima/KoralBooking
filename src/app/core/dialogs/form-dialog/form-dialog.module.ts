import { NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, AppService } from '../../shared';
import { FormDialogComponent } from './form-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ChildrenSelectOrDatepickerModule } from '../../custom-form-controls/children-select-or-datepicker';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { startWith } from 'rxjs/operators';
import { OwlDateTimeModule, OwlMomentDateTimeModule, DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';

const formDialogExports = [
  FormDialogComponent,
  AutocompleteComponent
];

@NgModule({
  declarations: formDialogExports,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule,
    MatRippleModule,
    OwlMomentDateTimeModule,
    OwlDateTimeModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    ChildrenSelectOrDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  exports: formDialogExports,
  entryComponents: formDialogExports
})
export class FormDialogModule {
  constructor(
    private appService: AppService,
    private dateTimeAdapter: DateTimeAdapter<any>
  ) {
    // shared module has the similar function if any changes make it in here probably gonna make there to
    this.appService.language.pipe(startWith('tr')).subscribe(value => {
      if (value.toLowerCase().startsWith('en')) {
        this.dateTimeAdapter.setLocale('en-gb');
      } else {
        this.dateTimeAdapter.setLocale(value);
      }
    });
  }
}
