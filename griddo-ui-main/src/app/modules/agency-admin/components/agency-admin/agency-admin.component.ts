import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agency-admin',
  templateUrl: './agency-admin.component.html',
  styleUrls: ['./agency-admin.component.scss']
})
export class AgencyAdminComponent implements OnInit {

  constructor() {

  }

  ngOnInit(): void {
    //localStorage.setItem("agencyId",'14');
  }

}
