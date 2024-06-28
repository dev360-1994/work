import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { AddAgencyComponent } from './components/add-agency/add-agency.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgencyComponent } from './components/agency/agency.component';
import { AgencyCardComponent } from './components/agency-card/agency-card.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MatListModule } from '@angular/material/list';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FileDragNDropModule } from '../../directives/file-drag-n-drop/file-drag-n-drop.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AgencyListingComponent } from './components/agency-listing/agency-listing.component';
import { AgencyRoutingModule } from './agency-routing.module';
import { SidebarModule } from '../sidebar/sidebar.module';

@NgModule({
  declarations: [
    AgencyListingComponent,
    AddAgencyComponent,
    AgencyComponent,
    AgencyCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    AgencyRoutingModule,
    GooglePlaceModule,
    PopoverModule,
    MatListModule,
    MatSnackBarModule,
    ImageCropperModule,
    MatDialogModule,
    FileDragNDropModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatPaginatorModule,
    NgxIntlTelInputModule
    ,SidebarModule
  ]
})
export class AgencyModule { }
