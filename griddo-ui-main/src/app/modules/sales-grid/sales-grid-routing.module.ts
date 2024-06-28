import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesGridComponent } from './components/sales-grid/sales-grid.component';
import { UnitComponent } from './components/unit/unit.component';

const routes: Routes = [
  { path: '', component: SalesGridComponent },
  { path: 'unit/:unitId/towerId/:towerId', component: UnitComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesGridRoutingModule { }
