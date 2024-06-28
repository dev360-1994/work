import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.sevice';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public adminDashoardDetail: any;
  public dashboardProjects: any;
  public activeProjects: any;
  public upcomingProjects: any;
  public builders: any;
  public isProgressing = false;
  public superAdminDashboard:any;
  
  constructor(
    private dashboardService: DashboardService,
    ) {
    this.getAdminDashboard();
  }

  ngOnInit(): void {
  }

  getAdminDashboard() {
    this.isProgressing = true;
    this.dashboardService.getAdminDashboard().subscribe(res => {
      this.adminDashoardDetail = res;
      this.dashboardProjects = res['dashboardProject'];
      this.activeProjects = this.dashboardProjects.projectList.filter(x => x.projectStatus == "1").slice(0,5);
      this.upcomingProjects = this.dashboardProjects.projectList.filter(x => x.projectStatus == "2").slice(0,5);
      this.builders = res['builders'].slice(0,5);
      this.isProgressing = false;
    },
      err => {
        this.isProgressing = false;
      });
  }
}
