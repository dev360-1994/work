import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencyAdminProjectsComponent } from './components/agency-admin-projects/agency-admin-projects.component';

const routes: Routes = [
  {
    path: '', component: AgencyAdminProjectsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuilderAdminProjectsRoutingModule { }
