import { Component, OnInit } from '@angular/core';
import { ResModel } from 'src/app/models/res.model';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ProjectModel } from 'src/app/modules/sales-grid/components/sales-grid/project-res.model';
import { environment } from 'src/environments/environment';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {
  public agentDashboard:any;
  counts: Array<{
    title?: string,
    icon?: string,
    link?: string,
    items?: Array<{ val: number | string, status: string }>
  }> = [
      {
        title: 'Projects',
        icon: 'apartment',
        link: '/griddo-master/projects',
        items: [{
          val: 35,
          status: 'Total'
        },
        {
          val: 3,
          status: 'Active'
        },
        {
          val: 3,
          status: 'Inactive'
        },
        {
          val: 14,
          status: 'Sold'
        }]
      },
      {
        title: 'Units',
        icon: 'home',
        link: '/griddo-master/agents',
        items: [{
          val: 402,
          status: 'Total'
        },
        {
          val: 5,
          status: 'Total'
        }, {
          val: 14,
          status: 'Sold'
        }]
      },
      {
        title: '',
        icon: '',
        link: '/griddo-master/projects',
        items: [{
          val: 402,
          status: 'Brokers'
        }
        ]
      },
      {
        title: '',
        icon: '',
        link: '/griddo-master/subscrptions',
        items: [{
          val: '423 days',
          status: 'until subscription ends'
        }]
      }
    ]

  // projects: Array<any> = [1, 2, 3, 4, 5];
  projects: ResModel<Array<ProjectModel>> = new ResModel({ data: [], size: 5, page: 1 });
  isProcessing!: boolean;

  constructor(
    private projectsService: ProjectsService,
    private domSanitizer: DomSanitizer,
    ) {
    this.getProjects();

  }

  ngOnInit(): void {
    this.agentDashboard = this.domSanitizer.bypassSecurityTrustResourceUrl(environment.agentDashboard)
  }

  getProjects(skipSearchBar = false) {
    this.isProcessing = true;
    if (skipSearchBar) {
      this.projects = new ResModel({ data: [], size: 100, page: 1 });
    }
    let params: any = {
      page: this.projects.page, size: this.projects.size,
      orderbyColumnName: 'projectId',
      isAscending: "desc",
      isContains: false, filterBy: '', filterValue: ''
    };
    this.projectsService.projects(params).subscribe(projects => {
      this.projects = projects;
      if (!skipSearchBar) {
        // this.enableSearchBar();
      }
      this.isProcessing = false;
    }, err => {
      this.isProcessing = false;
      if (err?.error?.error) {
        // this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
      } else if (err.message || err?.data?.message) {
        // this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
      } else {
        // this.snackbarWrapperService.open(JSON.stringify(err));
      }

    });
  }

}
