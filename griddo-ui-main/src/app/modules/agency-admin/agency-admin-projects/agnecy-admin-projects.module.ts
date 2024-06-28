import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

 
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BuilderAdminProjectsRoutingModule } from '../../builder-admin-projects/builder-admin-projects-routing.module';
import { AgencyAdminProjectsComponent } from './components/agency-admin-projects/agency-admin-projects.component';
import { AgencyStaffComponent } from './agency-staff/agency-staff.component';


@NgModule({
  declarations: [
    AgencyAdminProjectsComponent,
    AgencyStaffComponent
  ],
  imports: [
    CommonModule,
    BuilderAdminProjectsRoutingModule,
    MatProgressBarModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSnackBarModule
  ]
})
export class BuilderAdminProjectsModule { }
