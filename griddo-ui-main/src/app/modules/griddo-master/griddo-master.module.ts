import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from '../sidebar/sidebar.module';
import { GriddoMasterRoutingModule } from './griddo-master-routing.module';
import { GriddoMasterComponent } from './griddo-master/griddo-master.component';



@NgModule({
  declarations: [
    GriddoMasterComponent
  ],
  imports: [
    CommonModule,
    GriddoMasterRoutingModule,
    SidebarModule
  ]
})
export class GriddoMasterModule { }
