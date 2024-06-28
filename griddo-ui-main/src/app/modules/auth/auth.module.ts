import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LandingPanelComponent } from './components/landing-panel/landing-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LogoModule } from '../logo/logo.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SwiperModule } from 'swiper/angular';
import { AccountVerificationComponent } from './components/account-verification/account-verification.component';
import { MatIconModule } from '@angular/material/icon';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PasswordChangedSuccessfullyComponent } from './components/password-changed-successfully/password-changed-successfully.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    LoginComponent,
    LandingPanelComponent,
    AccountVerificationComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    PasswordChangedSuccessfullyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AuthRoutingModule,
    MatIconModule,
    LogoModule,
    MatSnackBarModule,
    SwiperModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ]
})
export class AuthModule { }
