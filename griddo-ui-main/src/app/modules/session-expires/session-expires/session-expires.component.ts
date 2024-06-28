import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CONSTANT } from 'src/app/constants';

@Component({
  selector: 'app-session-expires',
  templateUrl: './session-expires.component.html',
  styleUrls: ['./session-expires.component.scss']
})
export class SessionExpiresComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  logout() { CONSTANT.logout() }

}
