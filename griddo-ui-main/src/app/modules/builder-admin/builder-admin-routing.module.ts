import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sidebarMenu } from '../sidebar/sidebar-menu';
import { BuilderAdminComponent } from './components/builder-admin/builder-admin.component';
import { BuilderDashboardComponent } from './components/builder-dashboard/builder-dashboard.component';

const routes: Routes = [
  {
    path: '', component: BuilderAdminComponent, data: { menu: sidebarMenu.builderAdmin },
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'agents', loadChildren: () => import('../agents/agents.module').then(m => m.AgentsModule) },
      { path: 'agents:agentId', loadChildren: () => import('../agents/agents.module').then(m => m.AgentsModule), pathMatch: 'full' },
      { path: 'worksheets', loadChildren: () => import('../worksheets/worksheets.module').then(m => m.WorksheetsModule) },
      { path: 'deals', loadChildren: () => import('../deal/deal.module').then(m => m.DealModule) },

      { path: 'projects', loadChildren: () => import('../builder-admin-projects/builder-admin-projects.module').then(m => m.BuilderAdminProjectsModule) },
      { path: 'dashboard', component: BuilderDashboardComponent },
      { path: 'agency', loadChildren: () => import('../agency/agency.module').then(m => m.AgencyModule) },
      { path: 'listing-agency', loadChildren: () => import('../agency/agency.module').then(m => m.AgencyModule) },
    ]
  },
  {
    path: 'projects/:projectId', component: BuilderAdminComponent, data: { menu: sidebarMenu.builderAdminProjectMenu },
    children: [
      { path: '', loadChildren: () => import('../builder-admin-project/builder-admin-project.module').then(m => m.BuilderAdminProjectModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuilderAdminRoutingModule { }
