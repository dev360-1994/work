import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProjectComponent } from '../projects/components/view-project/view-project.component';
import { sidebarMenu } from '../sidebar/sidebar-menu';
import { BuyerAdminComponent } from './components/buyer-admin/buyer-admin.component';
import { BuyerProjectDetailsComponent } from './components/buyer-project-details/buyer-project-details.component';

const routes: Routes = [
  {
    path: '', component: BuyerAdminComponent, data: { menu: sidebarMenu.buyerAdmin },
    children: [
      { path: ':projectId/details', component: BuyerProjectDetailsComponent },
      { path: 'docuSignUpload', component: ViewProjectComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerAdminRoutingModule { }
