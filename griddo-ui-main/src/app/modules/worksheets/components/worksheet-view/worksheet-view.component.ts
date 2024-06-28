import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/common/components/confirm-modal/confirm-modal.component';
import { CONSTANT } from 'src/app/constants';
import { AgentService } from 'src/app/modules/agents/services/agent.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { WorksheetService } from '../../worksheet.service';
import { AddPurchaserModalComponent } from '../add-purchaser-modal/add-purchaser-modal.component';
import { WorksheetModalComponent } from '../worksheet-modal/worksheet-modal.component';
import { WorksheetPriceComponent } from '../worksheet-modal/worksheet-price/worksheet-price.component';
import { PriceCalculation } from 'src/app/shared/price-calculation';
import { WorksheetUnitPrice } from 'src/app/models/worksheet-unit-price.model';

@Component({
  selector: 'app-worksheet-view',
  templateUrl: './worksheet-view.component.html',
  styleUrls: ['./worksheet-view.component.scss']
})
export class WorksheetViewComponent implements OnInit {

  public worksheet: any;
  public projectWorksheetId: number = 0;
  public userDetail: any;
  public showCommentBox: boolean = false;
  public isRejectSelect: boolean = false;
  public flatId: number = 0;
  public flatNo: number = 0;
  public agentList: any;
  public agencyList: any;
  public internalAgentList: any = [];
  public isAgent: any;
  public isBuilder: any;
  public agentId = 0;
  public isAgentSelected = false;
  public isInternalAgentSelected = false;
  formdata;
  isProcessing!: boolean;
  extraUnitPriceArr: any = [];
  worksheetUnitPrice: WorksheetUnitPrice[] = [];

  constructor(private worksheetService: WorksheetService,
    private projectsService: ProjectsService,
    public dialog: MatDialog,
    private snackbarWrapperService: SnackbarWrapperService,
    private route: ActivatedRoute,
    private router: Router,
    private agentService: AgentService) {
    this.route.params.subscribe(params => {
      this.projectWorksheetId = +params['worksheetId'];
    });
    this.worksheetService.getUnitBYProject(this.projectWorksheetId).subscribe(res => {
      console.log(res);
    });
    this.getAgentList();
    this.getAgencyList();
    this.getInternalAgentList();
  }

  ngOnInit(): void {

    const user = CONSTANT.getUser();
    this.userDetail = user;
    this.isAgent = user.role == "Agent" ? true : false;
    this.isBuilder = user.role == "Builder" ? true : false;

    // console.log(history.state)
    // if (history.state.worksheet) {
    //   this.worksheet = history.state.worksheet;
    //   this.projectWorksheetId = this.worksheet.projectWorkSheetID;
    //   this.getWorksheetById();
    // } else {
    this.getWorksheetById();
    //}
    this.formdata = new FormGroup({
      comment: new FormControl("", [Validators.required])
    });
  }
  totalPrice: number = 0;
  getWorksheetById() {
    this.isProcessing = true;
    this.worksheetService.worksheetByID(this.projectWorksheetId, this.userDetail.userName || this.userDetail?.email).subscribe(worksheet => {
      console.log(worksheet);

      this.isProcessing = false;
      this.worksheet = worksheet.data;
      this.worksheet?.worksheetUnitPrice?.forEach(item => {
        this.worksheet?.unitTower?.projectTowerLockers?.map(x => {
          if (x.towerLockerId == item.towerLockerId) {
            x.isSelected = item.isSelected;
          }
        });
        this.worksheet?.unitTower?.projectTowerParkings?.map(x => {
          if (x.towerParkingId == item.towerParkingId) {
            x.isSelected = item.isSelected;
          }
        });
      })
      this.calculatePrice();
      this.flatNo = this.worksheet.flatNumber;
      if (!this.worksheet.isAgentAssign) {
        this.getAgentList();
        this.getAgencyList();
        this.getInternalAgentList();
      }
    });
  }

  getPriceTotal(data: any) {
    console.log(data);
    let amount = 0;
    amount = data?.flatDetail?.price ?? 0 + data?.flatDetail?.floorPremium ?? 0;
    let taxTotal = data.project.projectTax.reduce((accum, item) => accum + parseInt(item.value), 0)
    if (taxTotal > 0) {
      amount += parseInt(((amount / 100) * taxTotal).toFixed());
    }
    return amount;
  }

  enableCommentBox() {
    this.showCommentBox = true;
    this.isRejectSelect = false;
  }

  rejectWorksheet() {
    this.showCommentBox = true;
    if (!this.isRejectSelect) {
      this.snackbarWrapperService.open("Enter Comment first.");
      this.isRejectSelect = true;
    }
  }

  assignAgentWorksheet() {
    if (this.agentId == 0 && !this.worksheet.isAgentAssign) {
      this.snackbarWrapperService.open("Please select agent.");
    } else {
      var obj = { projectWorksheetId: this.projectWorksheetId, loginId: this.userDetail.userName, IsAgentAssign: true, flatID: this.flatId, agentID: this.agentId, worksheetUnitPrice: this.worksheetUnitPrice }
      this.worksheetService.assignWorksheet(obj).subscribe(res => {
        this.snackbarWrapperService.open("Worksheet assigned to agent.");
        this.getWorksheetById();
      });
    }
  }

  assignBuyerWorksheet() {
    if (this.worksheet?.projectWorkSheetPurchasers.length > 0) {
      var obj = { projectWorksheetId: this.projectWorksheetId, loginId: this.userDetail.userName, IsBuyerAssign: true, flatID: this.worksheet.flatId }
      this.worksheetService.assignWorksheet(obj).subscribe(res => {
        this.snackbarWrapperService.open("Worksheet assigned to buyer.");
        //this.getWorksheetById();
        this.router.navigate(['builder-admin/deals']);
      });
    } else {
      this.snackbarWrapperService.open("Please add atleast one purchaser.");
    }
  }

  openDealPage() {
    //this.getWorksheetById();
    this.router.navigate(['builder-admin/worksheets/deal', this.projectWorksheetId], { state: { worksheet: this.worksheet } });
  }

  openDialog(worksheet: any) {
    // const dialogRef = 
    const dialogRef = this.dialog.open(WorksheetModalComponent, {
      width: '90vw',
      maxWidth: '99vw',
      disableClose: true,
      data: worksheet
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {
        this.flatNo = result.flatNo;
        this.flatId = result.flatId;
        this.worksheet.unitTower = result.tower;
        let f = { price: result.flatPrice ?? 0, floorPremium: result.flatPremiumPrice ?? 0 };
        this.worksheet.flatDetail = result.flatDetail;
        this.calculatePrice();
      }
    });
  }

  calculatePrice() {
    this.worksheetUnitPrice = [];
    const priceDetail = PriceCalculation.UnitPriceCalculation(this.worksheet);
    this.extraUnitPriceArr = priceDetail.extraUnitPriceArr;
    this.totalPrice = priceDetail.amount;
    this.extraUnitPriceArr.forEach(item => {
      this.worksheetUnitPrice.push({
        WorksheetId: this.worksheet.projectWorkSheetID,
        TowerId: item.projectTowerTowerId,
        TowerLockerId: item.towerLockerId,
        TowerParkingId: item.towerParkingId,
        UnitId: this.flatId,
        IsSelected: item.isSelected,
        WorksheetUnitPriceId: 0
      });
    });
  }

  openPriceDialog(worksheet: any) {
    const visiblity = this.worksheet?.isAgentAssign ? true : false;
    const dialogRef = this.dialog.open(WorksheetPriceComponent, {
      width: '50vw',
      maxWidth: '99vw',
      disableClose: true,
      data: { ...worksheet, isItemVisible: visiblity, isDisabled: visiblity }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status) {
        this.worksheet = result.cloneWorksheetData;
        this.calculatePrice();
      }
    });
  }

  editPurchaser(purchaser: any) {

    if (purchaser !== undefined) {
      purchaser.projectWorkSheetId = this.projectWorksheetId;
      purchaser.isUpdate = true;
    }
    const dialogRef = this.dialog.open(AddPurchaserModalComponent, {
      width: '90vw',
      maxWidth: '99vw',
      disableClose: true,
      data: purchaser
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWorksheetById();
      }
    });
  }

  confirmDialog(purchaser) {

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '90vw',
      maxWidth: '55vw',
      disableClose: true,
      data: { heading: "Delete Purchaser", content: "Are you sure, you want to delete purchaser?" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.worksheetService.deletePurchaser(purchaser.purchaserId).subscribe(res => {
          this.getWorksheetById();
        }, err => {
          this.snackbarWrapperService.open("Error while deleting purchaser.");
        });
      }
    });
  }


  getAgentList() {
    this.projectsService.getAgentForDropDown().subscribe(res => {
      this.agentList = res.data;
      // this.getInternalAgentList();
    });
  }

  getAgencyList() {
    this.projectsService.getAgencyForDropDown().subscribe(res => {
      this.agencyList = res.data;
    });
  }

  getInternalAgentList() {
    let params: any = { builderId: 25, page: 1, size: 10000, OrderBy: "fullNAME", IsAsc: true };

    this.agentService.agents(params).subscribe((res: any) => {
      res?.data?.forEach(item => {
        this.internalAgentList.push({
          value: item.agentId,
          text: item.firstName + ' ' + item.lastName
        });
      });
    });
  }

  onChangeAgentId(event) {
    if (event?.value?.value != 'null') {
      this.agentId = event?.value?.value;
      this.isAgentSelected = true;
    } else {
      this.agentId = 0;
      this.isAgentSelected = false;
    }
  }

  onChangeAgencyId(event) {
    if (event?.value?.value) {
      //this.agentId = event?.value?.value;
    }
  }

  onChangeInternalAgentId(event) {
    this.agentId = event?.value?.value || 0;
    this.isInternalAgentSelected = event?.value?.value ? true : false;
  }

  onClickSubmit(value) {
    this.formdata.controls.comment.markAsTouched();
    if (this.formdata.valid) {
      if (this.isRejectSelect) {
        this.showCommentBox = true;
        if (!this.isRejectSelect) {
          this.snackbarWrapperService.open("Enter Comment first.");
          this.isRejectSelect = true;
        } else {
          const obj = {
            ProjectWorksheetID: this.projectWorksheetId, LoginID: this.userDetail.userName || this.userDetail?.email,
            Comment: value.comment, IsReject: true
          }
          this.worksheetService.postComment(obj).subscribe(res => {
            this.snackbarWrapperService.open('Worksheet has been rejected.');
            this.router.navigate(['../../'], { relativeTo: this.route });
            //this.getWorksheetById();
          });
        }
      } else {
        const obj = {
          projectWorksheetID: this.projectWorksheetId, loginID: this.userDetail.userName || this.userDetail?.email,
          comment: value.comment, isReject: false
        }
        this.worksheetService.postComment(obj).subscribe(res => {
          this.snackbarWrapperService.open('Comment has been posted.');
        });
      }
    }
  }

  addNewPurchaser() {
    const purchaser = { projectWorkSheetId: this.projectWorksheetId, isUpdate: false };

    const dialogRef = this.dialog.open(AddPurchaserModalComponent, {
      width: '90vw',
      maxWidth: '99vw',
      disableClose: true,
      data: purchaser
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWorksheetById();
      }
    });
  }
  __selectFlatPriceByflatId(flatNo) {
    return new Promise((res, rej) => {
      if (this.worksheet.project.projectTower?.length) {
        this.worksheet.project.projectTower?.forEach(tower => {
          tower?.projectBlocks?.sort((a, b) => { return b.blockNo - a.blockNo });
          tower?.projectBlocks?.forEach(block => {
            block?.projectFloorDetails?.sort((a, b) => { return b.floorNo - a.floorNo });
            block?.projectFloorDetails?.forEach(floor => {
              floor?.projectUnitFlats?.sort((a, b) => { return a.flatNo - b.flatNo });
              floor?.projectUnitFlats?.forEach((flat, index, object) => {
                if (flat.flatNo == flatNo) {
                  res(flat);
                }
              })
            })
          })
        })
      }
      rej("No Flat Available");
    });
  }
}
