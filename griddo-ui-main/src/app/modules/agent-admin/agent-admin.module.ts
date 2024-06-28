import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentAdminRoutingModule } from './agent-admin-routing.module';
import { AgentAdminComponent } from './components/agent-admin/agent-admin.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { AgentDashboardComponent } from './components/agent-dashboard/agent-dashboard.component';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    AgentAdminComponent,
    AgentDashboardComponent
  ],
  imports: [
    CommonModule,
    AgentAdminRoutingModule,
    SidebarModule
  ]
})
export class AgentAdminModule { }
