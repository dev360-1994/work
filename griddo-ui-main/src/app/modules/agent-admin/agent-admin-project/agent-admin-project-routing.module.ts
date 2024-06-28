import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentAdminProjectComponent } from './components/agent-admin-project/agent-admin-project.component';
 
const routes: Routes = [
  // {
    // path: '', component: BuilderAdminProjectComponent,
    // children: [
      { path: '', component: AgentAdminProjectComponent},
      // { path: '', redirectTo: 'sales-grid', pathMatch: 'full' },
      { path: 'worksheets', loadChildren: () => import('../agent-admin-worksheets/agent-admin-worksheets.module').then(m => m.AgentAdminWorksheetsModule) },
      { path: 'sales-grid', loadChildren: () => import('../../sales-grid/sales-grid.module').then(m => m.SalesGridModule) },
      // { path: '**', redirectTo: 'sales-grid', pathMatch: 'full' },
    // ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentAdminProjectRoutingModule { }
