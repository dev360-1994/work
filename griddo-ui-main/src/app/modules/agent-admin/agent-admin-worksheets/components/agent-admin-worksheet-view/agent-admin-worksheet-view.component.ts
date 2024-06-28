import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants';
import { AgentService } from 'src/app/modules/agents/services/agent.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { WorksheetPriceComponent } from 'src/app/modules/worksheets/components/worksheet-modal/worksheet-price/worksheet-price.component';
import { WorksheetService } from '../../agent-admin-worksheet.service';
import { AgentAdminWorksheetModalComponent } from '../agent-admin-worksheet-modal/agent-admin-worksheet-modal.component';
 

@Component({
  selector: 'app-agent-admin-worksheet-view',
  templateUrl: './agent-admin-worksheet-view.component.html',
  styleUrls: ['./agent-admin-worksheet-view.component.scss']
})
export class AgentAdminWorksheetViewComponent implements OnInit {

  public worksheet: any;
  public projectWorksheetId: number = 0;
  public userDetail: any;
  public showCommentBox: boolean = false;
  public isRejectSelect: boolean = false;
  public flatId: number = 0;
  public flatNo: number = 0;
  public totalPrice: number = 0;
  public agentList: any;
  public agencyList: any;
  public internalAgentList: any = [];
  public isAgent: any;
  public isBuilder: any;
  public agentId = 0;
  public isAgentSelected = false;
  public isInternalAgentSelected = false;
  formdata;

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

  getWorksheetById() {
    this.worksheetService.worksheetByID(this.projectWorksheetId, this.userDetail.userName || this.userDetail?.email).subscribe(worksheet => {
      console.log(worksheet);
      this.worksheet = worksheet.data;
      this.flatNo = this.worksheet.flatNumber;
      this.totalPrice = this.getPriceTotal(worksheet?.data);
    });
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
      var obj = { projectWorksheetId: this.projectWorksheetId, loginId: this.userDetail.userName, IsAgentAssign: true, flatID: this.flatId, agentID: this.agentId }
      this.worksheetService.assignWorksheet(obj).subscribe(res => {
        this.snackbarWrapperService.open("Worksheet assigned to agent.");
        this.getWorksheetById();
      });
    }
  }

  assignBuyerWorksheet() {
    var obj = { projectWorksheetId: this.projectWorksheetId, loginId: this.userDetail.userName, IsBuyerAssign: true }
    this.worksheetService.assignWorksheet(obj).subscribe(res => {
      this.snackbarWrapperService.open("Worksheet assigned to buyer.");
      //this.getWorksheetById();
      this.router.navigate(['agent-admin/worksheets/deal', this.projectWorksheetId]);
    });
  }

  openDealPage() {
    //this.getWorksheetById();
    this.router.navigate(['agent-admin/worksheets/deal', this.projectWorksheetId], { state: { worksheet: this.worksheet } });
  }

  openDialog(worksheet: any) {
    // const dialogRef = 
    const dialogRef = this.dialog.open(AgentAdminWorksheetModalComponent, {
      width: '90vw',
      maxWidth: '99vw',
      disableClose: true,
      data: worksheet
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != true) {
        this.flatNo = result.flatNo;
        this.flatId = result.flatId;
        this.__selectFlatPriceByflatId(result.flatNo).then(res => {
          if(res){
          let f={price: (<any>res).price??0,floorPremium:(<any>res).floorPremium??0 };
          this.worksheet.flatDetail={...this.worksheet.flatDetail,...f}
          this.totalPrice = this.getPriceTotal(this.worksheet);
           
          }
        })
      }
    });
  }

  getAgentList() {
    this.projectsService.getAgentForDropDown().subscribe(res => {
      this.agentList = res.data;
      console.log(res.data);
      // this.getInternalAgentList();
    });
  }

  getAgencyList() {
    this.projectsService.getAgencyForDropDown().subscribe(res => {
      this.agencyList = res.data;
      console.log(res.data);
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
    if (event.target.value != 'null') {
      this.agentId = +event.target.value;
      this.isAgentSelected = true;
    } else{
      this.agentId = 0;
      this.isAgentSelected = false;
    }
  }

  onChangeAgencyId(event) {
    if (event.target.value != 'null') {
      //this.agentId = +event.target.value;
    }
  }

  onChangeInternalAgentId(event) {
    if (event.target.value != 'null') {
      this.agentId = +event.target.value;
      this.isInternalAgentSelected = true;
    } else{
      this.agentId = 0;
      this.isInternalAgentSelected = false;
    }
  }

  onClickSubmit(value) {
    this.formdata.controls.comment.markAsTouched();
    if (this.formdata.valid) {
      if (this.isRejectSelect) {
        console.log(value);
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
  openPriceDialog(worksheet: any) {
    // const dialogRef = 

    const dialogRef = this.dialog.open(WorksheetPriceComponent, {
      width: '50vw',
      maxWidth: '99vw',
      disableClose: false,
      data: worksheet
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != true) {

        // this.flatNo = result.flatNo;
        // this.flatId = result.flatId;

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
  getPriceTotal(data: any) {
    let amount = 0;
    amount = data?.flatDetail?.price + data?.flatDetail?.floorPremium ?? 0;
    let taxTotal = data.project.projectTax.reduce((accum, item) => accum + parseInt(item.value), 0)
    if (taxTotal > 0) {
      amount += parseInt(((amount / 100) * taxTotal).toFixed());
    }
    return amount;

  }
}
