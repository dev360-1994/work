import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectWithoutRoutesModule } from './project-without-routes.module';
import { ProjectsRoutingModule } from './projects-routing.module';


@NgModule({
    imports: [
      CommonModule,
      ProjectWithoutRoutesModule,
      ProjectsRoutingModule
    ]
})
export class ProjectsModule { }
