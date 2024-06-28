import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResModel } from 'src/app/models/res.model';
import { FileUploadService } from 'src/app/modules/auth/services/file-upload.service';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';
import { AgentService } from '../../services/agent.service';
import { CONSTANT } from 'src/app/constants';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit, OnDestroy {

  agents: ResModel<Array<any>> = new ResModel({ data: [], size: 100, page: 1 });
  isUploading: boolean = false;
  isProgressing: boolean = false;
  agencyId: number = 0;
  builderId: number = 0;
  userDetail = CONSTANT.getUser();
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
        this.sort.orderBy = 'fullNAME';
      }
      this.getAgents(true, parseInt(this.userDetail.agencyId), parseInt(this.userDetail.builderId));
    }
  }

  constructor(
    private agentService: AgentService,
    private fileUploadService: FileUploadService,
    private snackbarWrapperService: SnackbarWrapperService,
    private searchBarService: SearchBarService, private router: Router

  ) {

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

    if ((localStorage.getItem("agencyId"))) {
      this.agencyId = +(localStorage.getItem("agencyId") ?? 0)
      this.getAgents(false, this.agencyId);
    }
    else if ((localStorage.getItem("builderId") || false)) {
      this.builderId = +(localStorage.getItem("builderId") ?? 0)
      this.getAgents(false, 0, this.builderId);
    }
    else if (this.userDetail.builder) {
      this.getAgents(false, 0, parseInt(this.userDetail.builderId));
    }
    else if (this.userDetail.agency) {
      this.getAgents(false, parseInt(this.userDetail.agencyId), 0);
    }
    else
      this.getAgents(false, 0, 0);

  }

  onPageChange(e: PageEvent) {
    this.agents.page = e.pageIndex + 1;
    this.agents.size = e.pageSize;
    this.getAgents(false, parseInt(this.userDetail.agencyId), parseInt(this.userDetail.builderId));
  }

  enableSearchBar(enabled = true) {
    this.searchBarService.toggleSearchBar.emit({
      enabled,
      filterBy: 'fullNAME',
      placeholder: 'Search agents by name',
      onSearch: (val: string) => {
        this.sort.query = val;
        this.getAgents(true, parseInt(this.userDetail.agencyId), parseInt(this.userDetail.builderId));
      },
    });
  }

  getAgents(skipSearchBar = false, agencyId = 0, builderId = 0) {
    this.isProgressing = true;
    if (skipSearchBar) {
      this.agents = new ResModel({ data: [], size: 100, page: 1 });
    }
    let params: any = { builderId: builderId, agencyId: agencyId, page: this.agents.page, size: this.agents.size, OrderBy: this.sort.orderBy, IsAsc: this.sort.isAsc };
    if (this.sort.query) {
      params = { ...params, FilterBy: 'fullName', FilterValue: this.sort.query }
    }
    this.agentService.agents(params).subscribe(agents => {
      this.agents = agents;
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
  backToAgency() {
    localStorage.removeItem("agencyId");
    this.router.navigate(['griddo-master/listing-agency/', this.agencyId]);
  }
  backToBuilder() {
    localStorage.removeItem("builderId");
    this.router.navigate(['griddo-master/builders/', this.builderId]);
  }
  checkLocalStorage(opcode = 0) {
    if (opcode == 0) {
      return (localStorage.getItem("agencyId") && !localStorage.getItem("agency-admin")) ? true : false;
    }
    if (opcode == 1) {
      return (localStorage.getItem("builderId") && !localStorage.getItem("agency-admin")) ? true : false;
    }
    return false
  }


}
