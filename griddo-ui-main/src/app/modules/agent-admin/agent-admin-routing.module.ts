import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { sidebarMenu } from '../sidebar/sidebar-menu';
import { WorksheetsModule } from '../worksheets/worksheets.module';
import { AgentAdminWorksheetDealComponent } from './agent-admin-worksheets/components/agent-admin-worksheet-deal/agent-admin-worksheet-deal.component';
import { AgentAdminComponent } from './components/agent-admin/agent-admin.component';
import { AgentDashboardComponent } from './components/agent-dashboard/agent-dashboard.component';

const routes: Routes = [
  {
    path: '', component: AgentAdminComponent, data: { menu: sidebarMenu.agentAdmin },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'worksheets', loadChildren: () => import('../worksheets/worksheets.module').then(m => m.WorksheetsModule) },
      { path: 'deals', component: AgentAdminWorksheetDealComponent },

      { path: 'projects', loadChildren: () => import('./agent-admin-projects/builder-admin-projects.module').then(m => m.BuilderAdminProjectsModule) },
      // { path: 'projects', loadChildren: () => import('../builder-admin-projects/builder-admin-projects.module').then(m => m.BuilderAdminProjectsModule) },
      // { path: 'projects/:projectId', loadChildren: () => import('../builder-admin-project/builder-admin-project.module').then(m => m.BuilderAdminProjectModule) },
      { path: 'projects/:projectId', loadChildren: () => import('./agent-admin-project/agent-admin-project.module').then(m => m.AgentAdminProjectModule) },

      { path: 'builders', loadChildren: () => import('../builder/builder.module').then(m => m.BuilderModule) },
      { path: 'dashboard', component: AgentDashboardComponent }
    ]
  },
  // {
  //   path: 'projects/:projectId', component: AgentAdminComponent, data: { menu: sidebarMenu.agentAdminProjectMenu },
  //   children: [
  //     { path: '', loadChildren: () => import('../agent-admin-project/agent-admin-project.module').then(m => m.AgentAdminProjectModule) }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentAdminRoutingModule { }
