import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatProgressBarModule
  ]
})
export class DashboardModule { }
