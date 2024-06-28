import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuilderAdminProjectsComponent } from './components/builder-admin-projects/builder-admin-projects.component';
import { StepperComponent } from '../projects/components/stepper/stepper.component';
const routes: Routes = [

  { path: '', component: BuilderAdminProjectsComponent },
  { path: 'add', component: StepperComponent },
  { path: ':projectId/edit', component: StepperComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuilderAdminProjectsRoutingModule { }
