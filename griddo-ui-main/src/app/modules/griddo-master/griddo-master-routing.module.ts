import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sidebarMenu } from '../sidebar/sidebar-menu';
import { GriddoMasterComponent } from './griddo-master/griddo-master.component';

const routes: Routes = [
  {
    path: '', component: GriddoMasterComponent, data: { menu: sidebarMenu.griddoMaster },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'builders', loadChildren: () => import('../builder/builder.module').then(m => m.BuilderModule) },
      { path: 'agents', loadChildren: () => import('../agents/agents.module').then(m => m.AgentsModule) },
      { path: 'listing-agency', loadChildren: () => import('../agency/agency.module').then(m => m.AgencyModule) },
      { path: 'projects', loadChildren: () => import('../projects/projects.module').then(m => m.ProjectsModule) },
      { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'design-two-d-model/:projectId', loadChildren: () => import('../design-two-d-model/design-two-d-model.module').then(m => m.DesignTwoDModelModule) }

    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GriddoMasterRoutingModule { }
