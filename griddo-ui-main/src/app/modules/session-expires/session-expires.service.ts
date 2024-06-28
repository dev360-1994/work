import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiresComponent } from './session-expires/session-expires.component';

@Injectable({
  providedIn: 'root'
})
export class SessionExpiresService {

  constructor(public dialog: MatDialog) { }

  openDialog() {
    this.dialog.open(SessionExpiresComponent, {
      data: {},
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true,
      panelClass:'bg-color-06'
    });
  }
}
