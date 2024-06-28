import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn:'root'
})
export class SnackbarWrapperService {

  constructor(private snackBar: MatSnackBar) {}
  open = (msg: string) => this.snackBar.open(msg, 'Close');
}
