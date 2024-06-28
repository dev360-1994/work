import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuilderAdminProjectsRoutingModule } from './builder-admin-projects-routing.module';
import { BuilderAdminProjectsComponent } from './components/builder-admin-projects/builder-admin-projects.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    BuilderAdminProjectsComponent
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
