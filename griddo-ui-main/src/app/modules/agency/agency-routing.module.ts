import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { sidebarMenu } from '../sidebar/sidebar-menu';
import { AddAgencyComponent } from './components/add-agency/add-agency.component';
import { AgencyListingComponent } from './components/agency-listing/agency-listing.component';
import { AgencyComponent } from './components/agency/agency.component';

const routes: Routes = [
  { path: '', component: AgencyListingComponent },
  { path: 'add', component: AddAgencyComponent },
  { path: 'add/:agentId', component: AgencyListingComponent },
  { path: ':agencyId', component: AgencyComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyRoutingModule { }
