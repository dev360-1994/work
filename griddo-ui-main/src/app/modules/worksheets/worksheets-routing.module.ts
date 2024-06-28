import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProjectComponent } from '../projects/components/view-project/view-project.component';
import { EditWorksheetComponent } from './components/edit-worksheet/edit-worksheet.component';
import { WorksheetDealComponent } from './components/worksheet-deal/worksheet-deal.component';
import { WorksheetViewComponent } from './components/worksheet-view/worksheet-view.component';
import { WorksheetsComponent } from './components/worksheets/worksheets.component';
 
const routes: Routes = [
  { path: '', component: WorksheetsComponent },
  { path: 'add', component: EditWorksheetComponent },
  { path: 'add/:worksheetId', component: EditWorksheetComponent },
  { path: 'view', component: WorksheetViewComponent },
  { path: 'view/:worksheetId', component: WorksheetViewComponent },
  { path: 'deal/:worksheetId', component: WorksheetDealComponent },
  // { path: ':id', component: BuilderComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorksheetsRoutingModule { }
