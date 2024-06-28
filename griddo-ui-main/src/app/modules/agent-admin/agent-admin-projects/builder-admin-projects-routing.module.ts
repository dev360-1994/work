import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuilderAdminProjectsComponent } from './components/builder-admin-projects/builder-admin-projects.component';

const routes: Routes = [
  {
    path: '', component: BuilderAdminProjectsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuilderAdminProjectsRoutingModule { }
