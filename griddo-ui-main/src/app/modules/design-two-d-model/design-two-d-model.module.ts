import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignTwoDModelComponent } from './components/design-two-d-model/design-two-d-model.component';
import { DesignTwoDModelRoutingModule } from './design-two-d-model-routing.module';
import { FileDragNDropModule } from '../../directives/file-drag-n-drop/file-drag-n-drop.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@NgModule({
  declarations: [
    DesignTwoDModelComponent
  ],
  imports: [
    CommonModule,
    // FileDragNDropModule,
    DesignTwoDModelRoutingModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBarModule
  ]
})
export class DesignTwoDModelModule { }
