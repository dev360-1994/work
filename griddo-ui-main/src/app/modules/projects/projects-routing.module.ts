import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitPricingDetailComponent } from './components/build-grid/unit-pricing-detail/unit-pricing-detail.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { SalesGridModule } from '../sales-grid/sales-grid.module';
import { ViewProjectComponent } from './components/view-project/view-project.component';
const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'add', component: StepperComponent },
  { path: 'docuSignUpload', component: ViewProjectComponent},
  { path: 'sales-grid', loadChildren: () => import('../sales-grid/sales-grid.module').then(x => x.SalesGridModule) },
  { path: 'unit-pricing', component: UnitPricingDetailComponent },
  { path: ':projectId', loadChildren: () => import('../builder-admin-project/builder-admin-project.module').then(m => m.BuilderAdminProjectModule) },
  { path: ':projectId/edit', component: StepperComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {

}
