import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants';
import { ResModel } from 'src/app/models/res.model';
import { User } from 'src/app/models/user.model';
//import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
//import { ProjectModel } from 'src/app/modules/sales-grid/components/sales-grid/project-res.model';
import { AgencyDashboardService } from 'src/app/modules/agency-admin/components/agency-dashboard/agency-dashboard.service';


@Component({
  selector: 'app-agency-dashboard',
  templateUrl: './agency-dashboard.component.html',
  styleUrls: ['./agency-dashboard.component.scss']
})
export class AgencyDashboardComponent implements OnInit {

  public isProgressing = false;
  public agencyDashboardDetails:any;
  user: User = CONSTANT.getUser();

  constructor(
    private agencyDashboardService:AgencyDashboardService,
    ) {
      this.getAgencyDashboard();
    }

  ngOnInit(): void {
    if(this.user!=null){
      localStorage.setItem("id",(this.user.id).toString());
      };
  }

  getAgencyDashboard() {
    this.isProgressing = true;
    this.agencyDashboardService.getAgencyDashboard(this.user.id).subscribe(res => {
    this.agencyDashboardDetails = res;
    this.isProgressing = false;
    },
      err => {
        this.isProgressing = false;
      });
  }

}
