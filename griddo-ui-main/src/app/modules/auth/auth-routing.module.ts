import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from 'src/app/guards/user.guard';
import { AccountVerificationComponent } from './components/account-verification/account-verification.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LandingPanelComponent } from './components/landing-panel/landing-panel.component';
import { LoginComponent } from './components/login/login.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { PasswordChangedSuccessfullyComponent } from './components/password-changed-successfully/password-changed-successfully.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPanelComponent,
    children: [
      { path: '', component: LoginComponent, data: { login: false } },
      { path: 'login', canActivate: [UserGuard], component: LoginComponent, data: { login: true } },
      { path: 'account-verification', component: AccountVerificationComponent },
      { path: 'reset-password', component: ForgotPasswordComponent },
      { path: 'new-password', component: NewPasswordComponent },
      { path: 'password-changed-successfully', component: PasswordChangedSuccessfullyComponent },
      { path: '**', redirectTo: 'login' },
    ],
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
