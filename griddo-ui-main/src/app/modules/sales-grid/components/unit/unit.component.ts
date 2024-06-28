import { Component, OnInit } from '@angular/core';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute } from '@angular/router';
import { CONSTANT } from 'src/app/constants';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ProjectUnitFlat } from '../sales-grid/project-res.model';


@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {


  topActions: Array<{ icon: string, title: string }> = [
    {
      icon: 'check_circle',
      title: 'Change Status'
    },
    {
      icon: 'screen_share',
      title: 'Allocate'
    },
    {
      icon: 'description',
      title: 'Create Document'
    },
    {
      icon: 'edit',
      title: 'Get Signatures'
    },
    {
      icon: 'warning',
      title: 'Manage Reconciliations'
    }
  ]
  worksheetNotes: Array<{ id: string, name: string }> = [];
  isProgressing!: boolean;

  // flat!: ProjectUnitFlat;
  flat!: any;
  popup: boolean = false;
  note: any = { name: '', note: '' };
  colors = ["bg-primary", "bg-secondary", "bg-success", "bg-danger", "bg-warning", "bg-dark"];

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private snackbarWrapperService: SnackbarWrapperService,
  ) {

  }

  ngOnInit(): void {
    this.fetchUnitDetail();
    // this.ProjectSalesGridNote();
  }

  getPriceTotal(data: any) {
    let amount = 0;
    amount = data?.flatDetail?.price ?? 0 + data?.flatDetail?.floorPremium ?? 0;
    let taxTotal = data.project.projectTax.reduce((accum, item) => accum + parseInt(item.value), 0)
    if (taxTotal > 0) {
      amount += parseInt(((amount / 100) * taxTotal).toFixed());
    }
    return amount;

  }

  fetchUnitDetail() {
    // console.log("this.activatedRoute", this.activatedRoute);
    const flatId = CONSTANT.find_params_in_activated_route('unitId', this.activatedRoute.snapshot);
    const projectId = CONSTANT.find_params_in_activated_route('projectId', this.activatedRoute.snapshot);
    let towerId = CONSTANT.find_params_in_activated_route('towerId', this.activatedRoute.snapshot);
    // console.log("towerId", towerId)
    if (flatId && projectId) {
      this.isProgressing = true;
      this.projectsService.flatDetailPage(projectId, flatId, towerId).subscribe(res => {
        this.isProgressing = false;
        // if (!res?.isSuccess) {
        //   this.snackbarWrapperService.open(res?.message || 'something went wrong ! Please try again');
        // }
        // if (res?.isSuccess) {
        this.flat = res;
        // console.log("flat", this.flat);
        this.flat['totalPrice'] = this.getPriceTotal(res);
        // }
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
  onSubmit() {

    let obj = { "projectId": this.flat.projectId, "projectFlatId": this.flat.flatDetail.flatId, "note": this.note.note, "name": this.note.name };
    // console.log("note", obj);
    this.projectsService.AddSalesGridNote(obj).subscribe(res => {
      // console.log("res", res);
      this.fetchUnitDetail();
      this.cancel();
    }, err => {
      this.snackbarWrapperService.open("Error");
      this.fetchUnitDetail();
      this.cancel();
    });
  }

  cancel() {
    this.note = { name: '', note: '' };
    this.popup = false;

  }

  // ProjectSalesGridNote() {
  //   this.projectsService.ProjectSalesGridNote().subscribe(res => {
  //     console.log("res", res);
  //     this.cancel();
  //   }, err => {
  //     this.snackbarWrapperService.open("Error");
  //     this.cancel();
  //   });
  // }
}
