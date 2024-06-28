import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { CONSTANT } from "src/app/constants";
import { ResModel } from "src/app/models/res.model";
import { SearchBarService } from "src/app/modules/sidebar/search-bar.service";
import { DealService } from "../../deal.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss']
})
export class DealComponent implements OnInit {

  isProgressing!: boolean;

  deals: ResModel<Array<any>> = new ResModel({ data: [], size: 10 });
  projectId = 0;

  sort = {
    query: '',
    isAsc: false,
    orderBy: 'CreatedDate',
    items: [
      { name: 'Deal (asc)', val: true, key: 'worksheet' },
      { name: 'Deal (desc)', val: false, key: 'worksheet' },
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
      // this.builders.data?.sort(this.dynamicSort(item.val))
    }
  }

  constructor(private dealService: DealService,
    private snackbarWrapperService: SnackbarWrapperService,
    public dialog: MatDialog,
    private searchBarService: SearchBarService, private activatedRoute: ActivatedRoute) {
    //this.getWorksheets();
    this.projectId = CONSTANT.find_params_in_activated_route('projectId', this.activatedRoute.snapshot);
    this.getDeals();
  }

  ngOnInit(): void {
    //throw new Error("Method not implemented.");
  }


  onPageChange(e: PageEvent) {
    this.deals.page = e.pageIndex + 1;
    this.deals.size = e.pageSize;
    this.getDeals();
  }


  getDeals() {
    this.isProgressing = true;
    const user = CONSTANT.getUser();
    let params: any = {
      page: this.deals.page,
      size: this.deals.size,
      OrderBy: this.sort.orderBy,
      IsAsc: this.sort.isAsc,
      loginId: user.userName || user?.email,
      builderId: user?.builderId
    };
    if (this.projectId != 0) {
      params = { ...params, filterBy: 'Projects', projectId: this.projectId }
    }
    // if (this.sort.query) {
    //   params = { ...params, FilterBy: 'fullName', FilterValue: this.sort.query }
    // }
    this.dealService.getDeals(params).subscribe(res => {
      console.log(res);
      this.deals = res;
      this.deals.data?.forEach(i => {
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