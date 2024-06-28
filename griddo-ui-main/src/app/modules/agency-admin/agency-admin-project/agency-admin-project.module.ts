import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AgencyAdminProjectComponent } from './components/agency-admin-project/agency-admin-project.component';
import { AgencyAdminProjectRoutingModule } from './agency-admin-project-routing.module';
import { TrimStringPipeModule } from '../../../pipes/trim-string-pipe/trim-string-pipe.module';


@NgModule({
  declarations: [
    AgencyAdminProjectComponent
  ],
  imports: [
    CommonModule,
    AgencyAdminProjectRoutingModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    TrimStringPipeModule
  ]
})
export class AgencyAdminProjectModule { }
