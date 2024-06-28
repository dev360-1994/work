import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyerAdminRoutingModule } from './buyer-admin-routing.module';
import { BuyerAdminComponent } from './components/buyer-admin/buyer-admin.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { BuyerProjectDetailsComponent } from './components/buyer-project-details/buyer-project-details.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentModalComponent } from './components/document-modal/document-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    BuyerAdminComponent,
    BuyerProjectDetailsComponent,
    DocumentModalComponent
  ],
  imports: [
    CommonModule,
    SidebarModule,
    BuyerAdminRoutingModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})
export class BuyerAdminModule { }
