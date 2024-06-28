import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { CONSTANT } from 'src/app/constants';
import { ResModel } from 'src/app/models/res.model';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitDetailModalComponent } from 'src/app/modules/builder-admin-project/components/unit-detail-modal/unit-detail-modal.component';
import { DepositType } from 'src/app/enums/allEnum.enum';
import { WorksheetService } from '../../agent-admin-worksheet.service';

@Component({
  selector: 'app-agent-admin-worksheet-deal',
  templateUrl: './agent-admin-worksheet-deal.component.html',
  styleUrls: ['./agent-admin-worksheet-deal.component.scss']
})
export class AgentAdminWorksheetDealComponent implements OnInit {

  form: FormGroup;
  public projectWorksheetId: number = 0;
  public worksheet: any;
  public projectDeposit: any;
  public projectDepositDetails: any;
  public projectDocumentTemplates: any;
  public projectCommission: any;
  public projectCommissionDetails: any;
  public userDetail = CONSTANT.getUser();
  public isAgent = this.userDetail.role == 'Agent' ? true : false;
  public isBuilder = this.userDetail.role == 'Builder' ? true : false;
  public isProcessing = true;
  public depositId = 0;
  public commissionId = 0;
  public commissionValue = 0;
  public isPriceEditable = false;
  public selectedTemplate = '';
  public flatPrice = 0;
  public flatDetail: any;
  public depositTypeEnum = DepositType;
  isDealEnable = false;

  constructor(private worksheetService: WorksheetService, private projectsService: ProjectsService, public dialog: MatDialog,
    private snackbarWrapperService: SnackbarWrapperService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.projectWorksheetId = +params['worksheetId'];
      this.getWorksheetById();
    });
    this.form = new FormGroup({
      projectWorksheetId: new FormControl(this.projectWorksheetId),
      projectId: new FormControl(null),
      projectDepositId: new FormControl(null),
      projectCommissionId: new FormControl(null),
      projectWorkSheetDeposit: new FormArray([]),
      projectWorkSheetCommission: new FormArray([]),
    });
  }

  ngOnInit(): void {

  }

  get projectWorkSheetDeposit(): FormArray {
    return this.form?.get('projectWorkSheetDeposit') as FormArray;
  }

  get projectWorkSheetCommission(): FormArray {
    return this.form?.get('projectWorkSheetCommission') as FormArray;
  }

  add_projectWorkSheetDeposit(deposit: any) {
    for (let i = 0; i < deposit.length; i++) {
      const form = new FormGroup({
        type: new FormControl(deposit[i].typeOfDeposit),
        amount: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
        date: new FormControl(null, [Validators.required]),
        isApprove: new FormControl(false),
        isChequeApprove: new FormControl(false),
        chequeNumber: new FormControl(null, [Validators.required]),
        chequeFile: new FormControl(null, [Validators.required])
      });
      form.get('date')?.valueChanges.subscribe(val => {
        if (val?.toISOString) {
          form.get('date')?.setValue(val.toISOString());
        }
      })
      this.projectWorkSheetDeposit.push(form);
    }
  }

  add_projectWorkSheetCommission(projectCommissionDetails: any) {
    for (let i = 0; i < projectCommissionDetails.length; i++) {
      const form = new FormGroup({
        percentage: new FormControl(projectCommissionDetails[i].percentage),
        amount: new FormControl(projectCommissionDetails[i].amount),
        dueDate: new FormControl(null, [Validators.required]),
        amountPaid: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
        isChequeApprove: new FormControl(false),
        commissionChequeFile: new FormControl(null, [Validators.required]),
        invoiceFile: new FormControl(null, [Validators.required])
      });
      form.get('dueDate')?.valueChanges.subscribe(val => {
        if (val?.toISOString) {
          form.get('dueDate')?.setValue(val.toISOString());
        }
      })
      this.projectWorkSheetCommission.push(form)
    }
  }

  getWorksheetById() {
    this.worksheetService.worksheetByID(this.projectWorksheetId, this.userDetail.userName || this.userDetail?.email).subscribe((worksheet: any) => {
      this.worksheet = worksheet.data;
      this.flatPrice = this.worksheet?.flatPrice;
      this.flatDetail = this.worksheet?.flatDetail;
      this.projectDocumentTemplates = worksheet.data?.project?.projectDocument;
      this.projectDeposit = worksheet.data?.project?.depositStructure;
      //console.log(worksheet.data);
      this.depositId = this.projectDeposit[0]?.projectDepositStructureId;
      this.projectDepositDetails = this.projectDeposit[0]?.projectDepositStructureDetails;

      this.projectCommission = worksheet.data?.project?.projectCommisions?.projectCommisionStructure;
      this.commissionId = this.projectCommission[0]?.projectCommisionStructureId;
      this.commissionValue = this.projectCommission[0]?.commisionValue;
      this.projectCommissionDetails = this.projectCommission[0]?.projectCommisionStructureDetails;

      if (this.projectDepositDetails?.length > 0)
        this.add_projectWorkSheetDeposit(this.projectDepositDetails);

      if (this.projectCommissionDetails?.length > 0)
        this.add_projectWorkSheetCommission(this.projectCommissionDetails);

      this.isProcessing = false;
      //  this.flatNo = this.worksheet.flatNumber;
    });
  }

  generateWorksheetAPS() {
    for (let i = 0; i < this.projectWorkSheetDeposit.controls.length; i++) {
      if (this.form.controls.projectWorkSheetDeposit["controls"][i].controls.chequeFile.value == null) {
        this.snackbarWrapperService.open("Please upload cheque file of Deposit " + (i + 1) + ".");
      }
    }

    for (let i = 0; i < this.projectWorkSheetCommission.controls.length; i++) {
      if (this.form.controls.projectWorkSheetCommission["controls"][i].controls.commissionChequeFile.value == null) {
        this.snackbarWrapperService.open("Please upload cheque file of Commission " + (i + 1) + ".");
      }
      if (this.form.controls.projectWorkSheetCommission["controls"][i].controls.invoiceFile.value == null) {
        this.snackbarWrapperService.open("Please upload invoice file of Commission " + (i + 1) + ".");
      }
    }
    if (this.form.valid) {
      if (this.selectedTemplate == '') {
        this.snackbarWrapperService.open('Please select agreement template.');
        return;
      }
      this.isProcessing = true;
      const data = Object.assign({}, this.form.value);
      const payload = {
        projectWorksheetId: this.projectWorksheetId,
        documentTemplateFile: this.selectedTemplate,
        worksheetDeposits: data?.projectWorkSheetDeposit?.map((i: any) => ({
          ...i,
          projectWorksheetId: this.projectWorksheetId,
          ProjectDepositStructureId: this.depositId
        })),

        worksheetCommissions: data?.projectWorkSheetCommission?.map((i: any) => ({
          ...i,
          projectWorksheetId: this.projectWorksheetId,
          ProjectCommissionStructureId: this.commissionId
        }))
      };

      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key]) {
          if (Array.isArray(payload[key])) {
            if (payload[key].length > 0) {
              payload[key].forEach(function (value: any, index: number) {
                if (value?.email != "" || value?.item != "") {
                  for (var key2 in payload[key][index]) {
                    if (typeof payload[key][index][key2] === "object" && (payload[key][index][key2] instanceof File)) {
                      formData.append(key2 + `[${index}]`, value[key2]);
                    }
                    else {
                      formData.append(key + `[${index}][${key2}]`, value[key2])
                    }
                  }
                }
              });
            }
            else {
              formData.append(key, payload[key])
            }
          }
          else {
            formData.append(key, payload[key])
          }
        }
      });

      // this.worksheetService.generateWorksheetAPSDoc(formData).subscribe(res => {
      //   this.isProcessing = false;
      //   this.snackbarWrapperService.open("Worksheet generated successfully.");
      //   if (res.isSuccess) {
      //     this.router.navigate(['builder-admin/worksheets']);
      //   }
      // });
      this.worksheetService.generateWorksheetAPSDoc(formData).subscribe(res => {
        //console.log(res);
        this.isProcessing = false;
        this.snackbarWrapperService.open("Worksheet generated successfully.");
        if (res.isSuccess) {
          // this.router.navigate(['builder-admin/worksheets']);
          let navigationExtras: NavigationExtras = {
            queryParams: {
              "docuUrl": (<any>res?.data)?.docusignPath
            }
          };
          this.router.navigate(['builder-admin/worksheets/docuSignUpload'], navigationExtras);

        } else {
          this.snackbarWrapperService.open("Worksheet generation failed");
          this.router.navigate(['builder-admin/worksheets']);
        }
      }, err => {
        //console.log("server error")
        this.isProcessing = false;
        this.snackbarWrapperService.open("Worksheet generation failed.");
      });
    } else {
      this.snackbarWrapperService.open("Please fill all fields.");

      for (let i = 0; i < this.form.controls.projectWorkSheetDeposit["controls"].length; i++) {
        if (this.form.controls.projectWorkSheetDeposit["controls"][i].invalid) {
          // this.form.controls.projectWorkSheetPurchasers["controls"][0].controls.markAsTouched();
          Object.keys(this.form.controls.projectWorkSheetDeposit["controls"][i].controls).forEach(field => { // {1}
            const control = this.form.controls.projectWorkSheetDeposit["controls"][i].get(field);            // {2}
            control.markAsTouched({ onlySelf: true });       // {3}
          });

        }
      }

      for (let i = 0; i < this.form.controls.projectWorkSheetCommission["controls"].length; i++) {
        if (this.form.controls.projectWorkSheetCommission["controls"][i].invalid) {
          // this.form.controls.projectWorkSheetPurchasers["controls"][0].controls.markAsTouched();
          Object.keys(this.form.controls.projectWorkSheetCommission["controls"][i].controls).forEach(field => { // {1}
            const control = this.form.controls.projectWorkSheetCommission["controls"][i].get(field);            // {2}
            control.markAsTouched({ onlySelf: true });       // {3}
          });

        }
      }

    }
  }

  onDepositChange(target: any) {
    let index = this.projectDeposit.findIndex(x => x.projectDepositStructureId == target.value);
    this.projectDepositDetails = this.projectDeposit[index]?.projectDepositStructureDetails;
    this.depositId = this.projectDeposit[index]?.projectDepositStructureId;
    this.projectWorkSheetDeposit.clear();
    if (this.projectDepositDetails.length > 0)
      this.add_projectWorkSheetDeposit(this.projectDepositDetails);
  }

  onCommissionChange(target: any) {
    let index = this.projectCommission.findIndex(x => x.projectCommisionStructureId == target.value);
    this.projectCommissionDetails = this.projectCommission[index]?.projectDepositStructureDetails;
    this.commissionId = this.projectCommission[index]?.projectCommisionStructureId;
    this.commissionValue = this.projectCommission[index]?.commisionValue;
    this.projectWorkSheetCommission.clear();
    if (this.projectCommissionDetails.length > 0)
      this.add_projectWorkSheetCommission(this.projectCommissionDetails.length);
  }

  toggleApproveStatus(event: any, index: number, control: string) {
    (this.projectWorkSheetDeposit?.controls[index] as FormGroup).controls[control].setValue(event?.checked);
    this.isDealEnable = true;
    this.projectWorkSheetDeposit.controls.forEach((element: any, index) => {
      console.log(element.controls.isChequeApprove.value);
      if (!element.controls.isChequeApprove.value) {
        this.isDealEnable = false;
      }
    });
  }

  toggleChequeApproveStatus(event: any, index: number, control: string) {
    (this.projectWorkSheetCommission?.controls[index] as FormGroup).controls[control].setValue(event?.checked);
  }

  onChequeChange(event, index) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.projectWorkSheetDeposit.at(index)?.get("chequeFile")?.patchValue(file)
      //console.log(this.projectWorkSheetDeposit.value);
    }
  }

  onCommissionChequeChange(event, index) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.projectWorkSheetCommission.at(index)?.get("commissionChequeFile")?.patchValue(file)
      //console.log(this.projectWorkSheetDeposit.value);
    }
  }

  onCommissionInvoiceChange(event, index) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.projectWorkSheetCommission.at(index)?.get("invoiceFile")?.patchValue(file)
      //console.log(this.projectWorkSheetDeposit.value);
    }
  }

  editPrice(isEditable) {
    this.isPriceEditable = isEditable;
    if (!isEditable) {
      this.worksheet.flatPrice = this.flatPrice;
    }

  }

  updateFlatPrice() {
    const obj = { flatId: this.worksheet.flatId, flatPrice: this.worksheet.flatPrice };
    this.projectsService.updateFlatDetail(obj).subscribe(res => {
      this.isPriceEditable = false;
    }, err => {
      this.snackbarWrapperService.open("Error");
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(UnitDetailModalComponent, {
      width: '90vw',
      maxWidth: '99vw',
      disableClose: true,
      data: this.flatDetail
    });
  }
}