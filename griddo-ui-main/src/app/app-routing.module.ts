import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AgentAdminModule } from '../app/modules/agent-admin/agent-admin.module';//./modules/agency-admin/agency-admin.module
 
AgentAdminModule
const routes: Routes = [
  // { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'griddo-master',
    canActivate: [AuthGuard],
    data: { roles: ['masteradmin'] },
    loadChildren: () => import('./modules/griddo-master/griddo-master.module').then(m => m.GriddoMasterModule)
  },
  {
    path: 'builder-admin',
    canActivate: [AuthGuard],
    data: { roles: ['builder'] },
    loadChildren: () => import('./modules/builder-admin/builder-admin.module').then(m => m.BuilderAdminModule)
  },
  {
    path: 'agent-admin',
    canActivate: [AuthGuard],
    data: { roles: ['agent'] },
    loadChildren: () => import('./modules/agent-admin/agent-admin.module').then(m => m.AgentAdminModule)
  },
  {
    path: 'buyer-admin',
    canActivate: [AuthGuard],
    data: { roles: ['buyer'] },
    loadChildren: () => import('./modules/buyer-admin/buyer-admin.module').then(m => m.BuyerAdminModule)
  },
  {
    path: 'agency-admin',  
    canActivate: [AuthGuard],
    data: { roles: ['agency'] },
    loadChildren: () => import('../app/modules/agency-admin/agency-admin.module').then(m => m.AgencyAdminModule)
  },
  {
    path: '',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**', redirectTo: 'griddo-master' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'corrected',
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
