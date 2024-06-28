import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { CONSTANT } from 'src/app/constants';
import { ResModel } from 'src/app/models/res.model';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';
 
import { MatDialog } from '@angular/material/dialog';
import { WorksheetService } from '../../agent-admin-worksheet.service';
import { AgentAdminWorksheetModalComponent } from '../agent-admin-worksheet-modal/agent-admin-worksheet-modal.component';
 


@Component({
  selector: 'app-agent-admin-worksheets',
  templateUrl: './agent-admin-worksheets.component.html',
  styleUrls: ['./agent-admin-worksheets.component.scss']
})
export class AgentAdminWorksheetsComponent implements OnInit {

  isProgressing!: boolean;
  worksheets: ResModel<Array<any>> = new ResModel({ data: [], size: 10 });
  public userDetail = CONSTANT.getUser();
  public isAgent = this.userDetail.role == 'Agent' ? true : false;
  public isBuilder = this.userDetail.role == 'Builder' ? true : false;


  sort = {
    query: '',
    isAsc: false,
    orderBy: 'CreatedDate',
    items: [
      { name: 'Worksheet (asc)', val: true, key: 'worksheet' },
      { name: 'Worksheet (desc)', val: false, key: 'worksheet' },
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
        this.sort.orderBy = 'Worksheet';
      }
      this.getWorksheets();
      // this.builders.data?.sort(this.dynamicSort(item.val))
    }
  }

  constructor(private worksheetService: WorksheetService,
    private snackbarWrapperService: SnackbarWrapperService,
    public dialog: MatDialog,
    private searchBarService: SearchBarService) {
    this.getWorksheets();
  }

  ngOnInit(): void {
  }

  openDialog(worksheet: any) {
    // const dialogRef = 
    this.dialog.open(AgentAdminWorksheetModalComponent, {
      width: '90vw',
      maxWidth: '99vw',
      disableClose: true,
      data: worksheet
    });
    // let sub = dialogRef.afterClosed().subscribe(val => {
    //   if (val) {

    //   }
    //   sub.unsubscribe();
    // })
  }

  onPageChange(e: PageEvent) {
    this.worksheets.page = e.pageIndex + 1;
    this.worksheets.size = e.pageSize;
    this.getWorksheets();
  }

  

  getWorksheets() {
    this.isProgressing = true;
    const user = CONSTANT.getUser();
    let params: any = {
      page: this.worksheets.page,
      size: this.worksheets.size,
      OrderBy: this.sort.orderBy,
      IsAsc: this.sort.isAsc,
      loginId: user.userName || user?.email
    };
    // if (this.sort.query) {
    //   params = { ...params, FilterBy: 'fullName', FilterValue: this.sort.query }
    // }
    this.worksheetService.worksheets(params).subscribe(worksheets => {
      console.log(worksheets);
      this.worksheets = worksheets;
      this.worksheets.data?.forEach(i => {
        i['projectWorkSheetPurchaserNames'] = i?.projectWorkSheetPurchasers?.map((i: any) => i.fullName).join(', ');
        if (i?.projectWorkSheetPurchasers?.length) {
          i?.projectWorkSheetPurchasers.forEach((pp: any) => {
            pp['fullAddress'] = [pp?.address, pp?.province, pp?.city, pp?.country, pp?.zipCode].filter(item => item).join(', ');
          })
        }
      })
      //this.sort.select(this.sort.items[0])
      // this.searchBarService.toggleSearchBar.emit({ enabled: true, items: this.worksheets.data ?? [], nameKey: 'fullNAME', valKey: 'agentId', url: '/griddo-master/agents/${valKey}', placeholder: 'Search agents by name' });
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
}
