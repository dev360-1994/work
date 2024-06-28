import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProjectComponent } from '../../projects/components/view-project/view-project.component';
import { AgentAdminWorksheetDealComponent } from './components/agent-admin-worksheet-deal/agent-admin-worksheet-deal.component';
import { AgentAdminWorksheetViewComponent } from './components/agent-admin-worksheet-view/agent-admin-worksheet-view.component';
import { AgentAdminWorksheetsComponent } from './components/agent-admin-worksheets/agent-admin-worksheets.component';
import { EditWorksheetAgentAdminComponent } from './components/edit-worksheet-agent-admin/edit-worksheet-agent-admin.component';
 
 
const routes: Routes = [
  { path: '', component: AgentAdminWorksheetsComponent },
  { path: 'add', component: EditWorksheetAgentAdminComponent },
  { path: 'add/:worksheetId', component: EditWorksheetAgentAdminComponent },
  { path: 'view', component: AgentAdminWorksheetViewComponent },
  { path: 'view/:worksheetId', component: AgentAdminWorksheetViewComponent },
  { path: 'deal/:worksheetId', component: AgentAdminWorksheetDealComponent },
  { path: 'docuSignUpload', component:ViewProjectComponent},
  // { path: ':id', component: BuilderComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentAdminWorksheetsRoutingModule { }
