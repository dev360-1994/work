import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencyAdminProjectComponent } from './components/agency-admin-project/agency-admin-project.component';
 
const routes: Routes = [
  // {
    // path: '', component: BuilderAdminProjectComponent,
    // children: [
      { path: '', component: AgencyAdminProjectComponent},
      // { path: '', redirectTo: 'sales-grid', pathMatch: 'full' },
      { path: 'worksheets', loadChildren: () => import('../../worksheets/worksheets.module').then(m => m.WorksheetsModule) },
      { path: 'sales-grid', loadChildren: () => import('../../sales-grid/sales-grid.module').then(m => m.SalesGridModule) },
      // { path: '**', redirectTo: 'sales-grid', pathMatch: 'full' },
    // ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyAdminProjectRoutingModule { }
