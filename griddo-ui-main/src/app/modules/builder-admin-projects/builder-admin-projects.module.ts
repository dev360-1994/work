import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuilderAdminProjectsRoutingModule } from './builder-admin-projects-routing.module';
import { BuilderAdminProjectsComponent } from './components/builder-admin-projects/builder-admin-projects.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ColorPickerService } from 'ngx-color-picker';
import { TrimStringPipeModule } from '../../pipes/trim-string-pipe/trim-string-pipe.module';
import { ProjectWithoutRoutesModule } from '../projects/project-without-routes.module';


@NgModule({
  declarations: [
    BuilderAdminProjectsComponent
  ],
  imports: [
    CommonModule,
    ProjectWithoutRoutesModule,
    BuilderAdminProjectsRoutingModule,
    MatProgressBarModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSnackBarModule,
    TrimStringPipeModule
  ],
  providers: [
    ColorPickerService 
  ]
})
export class BuilderAdminProjectsModule { }
