import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesGridComponent } from './components/sales-grid/sales-grid.component';
import { SalesGridRoutingModule } from './sales-grid-routing.module';
import { SetupSalesGridComponent } from './components/setup-sales-grid/setup-sales-grid.component';
import { SetPricingComponent } from './components/set-pricing/set-pricing.component';
import { SetUnitsSkipsComponent } from './components/set-units-skips/set-units-skips.component';
import { FileDragNDropModule } from '../../directives/file-drag-n-drop/file-drag-n-drop.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnitComponent } from './components/unit/unit.component';
import { MatIconModule } from '@angular/material/icon';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TwoDModelComponent } from './components/two-d-model/two-d-model.component';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [
    SalesGridComponent,
    SetupSalesGridComponent,
    SetPricingComponent,
    SetUnitsSkipsComponent,
    UnitComponent,
    TwoDModelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    SalesGridRoutingModule,
    FileDragNDropModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    PopoverModule,
    MatSliderModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatProgressBarModule,
    NgxSliderModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatExpansionModule

  ]
})
export class SalesGridModule { }
