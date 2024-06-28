import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuilderAdminProjectRoutingModule } from './builder-admin-project-routing.module';
import { BuilderAdminProjectComponent } from './components/builder-admin-project/builder-admin-project.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UnitDetailModalComponent } from './components/unit-detail-modal/unit-detail-modal.component';
import { TrimStringPipeModule } from '../../pipes/trim-string-pipe/trim-string-pipe.module';


@NgModule({
  declarations: [
    BuilderAdminProjectComponent,
    UnitDetailModalComponent
  ],
  imports: [
    CommonModule,
    BuilderAdminProjectRoutingModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TrimStringPipeModule
  ]
})
export class BuilderAdminProjectModule { }
