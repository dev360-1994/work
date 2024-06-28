import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionExpiresComponent } from './session-expires/session-expires.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    SessionExpiresComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [SessionExpiresComponent]
})
export class SessionExpiresModule { }
