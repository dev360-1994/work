import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuilderRoutingModule } from './builder-routing.module';
import { BuildersComponent } from './components/builders/builders.component';
import { AddBuilderComponent } from './components/add-builder/add-builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { BuilderCardComponent } from './components/builder-card/builder-card.component';
import { MatIconModule } from '@angular/material/icon';
import { BuilderComponent } from './components/builder/builder.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatDialogModule } from '@angular/material/dialog';
import { FileDragNDropModule } from '../../directives/file-drag-n-drop/file-drag-n-drop.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    BuildersComponent,
    AddBuilderComponent,
    BuilderCardComponent,
    BuilderComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    FormsModule,
    BuilderRoutingModule,
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

  ]
})
export class BuilderModule { }
