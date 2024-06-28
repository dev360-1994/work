import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { WorksheetPriceComponent } from 'src/app/modules/worksheets/components/worksheet-modal/worksheet-price/worksheet-price.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    GooglePlaceModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,

    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSlideToggleModule,
    NgxIntlTelInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ], declarations: [
    WorksheetPriceComponent
  ], exports: [CommonModule,
    MatButtonModule,
    GooglePlaceModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSlideToggleModule,
    NgxIntlTelInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class SharedModule { }
