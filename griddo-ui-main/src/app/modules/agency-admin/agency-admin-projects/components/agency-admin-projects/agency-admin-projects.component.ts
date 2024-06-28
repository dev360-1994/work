import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from 'src/app/models/project.model';
import { ResModel } from 'src/app/models/res.model';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';

@Component({
  selector: 'app-agency-admin-projects',
  templateUrl: './agency-admin-projects.component.html',
  styleUrls: ['./agency-admin-projects.component.scss']
})
export class AgencyAdminProjectsComponent implements OnInit, OnDestroy {
  projectList: Project[] = [];

  page = 1;
  pageSize = 100;
  onErrorImg = `https://st3.depositphotos.com/5040187/19001/v/600/depositphotos_190011616-stock-illustration-logo-swoosh-ellipse-blue-letter.jpg`;
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
    isAsc: 'asc',
    orderBy: 'projectName',
    items: [
      { name: 'Alphabetical (asc)', val: 'asc' },
      { name: 'Alphabetical (desc)', val: 'desc' }
    ],
    selected: 'Alphabetical (asc)',
    select: (item: any) => {
      this.sort.isAsc = item.val
      this.sort.selected = item.name;
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
    let params: any = { page: this.project.page, size: this.project.size, orderbyColumnName: this.sort.orderBy, isAscending: this.sort.isAsc, isContains: false, filterBy: '', filterValue: '' };
    if (this.sort.query) {
      params = { ...params, filterBy: 'fullName', filterValue: this.sort.query, isContains: true }
    }
    this._projectService.projects(params).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
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

  // ngOnDestroy() {

  //   this.searchBarService.toggleSearchBar.emit({ enabled: false, items: [], nameKey: '', valKey: '', url: '', placeholder: '' });
  // }

  onPageChange(e: PageEvent) {

    this.project.page = e.pageIndex + 1;
    this.project.size = e.pageSize;
    this.getProjects();
  }

}