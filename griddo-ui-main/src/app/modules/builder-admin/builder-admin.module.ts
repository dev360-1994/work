import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuilderAdminRoutingModule } from './builder-admin-routing.module';
import { BuilderAdminComponent } from './components/builder-admin/builder-admin.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { BuilderDashboardComponent } from './components/builder-dashboard/builder-dashboard.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    BuilderAdminComponent,
    BuilderDashboardComponent
  ],
  imports: [
    CommonModule,
    BuilderAdminRoutingModule,
    SidebarModule,
    MatProgressBarModule
  ]
})
export class BuilderAdminModule { }
