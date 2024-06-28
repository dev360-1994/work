import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsModule } from '../projects/projects.module';
import { sidebarMenu } from '../sidebar/sidebar-menu';
import { AgencyAdminComponent } from './components/agency-admin/agency-admin.component';
import { AgencyDashboardComponent } from './components/agency-dashboard/agency-dashboard.component';
 ProjectsModule
const routes: Routes = [
  {
    path: '', component: AgencyAdminComponent, data: { menu: sidebarMenu.agencyAdmin },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
     // { path: 'agents', component:AgencyStaffComponent },
      { path: 'agents',  loadChildren: () => import('../agents/agents.module').then(m => m.AgentsModule)},
      { path: 'agents:agentId',  loadChildren: () => import('../agents/agents.module').then(m => m.AgentsModule) , pathMatch: 'full'},

      { path: 'projects', loadChildren: () => import('../projects/projects.module').then(m => m.ProjectsModule) },
      { path: 'dashboard', component: AgencyDashboardComponent }
    ]
  },
  {
    path: 'projects/:projectId', component: AgencyAdminComponent, data: { menu: sidebarMenu.agencyAdmin },
    children: [
      { path: '', loadChildren: () => import('./agency-admin-project/agency-admin-project.module').then(m => m.AgencyAdminProjectModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyAdminRoutingModule { }
