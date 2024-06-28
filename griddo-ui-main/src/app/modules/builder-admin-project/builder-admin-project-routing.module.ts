import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuilderAdminProjectComponent } from './components/builder-admin-project/builder-admin-project.component';

const routes: Routes = [
  // {
  // path: '', component: BuilderAdminProjectComponent,
  // children: [
  { path: '', component: BuilderAdminProjectComponent },
  // { path: '', redirectTo: 'sales-grid', pathMatch: 'full' },
  { path: 'worksheets', loadChildren: () => import('../worksheets/worksheets.module').then(m => m.WorksheetsModule) },
  { path: 'deals', loadChildren: () => import('../deal/deal.module').then(m => m.DealModule) },
  { path: 'sales-grid', loadChildren: () => import('../sales-grid/sales-grid.module').then(m => m.SalesGridModule) },
  // { path: '**', redirectTo: 'sales-grid', pathMatch: 'full' },
  // ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuilderAdminProjectRoutingModule { }
