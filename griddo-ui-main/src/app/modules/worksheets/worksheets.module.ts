import { NgModule } from '@angular/core';
import { WorksheetsComponent } from './components/worksheets/worksheets.component';
import { EditWorksheetComponent } from './components/edit-worksheet/edit-worksheet.component';
import { WorksheetModalComponent } from './components/worksheet-modal/worksheet-modal.component';
import { WorksheetsRoutingModule } from './worksheets-routing.module';
import { WorksheetViewComponent } from './components/worksheet-view/worksheet-view.component';
import { WorksheetDealComponent } from './components/worksheet-deal/worksheet-deal.component';
import { SharedModule } from 'src/app/shared/shared-module/shared-module.module';
import { AddPurchaserModalComponent } from './components/add-purchaser-modal/add-purchaser-modal.component';
import { ConfirmModalComponent } from 'src/app/common/components/confirm-modal/confirm-modal.component';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { ScheduleModalComponent } from '../deal/components/schedule-modal/schedule-modal.component';
import { SafePipeModule } from 'src/app/pipes/safe-pipe/safe.pipe.module';

@NgModule({
  declarations: [
    WorksheetsComponent,
    EditWorksheetComponent,
    WorksheetModalComponent,
    WorksheetViewComponent,
    WorksheetDealComponent,
    ConfirmModalComponent,
    AddPurchaserModalComponent,
    ScheduleModalComponent
  ],
  imports: [
    SharedModule,
    SelectDropDownModule,
    WorksheetsRoutingModule,
    SafePipeModule
  ]
})
export class WorksheetsModule { }
