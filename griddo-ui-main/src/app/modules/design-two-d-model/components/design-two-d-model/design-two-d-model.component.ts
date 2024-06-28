import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ProjectModel, ProjectRes, ProjectTower } from 'src/app/modules/sales-grid/components/sales-grid/project-res.model';
declare var jQuery: any;
@Component({
  selector: 'app-design-two-d-model',
  templateUrl: './design-two-d-model.component.html',
  styleUrls: ['./design-two-d-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DesignTwoDModelComponent implements OnInit, AfterViewInit {

  isProgressing: boolean = true;
  project!: ProjectModel;

  tower!:ProjectTower;

  constructor(private activatedRoute: ActivatedRoute,
    private snackbarWrapperService: SnackbarWrapperService,
    private projectsService: ProjectsService) {
    this.fetchProject();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.initImgMapping();
  }

  initImgMapping() {
    setTimeout(() => {
      (function ($) { $(document).trigger('init'); })(jQuery);
    }, 300);
  }

  showCode() {
    const b = globalThis.showCode();
    console.log('showCode in modal', b)
  }

  fetchProject() {
    const projectId = CONSTANT.find_params_in_activated_route('projectId', this.activatedRoute.snapshot);
    if (projectId) {
      this.isProgressing = true;
      this.projectsService.getProjectDetailBYProjectId(projectId).subscribe(projectRes => {
        this.isProgressing = false;
        if (!projectRes?.isSuccess) {
          this.snackbarWrapperService.open(projectRes?.message || 'something went wrong ! Please try again');
        }
        if (projectRes?.isSuccess) {
          this.project = projectRes?.data;
        }
      }, err => {
        if (err?.error?.error) {
          this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
        } else if (err.message || err?.data?.message) {
          this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
        } else {
          this.snackbarWrapperService.open(JSON.stringify(err));
        }
        this.isProgressing = false;
      });
    } else {
      this.isProgressing = false;
    }
  }




}
