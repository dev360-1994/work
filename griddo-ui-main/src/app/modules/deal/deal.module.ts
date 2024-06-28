import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealRoutingModule } from './deal-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DealComponent } from './components/deals/deal.component';



@NgModule({
  declarations: [
    DealComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    GooglePlaceModule,
    MatSnackBarModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    DealRoutingModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class DealModule { }
