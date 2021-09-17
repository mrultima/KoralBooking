import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTimeComponent } from './input-time.component';


@NgModule({
    declarations: [InputTimeComponent],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
    ],
    exports: [InputTimeComponent]
})
export class InputTimeModule {
}
