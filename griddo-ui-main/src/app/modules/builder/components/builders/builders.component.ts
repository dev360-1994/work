import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ResModel } from 'src/app/models/res.model';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';
import { BuilderService } from '../../services/builder.service';

@Component({
  selector: 'app-builders',
  templateUrl: './builders.component.html',
  styleUrls: ['./builders.component.scss']
})
export class BuildersComponent implements OnInit, OnDestroy {



  builders: ResModel<Array<any>> = new ResModel({ data: [], size: 100, page: 1 });
  type: 'card-portrait' | 'card-landscape' = 'card-portrait';


  sort = {
    query: '',
    isAsc: false,
    orderBy: 'CreatedDate',
    items: [
      { name: 'Alphabetical (asc)', val: true },
      { name: 'Alphabetical (desc)', val: false },
      { name: 'Recently Added', val: false, key: 'date' },
      { name: 'Oldest', val: true, key: 'date' }
    ],
    selected: 'Recently Added',
    select: (item: any) => {
      this.sort.isAsc = item.val
      this.sort.selected = item.name;
      if (item.key == 'date') {
        this.sort.orderBy = 'CreatedDate';
      } else {
        this.sort.orderBy = 'companyName';
      }
      this.getBuilders(true);
      // this.builders.data?.sort(this.dynamicSort(item.val))
    }
  }
  isProgressing!: boolean;

  constructor(
    private builderService: BuilderService,
    private searchBarService: SearchBarService,
    private snackbarWrapperService: SnackbarWrapperService,


  ) {
    this.getBuilders();
  }


  ngOnInit(): void {
  }

  /**
 * Function to sort alphabetically an array of objects by some specific key.
 * 
 * @param {String} property Key of the object to sort.
 */
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
      filterBy: 'fullName',
      placeholder: 'Search builders by Builder name',
      onSearch: (val: string) => {
        this.sort.query = val;
        this.getBuilders(true);
      },
      buttons: {
        enabled,
        items: [
          { icon: 'grid_view', val: 'card-portrait', selected: true },
          { icon: 'format_list_bulleted', val: 'card-landscape' }
        ],
        onClick: (val: any) => this.type = val
      }
    });
  }

  getBuilders(skipSearchBar = false) {
    this.isProgressing = true;
    if (skipSearchBar) {
      this.builders = new ResModel({ data: [], size: 100, page: 1 });
    }
    let params: any = { page: this.builders.page, size: this.builders.size, OrderBy: this.sort.orderBy, IsAsc: this.sort.isAsc };
    if (this.sort.query) {
      params = { ...params, FilterBy: 'fullName', FilterValue: this.sort.query }
    }
    this.builderService.builders(params).subscribe(builders => {
      this.builders = builders;
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

  ngOnDestroy() {
    this.enableSearchBar(false)
  }

  onPageChange(e: PageEvent) {
    this.builders.page = e.pageIndex + 1;
    this.builders.size = e.pageSize;
    this.getBuilders();
  }

}
