import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProjectComponent } from '../projects/components/view-project/view-project.component';
import { WorksheetDealComponent } from '../worksheets/components/worksheet-deal/worksheet-deal.component';
import { DealComponent } from './components/deals/deal.component';

const routes: Routes = [
   { path: '', component: DealComponent },
   { path: 'deal/:worksheetId', component: WorksheetDealComponent },
   { path: 'docuSignUpload', component:ViewProjectComponent},
  // { path: 'add', component: EditWorksheetComponent },
  // { path: 'add/:worksheetId', component: EditWorksheetComponent },
  // { path: 'view', component: WorksheetViewComponent },
  // { path: 'view/:worksheetId', component: WorksheetViewComponent },
  // { path: ':id', component: BuilderComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealRoutingModule { }
