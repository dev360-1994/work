import { Component, OnInit } from '@angular/core';
import { CONSTANT } from 'src/app/constants';
import { ResModel } from 'src/app/models/res.model';
import { User } from 'src/app/models/user.model';
import { BuilderDashboardService } from 'src/app/modules/builder-admin/components/builder-dashboard/builder-dashboard.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-builder-dashboard',
  templateUrl: './builder-dashboard.component.html',
  styleUrls: ['./builder-dashboard.component.scss']
})
export class BuilderDashboardComponent implements OnInit {

  public isProgressing = false;
  public builderDashboardDetails:any;
  user: User = CONSTANT.getUser();

  constructor(
    private builderDashboardService:BuilderDashboardService,
    ) {
      this.getBuilderDashboard();
    }

  ngOnInit(): void {
    if(this.user!=null){
      localStorage.setItem("id",(this.user.id).toString());
      };
  }

  getBuilderDashboard() {
    this.isProgressing = true;
    this.builderDashboardService.getBuilderDashboard(this.user.id).subscribe(res => {
    this.builderDashboardDetails = res;
    this.isProgressing = false;
    },
      err => {
        this.isProgressing = false;
      });
  }

}
