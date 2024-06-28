import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectStatus } from 'src/app/enums/projectStatus.enum';
import { checkNullValueAsStringAndReplaceWithNull, CONSTANT } from 'src/app/constants';
import { Project } from 'src/app/models/project.model';
import { ResModel } from 'src/app/models/res.model';
import { User } from 'src/app/models/user.model';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projectList: Project[] = [];
  projectStatusEnum = ProjectStatus;
  page = 1;
  pageSize = 100;
  agencyId = 0;
  user: User = CONSTANT.getUser();
  constructor(
    private _projectService: ProjectsService,
    private searchBarService: SearchBarService,
    private snackbarWrapperService: SnackbarWrapperService,
  ) {

  }
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  public ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.enableSearchBar(false);
  }
  ngOnInit(): void {
    // if ((localStorage.getItem("agencyId")) && this.user != null) {
    //   this.agencyId = +(localStorage.getItem("agencyId") ?? 0)
    //   this.getProjectsByAgency(this.user.id);
    // }
    // else
    this.getProjects();
  }

  project: ResModel<Array<any>> = new ResModel({ data: [], size: 100, page: 1 });

  sort = {
    query: '',
    isAsc: 'desc',
    orderBy: 'CreatedDate',
    items: [
      { name: 'Alphabetical (asc)', val: 'asc', key: 'name' },
      { name: 'Alphabetical (desc)', val: 'desc', key: 'name' },
      { name: 'Recently Added', val: 'desc', key: 'date' },
      { name: 'Oldest', val: 'asc', key: 'date' }
    ],
    selected: 'Recently Added',
    select: (item: any) => {
      this.sort.isAsc = item.val
      this.sort.selected = item.name;
      if (item.key == 'date') {
        this.sort.orderBy = 'CreatedDate';
      } else {
        this.sort.orderBy = 'projectName';
      }
      this.getProjects(true);
    }
  }
  isProgressing!: boolean;







  dynamicSort(property: string) {
    var sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a: any, b: any) {
      if (sortOrder == -1) {
        return b[property]?.localeCompare(a[property]);
      } else {
        return a[property]?.localeCompare(b[property]);
      }
    }
  }

  enableSearchBar(enabled = true) {
    this.searchBarService.toggleSearchBar.emit({
      enabled,
      filterBy: 'projectName',
      placeholder: 'Search Projects  by Project name',
      onSearch: (val: string) => {
        this.sort.query = val;
        this.getProjects(true);
      },
    });
  }

  getProjects(skipSearchBar = false) {
    this.isProgressing = true;
    if (skipSearchBar) {
      this.projectList = [];
      this.page = 1;
      this.pageSize = 100;
      this.project = new ResModel({ data: [], size: 100, page: 1 });

    }
    let params: any = { page: this.project.page, size: this.project.size, orderbyColumnName: this.sort.orderBy, isAscending: this.sort.isAsc, isContains: false, filterBy: '', filterValue: '', userId: CONSTANT.getUser()?.id };
    if (this.sort.query) {
      params = { ...params, filterBy: 'projectName', filterValue: this.sort.query, isContains: true }
    }

    if (this.user?.role?.toLowerCase() === 'agency') {
      params = { ...params, agencyId: this.user.agencyId }
    }
    this._projectService.projects(params).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      res.data = checkNullValueAsStringAndReplaceWithNull(res.data);
      res.data.forEach(project => {
        project.projectStatus = project?.projectStatus == null ? "" : (this.projectStatusEnum[project?.projectStatus])?.replace(/([A-Z])/g, ' $1').trim();

        project['soldUnits'] = 0;
        project['totalUnits'] = 0;
        project.projectTower?.forEach(tower => {

          tower?.projectBlocks?.forEach(block => {
            block['count'] = `${block?.projectFloorDetails?.length} X ${block?.numberUnitsPerFloor} units | ${block?.projectFloorDetails?.length * block?.numberUnitsPerFloor} units`;
            project['totalUnits'] = project['totalUnits'] + (block?.projectFloorDetails?.length * block?.numberUnitsPerFloor);

            block?.projectFloorDetails?.forEach(floor => {

              floor?.projectUnitFlats?.forEach(flat => {
                if (flat.flatStatus == "Sold" || flat.assignAgentId != 0)
                  project['soldUnits'] = project['soldUnits'] + 1;
              })
            })
          })

          project['soldPercentage'] = project['totalUnits'] == 0 ? 0 : Math.ceil((project['soldUnits'] / project['totalUnits']) * 100);
        })
      });

      this.project = res;
      if (!skipSearchBar) {
        this.enableSearchBar();
      }
      this.isProgressing = false;
    }, err => {
      this.isProgressing = false;
      if (err?.error?.error) {
        this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
      } else if (err.message || err?.data?.message) {
        this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
      } else {
        this.snackbarWrapperService.open(JSON.stringify(err));
      }

    });
  }

  getProjectsByAgency(userId: any) {
    this.isProgressing = true;
    this._projectService.getProjectsByAgency(userId).subscribe(projects => {
      this.project = projects;
      this.isProgressing = false;
    }, err => {
      this.isProgressing = false;
      if (err?.error?.error) {
        // this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
      } else if (err.message || err?.data?.message) {
        // this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
      } else {
        // this.snackbarWrapperService.open(JSON.stringify(err));
      }

    });
  }

  // ngOnDestroy() {

  //   this.searchBarService.toggleSearchBar.emit({ enabled: false, items: [], nameKey: '', valKey: '', url: '', placeholder: '' });
  // }

  onPageChange(e: PageEvent) {

    this.project.page = e.pageIndex + 1;
    this.project.size = e.pageSize;
    this.getProjects();
  }
  // showhideButton(){
  //  return (localStorage.getItem("agency-admin"))?false:true;
  // }
}

