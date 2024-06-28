import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAgentComponent } from './components/add-agent/add-agent.component';
import { AgentComponent } from './components/agent/agent.component';
import { AgentsComponent } from './components/agents/agents.component';
const routes: Routes = [
  { path: '', component: AgentsComponent },
  { path: 'add', component: AddAgentComponent },
  { path: 'add/:agentId', component: AgentsComponent },
  { path: ':agentId', component: AgentComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
