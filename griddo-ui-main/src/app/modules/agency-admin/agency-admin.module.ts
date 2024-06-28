import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyDashboardComponent } from './components/agency-dashboard/agency-dashboard.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { AgencyAdminRoutingModule } from './agency-admin-routing.module';
import { AgencyAdminComponent } from './components/agency-admin/agency-admin.component';
 

@NgModule({
  declarations: [
    AgencyAdminComponent,
    AgencyDashboardComponent
  ],
  imports: [
    CommonModule,
    AgencyAdminRoutingModule,
    SidebarModule
  ]
})
export class AgencyAdminModule { }
