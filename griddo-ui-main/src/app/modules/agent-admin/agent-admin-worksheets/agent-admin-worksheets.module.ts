import { NgModule } from '@angular/core';
import { AgentAdminWorksheetsRoutingModule } from './agent-admin-worksheets-routing.module';
import { AgentAdminWorksheetModalComponent } from './components/agent-admin-worksheet-modal/agent-admin-worksheet-modal.component';
import { AgentAdminWorksheetViewComponent } from './components/agent-admin-worksheet-view/agent-admin-worksheet-view.component';
import { AgentAdminWorksheetDealComponent } from './components/agent-admin-worksheet-deal/agent-admin-worksheet-deal.component';
import { EditWorksheetAgentAdminComponent } from './components/edit-worksheet-agent-admin/edit-worksheet-agent-admin.component';
import { AgentAdminWorksheetsComponent } from './components/agent-admin-worksheets/agent-admin-worksheets.component';
import { SharedModule  } from 'src/app/shared/shared-module/shared-module.module';
import { SafePipeModule } from 'src/app/pipes/safe-pipe/safe.pipe.module';

@NgModule({
  declarations: [
    AgentAdminWorksheetsComponent,
    EditWorksheetAgentAdminComponent,
    AgentAdminWorksheetModalComponent,
    AgentAdminWorksheetViewComponent,
    AgentAdminWorksheetDealComponent,
  ],
  imports: [
    SharedModule ,
    AgentAdminWorksheetsRoutingModule,
    SafePipeModule
   
 
  ]
})
export class AgentAdminWorksheetsModule { }
