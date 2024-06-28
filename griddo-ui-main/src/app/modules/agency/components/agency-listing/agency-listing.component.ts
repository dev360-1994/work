import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ResModel } from 'src/app/models/res.model';
import { FileUploadService } from 'src/app/modules/auth/services/file-upload.service';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';
import { AgencyService } from '../../services/agency.service';
import { CONSTANT } from 'src/app/constants';

@Component({
  selector: 'app-agency-listing',
  templateUrl: './agency-listing.component.html',
  styleUrls: ['./agency-listing.component.scss']
})
export class AgencyListingComponent implements OnInit, OnDestroy {

  agency: ResModel<Array<any>> = new ResModel({ data: [], size: 100, page: 1 });
  isUploading: boolean = false;
  isProgressing: boolean = false;
  isBuilder = CONSTANT.getUser()?.role == 'Builder' ? true : false;

  sort = {
    query: '',
    isAsc: false,
    orderBy: 'CreatedDate',
    builderId: CONSTANT.getUser()?.builderId,
    items: [
      { name: 'Alphabetical (asc)', val: true, key: 'name' },
      { name: 'Alphabetical (desc)', val: false, key: 'name' },
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
        this.sort.orderBy = 'fullNAME';
      }
      this.getAgency(true);
    }
  }

  constructor(
    private agencyService: AgencyService,
    private fileUploadService: FileUploadService,
    private snackbarWrapperService: SnackbarWrapperService,
    private searchBarService: SearchBarService

  ) {
    this.getAgency();
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

  ngOnInit(): void {
  }

  onPageChange(e: PageEvent) {
    this.agency.page = e.pageIndex + 1;
    this.agency.size = e.pageSize;
    this.getAgency();
  }

  enableSearchBar(enabled = true) {
    this.searchBarService.toggleSearchBar.emit({
      enabled,
      filterBy: 'fullNAME',
      placeholder: 'Search agency by name',
      onSearch: (val: string) => {
        this.sort.query = val;
        this.getAgency(true);
      },
    });
  }

  getAgency(skipSearchBar = false) {
    this.isProgressing = true;
    if (skipSearchBar) {
      this.agency = new ResModel({ data: [], size: 100, page: 1 });
    }
    let params: any = { page: this.agency.page, size: this.agency.size, OrderBy: this.sort.orderBy, IsAsc: this.sort.isAsc, builderId: this.sort.builderId };
    if (this.sort.query) {
      params = { ...params, FilterBy: 'fullName', FilterValue: this.sort.query }
    }
    this.agencyService.agency(params).subscribe(agency => {
      console.info("agency=>", agency);
      this.agency = agency;
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
  resetFileSelectionBox() {
    const ele: HTMLInputElement = document.getElementById('bulkupload') as HTMLInputElement;
    if (ele) {
      ele.value = '';
    }
  }

  fileChangeEvent(event: any): void {
    if (!event?.target?.files?.length) {
      return this.resetFileSelectionBox();
    }
    const file: File = event?.target?.files[0];
    const ext = file?.name.split('.').pop();
    if (ext?.toLowerCase() === 'csv') {
      this.addByCsv(file);
    } else {
      this.resetFileSelectionBox();
      this.snackbarWrapperService.open('Please only upload csv file!');
    }
    // this.fileName = (event?.target?.files[0] as File).name;
    // this.imageChangedEvent = event;
    // this.openDialog()
  }

  addByCsv(file: File) {
    this.isUploading = true;
    this.fileUploadService.uploadAgentCsv(file).subscribe((res) => {
      this.isUploading = false;
      this.resetFileSelectionBox();
      if (!res?.isSuccess) {
        this.snackbarWrapperService.open(res?.message || 'something went wrong ! Please try again');
      } else {
        window.location.reload();
      }
    }, err => {
      this.isUploading = false;
      if (err?.error?.error) {
        this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
      } else if (err.message || err?.data?.message) {
        this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
      } else {
        this.snackbarWrapperService.open(JSON.stringify(err));
      }
      this.resetFileSelectionBox();
    });
  }

  ngOnDestroy() {
    this.enableSearchBar(false);
  }

}
