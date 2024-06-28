import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from 'src/app/models/project.model';
import { ResModel } from 'src/app/models/res.model';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';
import { checkNullValueAsStringAndReplaceWithNull, CONSTANT } from 'src/app/constants';
import { ProjectStatus } from 'src/app/enums/projectStatus.enum';

@Component({
  selector: 'app-builder-admin-agents-projects',
  templateUrl: './builder-admin-projects.component.html',
  styleUrls: ['./builder-admin-projects.component.scss']
})
export class BuilderAdminProjectsComponent implements OnInit, OnDestroy {
  projectList: Project[] = [];

  page = 1;
  pageSize = 100;
  onErrorImg = `https://st3.depositphotos.com/5040187/19001/v/600/depositphotos_190011616-stock-illustration-logo-swoosh-ellipse-blue-letter.jpg`;
  projectStatusEnum = ProjectStatus;

  constructor(
    private _projectService: ProjectsService,
    private searchBarService: SearchBarService,
    private snackbarWrapperService: SnackbarWrapperService,
  ) {

  }
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  onError(event: any) {
    event.target.src = this.onErrorImg;
  }
  public ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.enableSearchBar(false);
  }
  ngOnInit(): void {
    this.getProjects();
  }

  project: ResModel<Array<any>> = new ResModel({ data: [], size: 100, page: 1 });

  sort = {
    query: '',
    isAsc: 'desc',
    orderBy: 'CreatedDate',
    userId: CONSTANT.getUser()?.id,
    items: [
      { name: 'Alphabetical (asc)', val: 'asc', key: 'projectName' },
      { name: 'Alphabetical (desc)', val: 'desc', key: 'projectName' },
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
    let params: any = { page: this.project.page, size: this.project.size, orderbyColumnName: this.sort.orderBy, isAscending: this.sort.isAsc, isContains: false, filterBy: '', filterValue: '', userId: this.sort.userId };
    if (this.sort.query) {
      params = { ...params, filterBy: 'projectName', filterValue: this.sort.query, isContains: true }
    }
    this._projectService.projects(params).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      res.data = checkNullValueAsStringAndReplaceWithNull(res.data);
      res.data.forEach(project => {
        project.projectStatus = project?.projectStatus == null ? "" : (this.projectStatusEnum[project?.projectStatus] || '').replace(/([A-Z])/g, ' $1').trim();

        project['soldUnits'] = 0;
        project['totalUnits'] = 0;
        project.projectTower?.forEach(tower => {
          tower?.projectBlocks?.sort((a, b) => { return b.blockNo - a.blockNo });
          tower?.projectBlocks?.forEach(block => {
            block['count'] = `${block?.projectFloorDetails?.length} X ${block?.numberUnitsPerFloor} units | ${block?.projectFloorDetails?.length * block?.numberUnitsPerFloor} units`;
            project['totalUnits'] = project['totalUnits'] + (block?.projectFloorDetails?.length * block?.numberUnitsPerFloor);

            // block?.projectFloorDetails?.sort((a, b) => { return b.floorNo - a.floorNo });
            block?.projectFloorDetails?.forEach(floor => {
              //floor?.projectUnitFlats?.sort((a, b) => { return a.flatNo - b.flatNo });
              floor?.projectUnitFlats?.forEach(flat => {
                if (flat.flatStatus == "Sold" || flat.assignAgentId != 0)
                  project['soldUnits'] = project['soldUnits'] + 1;
                // const indicator = this.indicators?.find(i => i?.title?.toLowerCase() === flat?.flatStatus?.toLowerCase());
                // flat['selected'] = false;
                // flat['floorId'] = floor.floorId;
                // flat['floorNo'] = floor.floorNo;
                // flat['visibilityHidden'] = false;
                // flat['bgColor'] = indicator?.bgColor || (this.indicators.length ? this.indicators[0].bgColor : '')
              })
            })
          })

          project['soldPercentage'] = project['totalUnits'] == 0 ? 0 : Math.ceil((project['soldUnits'] / project['totalUnits']) * 100);
        })
      });

      this.project = res;

      console.log(res);

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

  // ngOnDestroy() {

  //   this.searchBarService.toggleSearchBar.emit({ enabled: false, items: [], nameKey: '', valKey: '', url: '', placeholder: '' });
  // }

  onPageChange(e: PageEvent) {

    this.project.page = e.pageIndex + 1;
    this.project.size = e.pageSize;
    this.getProjects();
  }

}