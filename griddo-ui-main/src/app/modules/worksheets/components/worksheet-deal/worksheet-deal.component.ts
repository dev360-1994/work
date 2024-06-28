import { Component, OnInit } from '@angular/core';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { CONSTANT } from 'src/app/constants';
import { MatDialog } from '@angular/material/dialog';
import { WorksheetService } from '../../worksheet.service';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitDetailModalComponent } from 'src/app/modules/builder-admin-project/components/unit-detail-modal/unit-detail-modal.component';
import { DealEnum, DepositType } from 'src/app/enums/allEnum.enum';
import { ScheduleModalComponent } from 'src/app/modules/deal/components/schedule-modal/schedule-modal.component';
import { DatePipe } from '@angular/common';
import { ConfirmModalComponent } from 'src/app/common/components/confirm-modal/confirm-modal.component';
import { WorksheetUnitPrice } from 'src/app/models/worksheet-unit-price.model';
import { PriceCalculation } from 'src/app/shared/price-calculation';
import { WorksheetPriceComponent } from '../worksheet-modal/worksheet-price/worksheet-price.component';
import { Util } from 'src/app/shared/common.utils';

@Component({
  selector: 'app-worksheet-deal',
  templateUrl: './worksheet-deal.component.html',
  styleUrls: ['./worksheet-deal.component.scss']
})
export class WorksheetDealComponent implements OnInit {

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
  public totalDeposit = 0;
  public totalCommission = 0;
  public buyerName = '';
  isCommissionView = false;
  dealStatus: any;
  dealStatusEnum = DealEnum;
  projectDeal: any;
  totalPrice = 0;
  projectDepositType: any;
  depositFlatPrice = 0;
  public bonusStructures: any[] = [];
  worksheetUnitPrice: WorksheetUnitPrice[] = [];
  extraUnitPriceArr: any = [];

  constructor(private worksheetService: WorksheetService, private projectsService: ProjectsService, public dialog: MatDialog,
    private snackbarWrapperService: SnackbarWrapperService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.projectWorksheetId = +params['worksheetId'];
      this.getWorksheetById();
    });
    this.form = new FormGroup({
      projectWorksheetId: new FormControl(this.projectWorksheetId),
      projectId: new FormControl(null),
      projectDepositId: new FormControl(''),
      projectCommissionId: new FormControl(null),
      projectBonusId: new FormControl(null),
      isScheduleLater: new FormControl(null),
      scheduleDate: new FormControl(null),
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

  add_projectWorkSheetDeposit(deposit: any, isDepositExist = false) {
    this.totalDeposit = 0;
    const itrateDepositRows = (rows: Array<any>) => {
      if (!rows?.length) { return }
      for (let i = 0; i < rows.length; i++) {
        let depositType = +rows[i].typeOfDeposit;
        let calculcatedAmount = this.depostCalculation(rows, depositType, i);
        this.totalDeposit += calculcatedAmount;
        const form = new FormGroup({
          type: new FormControl(depositType),
          amount: new FormControl(calculcatedAmount),
          dateOfDeposit: new FormControl(isDepositExist ? rows[i].dateOfDeposit : this.setDateStructure(rows[i]), [Validators.required]),
          typeValue: new FormControl(depositType == 2 ? rows[i].dollarValue : depositType == 1 ? rows[i].percentage : rows[i].balanceto),
          isChequeApprove: new FormControl(isDepositExist ? rows[i].isChequeApprove : null),
          chequeNumber: new FormControl(isDepositExist ? rows[i].chequeNumber != 'null' ? rows[i].chequeNumber : null : null),
          chequeFile: new FormControl(isDepositExist ? rows[i].depositDocumentPath : null),
          depositDocumentPath: new FormControl(isDepositExist ? rows[i].depositDocumentPath : null),
          installmentType: new FormControl(rows[i].installmentType)
        });

        form.get('dateOfDeposit')?.valueChanges.subscribe(val => {
          if (val?.toISOString) {
            form.get('dateOfDeposit')?.setValue(val.toISOString());
          }
        })

        this.projectWorkSheetDeposit.push(form);

        // if (depositType === 2) {
        //   this.totalDeposit += rows[i]?.dollarValue;
        // } else if (depositType === 1) {
        //   this.totalDeposit += (rows[i]?.percentage * this.flatPrice) / 100;
        // } else if (depositType === 3) {
        //   this.totalDeposit += (rows[i]?.balanceto * this.flatPrice) / 100;
        // }
      }
    }
    // itrateDepositRows([...(dollorValues || []),...(balanceToValues || []),...(percentageValues || [])]);
    itrateDepositRows(deposit?.sort((a, b) => (a?.order || 0) - (b?.order || 0)));
  }

  setDateStructure(rowData: any) {
    const date = new Date();
    if (rowData.time == null)
      return null;
    //const date = Util.GetISODate(newDate);
    if (rowData.installmentType?.toLowerCase() == 'signing') {
      return Util.GetISODate(date);
    }
    else if (rowData.installmentType?.toLowerCase() == 'days') {
      date.setDate(date.getDate() + parseInt(rowData.time));
      return Util.GetISODate(date);
    } else if (rowData.installmentType?.toLowerCase() == 'weeks') {
      date.setDate(date.getDate() + (parseInt(rowData.time) * 7));
      return Util.GetISODate(date);
    } else if (rowData.installmentType?.toLowerCase() == 'months') {
      date.setMonth(date.getMonth() + parseInt(rowData.time));
      return Util.GetISODate(date);
    } else if (rowData.installmentType?.toLowerCase() == 'fixed date') {
      return rowData.fixedDate;
    }
    return null;
  }


  depostCalculation(deposit, depositType, index) {
    this.depositFlatPrice = this.flatPrice;
    if (depositType == 2) {
      return deposit[index]?.dollarValue;
    }
    else if (depositType == 1) {
      return ((deposit[index]?.percentage * this.depositFlatPrice) / 100)
    }
    else {
      if (deposit[index]?.balanceto === 0)
        return 0;

      return (((deposit[index]?.balanceto * this.depositFlatPrice) / 100) - this.totalDeposit)
    }
  }

  add_projectWorkSheetCommission(projectCommissionDetails: any, isCommisionExist = false) {
    this.totalCommission = 0;
    for (let i = 0; i < projectCommissionDetails.length; i++) {

      let totalCommission = 0;
      if (projectCommissionDetails[i]?.typeOfDeposit === 2) {
        totalCommission = projectCommissionDetails[i]?.dollarValue;
        this.totalCommission += projectCommissionDetails[i]?.dollarValue;
      } else if (projectCommissionDetails[i]?.typeOfDeposit === 1) {
        totalCommission = (projectCommissionDetails[i]?.percentage * this.flatPrice) / 100;
        this.totalCommission += (projectCommissionDetails[i]?.percentage * this.flatPrice) / 100;
      }

      this.projectWorkSheetCommission.push(new FormGroup({
        percentage: new FormControl(projectCommissionDetails[i].percentage),
        amount: new FormControl(totalCommission),
        dueDate: new FormControl(projectCommissionDetails[i].dueOn),
        amountPaid: new FormControl(isCommisionExist ? projectCommissionDetails[i].amountPaid : 0, [Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]),
        isChequeApprove: new FormControl(false),
        commissionChequeFile: new FormControl(isCommisionExist ? projectCommissionDetails[i].commissionChequePath : null, []),
        commissionChequePath: new FormControl(isCommisionExist ? projectCommissionDetails[i].commissionChequePath : null),
        invoiceFile: new FormControl(isCommisionExist ? projectCommissionDetails[i].commissionInvoicePath : null, []),
        commissionInvoicePath: new FormControl(isCommisionExist ? projectCommissionDetails[i].commissionInvoicePath : null)
      }));
    }

  }

  getWorksheetById() {
    this.worksheetService.worksheetByID(this.projectWorksheetId, this.userDetail.userName || this.userDetail?.email).subscribe((worksheet: any) => {
      this.worksheet = worksheet.data;
      console.log(worksheet.data);
      //this.flatPrice = this.getPriceTotal(worksheet?.data);
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
      this.depositFlatPrice = this.flatPrice;
      this.worksheet?.projectWorkSheetPurchasers?.forEach((item, index) => {
        this.buyerName += item.fullName;
        if (index < (this.worksheet?.projectWorkSheetPurchasers.length - 1))
          this.buyerName += " & ";
      });
      //this.flatPrice = this.worksheet?.flatPrice;
      this.flatDetail = this.worksheet?.flatDetail;
      this.projectDocumentTemplates = worksheet.data?.project?.projectDocument.map(item => {
        if (worksheet.data?.worksheetDocuments?.some(item2 => item.documentId == item2.projectDocumentId)) {
          return {
            documentFilePath: item.documentFilePath,
            documentFileName: item.documentFileName,
            isChecked: true,
            id: item.documentId,
            documentType: item.documentType,
            documentId: item.documentId
          };
        } else {
          return {
            documentFilePath: item.documentFilePath,
            documentFileName: item.documentFileName,
            isChecked: false,
            id: item.documentId,
            documentType: item.documentType,
            documentId: item.documentId
          };
        }
      });
      this.projectDeposit = worksheet.data?.project?.depositStructure;

      this.depositId = 0;//this.projectDeposit[0]?.projectDepositStructureId;
      // this.projectDepositType = this.projectDeposit[0]?.depositType;
      // this.projectDepositDetails = this.projectDeposit[0]?.projectDepositStructureDetails;

      this.projectCommission = worksheet.data?.project?.projectCommisions?.projectCommisionStructure;
      this.commissionId = this.projectCommission[0]?.projectCommisionStructureId;
      this.commissionValue = this.projectCommission[0]?.commisionValue;
      this.projectCommissionDetails = this.projectCommission[0]?.projectCommisionStructureDetails;

      if (worksheet?.data?.projectWorksheetDeal?.projectDepositId > 0) {
        this.depositId = worksheet?.data?.projectWorksheetDeal?.projectDepositId;
        this.setDealData(worksheet?.data?.projectWorksheetDeal);
      }
      else {
        if (this.projectDepositDetails?.length > 0)
          this.add_projectWorkSheetDeposit(this.projectDepositDetails);
      }

      if (worksheet?.data?.projectWorksheetDeal?.projectCommissionId > 0) {
        this.setCommissionData(worksheet?.data?.projectWorksheetDeal);
      } else {

        if (this.projectCommissionDetails?.length > 0) {
          this.add_projectWorkSheetCommission(this.projectCommissionDetails);
          // if (this.projectCommission[0]?.commisionType === 2) {
          //   this.totalCommission += this.commissionValue;
          // } else if (this.projectCommission[0]?.commisionType === 1) {
          //   this.totalCommission += (this.commissionValue * this.worksheet.flatPrice) / 100;
          // }
        }
      }

      this.projectDeal = this.worksheet?.projectWorksheetDeal;
      this.dealStatus = (this.dealStatusEnum[this.projectDeal?.status]).replace(/([A-Z])/g, ' $1').trim();

      this.bonusStructures = worksheet.data?.project?.projectCommisions?.projectCommisionBonus;
      this.setFormValues(worksheet.data);

      this.isProcessing = false;
      //  this.flatNo = this.worksheet.flatNumber;
    });
  }

  setFormValues(worksheetData) {
    let dealData = worksheetData?.projectWorksheetDeal;
    this.form.controls.projectBonusId.patchValue(dealData?.projectBonusId);
  }

  setDealData(projectWorksheetDeal) {
    this.form.controls.projectDepositId.setValue(projectWorksheetDeal?.projectDepositId);
    var depositStructure = this.projectDeposit.find(x => x.projectDepositStructureId == projectWorksheetDeal?.projectDepositId);

    // this.worksheet?.projectWorksheetDeposit?.map(item => {
    //   depositStructure?.projectDepositStructureDetails?.forEach(item2 => {
    //     item.typeOfDeposit = item2.typeOfDeposit;
    //     item.dollarValue = item2.dollarValue;
    //     item.percentage = item2.percentage;
    //     item.balanceto = item2.balanceto;
    //   })
    // });

    for (let i = 0; i < this.worksheet.projectWorksheetDeposit.length; i++) {
      this.worksheet.projectWorksheetDeposit[i].typeOfDeposit = depositStructure?.projectDepositStructureDetails[i].typeOfDeposit;
      this.worksheet.projectWorksheetDeposit[i].dollarValue = depositStructure?.projectDepositStructureDetails[i].dollarValue;
      this.worksheet.projectWorksheetDeposit[i].percentage = depositStructure?.projectDepositStructureDetails[i].percentage;
      this.worksheet.projectWorksheetDeposit[i].balanceto = depositStructure?.projectDepositStructureDetails[i].balanceto;
      this.worksheet.projectWorksheetDeposit[i].installmentType = depositStructure?.projectDepositStructureDetails[i].installmentType;
    }

    //this.previousWorksheetDeposits(this.worksheet?.projectWorksheetDeposit);
    this.add_projectWorkSheetDeposit(this.worksheet?.projectWorksheetDeposit, true);
    this.enableDealButton();
  }

  setCommissionData(projectWorksheetDeal) {
    this.form.controls.projectCommissionId.setValue(projectWorksheetDeal?.projectCommissionId);
    var commissionStructure = this.projectCommission.find(x => x.projectCommisionStructureId == projectWorksheetDeal?.projectCommissionId);

    this.worksheet?.worksheetCommissions?.map(item => {
      commissionStructure?.projectCommisionStructureDetails?.forEach(item2 => {
        item.typeOfDeposit = item2.typeOfDeposit;
        item.dollarValue = item2.dollarValue;
        item.percentage = item2.percentage;
        item.dueOn = item2.dueOn;
      })
    });

    //this.previousWorksheetDeposits(this.worksheet?.projectWorksheetDeposit);
    this.add_projectWorkSheetCommission(this.worksheet?.worksheetCommissions, true);
    //  this.enableDealButton();
  }


  calculatePricing() {
    this.totalDeposit = 0;
    for (let i = 0; i < this.projectDepositDetails.length; i++) {
      if (this.projectDepositDetails[i]?.typeOfDeposit === 2) {
        this.totalDeposit += this.projectDepositDetails[i]?.dollarValue;
      } else if (this.projectDepositDetails[i]?.typeOfDeposit === 1) {
        this.totalDeposit += (this.projectDepositDetails[i]?.percentage * this.worksheet.flatPrice) / 100;
      }
    }

    if (this.projectCommission[0]?.commisionType === 1) {
      this.totalCommission += this.commissionValue;
    } else if (this.projectCommission[0]?.commisionType === 2) {
      this.totalCommission += (this.commissionValue * this.worksheet.flatPrice) / 100;
    }
  }

  generateWorksheetAPS() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);

      if (this.projectDocumentTemplates.filter(item => item.isChecked).length == 0) {
        this.snackbarWrapperService.open('Please select agreement template.');
        return;
      }

      let totalDepositAmount = 0;
      let totalCommissionAmount = 0;

      for (let i = 0; i < this.projectWorkSheetDeposit.controls.length; i++) {
        if (this.form.controls.projectWorkSheetDeposit["controls"][i].controls.amount.value != null) {
          totalDepositAmount += (+this.form.controls.projectWorkSheetDeposit["controls"][i].controls.amount.value);
        }
      }

      if (totalDepositAmount !== this.totalDeposit) {
        this.snackbarWrapperService.open('Deposit amount should be equal to total deposit.');
        return;
      }

      for (let i = 0; i < this.projectWorkSheetCommission.controls.length; i++) {
        if (this.form.controls.projectWorkSheetCommission["controls"][i].controls.amountPaid.value != null) {
          totalCommissionAmount += (+this.form.controls.projectWorkSheetCommission["controls"][i].controls.amountPaid.value);
        }
      }

      // if (totalCommissionAmount !== this.totalCommission) {
      //   this.snackbarWrapperService.open('Commission amount should be equal to total commission.');
      //   return;
      // }


      this.isProcessing = true;

      const payload = {
        projectWorksheetId: this.projectWorksheetId,
        projectWorksheetDepostId: data?.projectDepositId,
        projectWorksheetCommissionId: data?.projectCommissionId,
        projectBonusId: data?.projectBonusId,
        isScheduleLater: data?.isScheduleLater,
        scheduleDate: data?.isScheduleLater ? data?.scheduleDate : new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd HH:mm'),
        documentTemplateFiles: this.projectDocumentTemplates.filter(item => item.isChecked),
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

      console.log(payload);
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
        if (res.isSuccess) {
          // this.router.navigate(['builder-admin/worksheets']);

          if (!data?.isScheduleLater) {

            let navigationExtras: NavigationExtras = {
              queryParams: {
                "docuUrl": (<any>res?.data)?.docusignPath,
                "dealId": this.projectWorksheetId
              }
            };
            this.snackbarWrapperService.open("Deal genereated successfully");
            this.router.navigate(['builder-admin/deals/docuSignUpload'], navigationExtras);
          } else {
            this.snackbarWrapperService.open("Deal scheduled successfully");
            this.router.navigate(['builder-admin/deals']);
          }

        } else {
          this.snackbarWrapperService.open("Worksheet generation failed");
          this.router.navigate(['builder-admin/deals']);
        }
      }, err => {
        //console.log("server error")
        this.isProcessing = false;
        this.snackbarWrapperService.open("Worksheet generation failed");
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
    if (target.value != '0') {
      let index = this.projectDeposit.findIndex(x => x.projectDepositStructureId == (+target.value));
      this.projectDepositDetails = this.projectDeposit[index]?.projectDepositStructureDetails;
      this.depositId = this.projectDeposit[index]?.projectDepositStructureId;
      this.projectDepositType = this.projectDeposit[index]?.depositType;
      this.projectWorkSheetDeposit.clear();
      if (this.projectDepositDetails.length > 0)
        this.add_projectWorkSheetDeposit(this.projectDepositDetails);
    } else {
      this.totalDeposit = 0;
      this.projectWorkSheetDeposit.controls = [];
    }
  }

  onCommissionChange(target: any) {
    let index = this.projectCommission.findIndex(x => x.projectCommisionStructureId == (+target.value));
    this.projectCommissionDetails = this.projectCommission[index]?.projectCommisionStructureDetails;
    this.commissionId = this.projectCommission[index]?.projectCommisionStructureId;
    this.commissionValue = this.projectCommission[index]?.commisionValue;

    if (this.projectCommission[index]?.commisionType === 1) {
      this.totalCommission += this.commissionValue;
    } else if (this.projectCommission[index]?.commisionType === 2) {
      this.totalCommission += (this.commissionValue * this.flatPrice) / 100;
    }

    this.projectWorkSheetCommission.clear();
    if (this.projectCommissionDetails.length > 0)
      this.add_projectWorkSheetCommission(this.projectCommissionDetails);
  }

  toggleApproveStatus(event: any, index: number, control: string) {
    (this.projectWorkSheetDeposit?.controls[index] as FormGroup).controls[control].setValue(event?.checked);
    // this.projectWorkSheetDeposit.controls.forEach((element: any, index) => {
    //   if (!element.controls.isChequeApprove.value) {
    //     this.isDealEnable = false;
    //   }
    // });
    this.enableDealButton();
  }

  enableDealButton() {
    this.isDealEnable = true;
    this.projectWorkSheetDeposit.controls.forEach((element: any, index) => {
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
      //this.worksheet.flatPrice = this.flatPrice;
    }

  }

  updateFlatPrice() {
    const obj = { flatId: this.worksheet.flatId, flatPrice: this.worksheet.flatPrice };
    this.projectsService.updateFlatDetail(obj).subscribe(res => {
      this.isPriceEditable = false;
      this.calculatePricing();
    }, err => {
      this.snackbarWrapperService.open("Error");
    });
  }

  openDialog() {
    this.flatDetail.price = this.worksheet.flatPrice;
    const dialogRef = this.dialog.open(UnitDetailModalComponent, {
      width: '90vw',
      maxWidth: '99vw',
      disableClose: true,
      data: this.flatDetail
    });
  }

  selectMultipleAggreement(event: any) {
    //console.log(this.projectDocumentTemplates.filter(item => item.isChecked));
  }

  checkDepositValidation() {
    if (this.form.controls.projectWorkSheetDeposit.valid) {
      const data = Object.assign({}, this.form.value);

      if (this.projectDocumentTemplates.filter(item => item.isChecked).length == 0) {
        this.snackbarWrapperService.open('Please select agreement template.');
        return;
      }

      let totalDepositAmount = 0;
      let totalCommissionAmount = 0;

      for (let i = 0; i < this.projectWorkSheetDeposit.controls.length; i++) {
        if (this.form.controls.projectWorkSheetDeposit["controls"][i].controls.amount.value != null) {
          totalDepositAmount += (+this.form.controls.projectWorkSheetDeposit["controls"][i].controls.amount.value);
        }
      }

      if (totalDepositAmount !== this.totalDeposit) {
        this.snackbarWrapperService.open('Deposit amount should be equal to total deposit.');
        return;
      }

      this.isCommissionView = true;
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
    }
  }

  checkCommissionValidation(isSchedulLater: boolean) {
    if (this.form.controls.projectWorkSheetCommission.valid) {
      let totalCommissionAmount = 0;

      for (let i = 0; i < this.projectWorkSheetCommission.controls.length; i++) {
        if (this.form.controls.projectWorkSheetCommission["controls"][i].controls.amountPaid.value != null) {
          totalCommissionAmount += (+this.form.controls.projectWorkSheetCommission["controls"][i].controls.amountPaid.value);
        }
      }

      // if (totalCommissionAmount !== this.totalCommission) {
      //   this.snackbarWrapperService.open('Commission amount should be equal to total commission.');
      //   return;
      // }

      if (isSchedulLater) {
        this.openScheduleModal();
      } else {
        this.form.controls.isScheduleLater.setValue(false);
        this.generateWorksheetAPS();
      }

    } else {
      this.snackbarWrapperService.open("Please fill all fields.");

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

  openScheduleModal() {
    const dialogRef = this.dialog.open(ScheduleModalComponent, {
      width: '90vw',
      maxWidth: '40vw',
      disableClose: true,
      data: { heading: "Schedule", content: "" }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.result === true) {
        this.form.controls.isScheduleLater.setValue(true);
        this.form.controls.scheduleDate.setValue(res.data);
        this.generateWorksheetAPS();
      }
    });
  }

  backToDeal() {
    this.isCommissionView = false;
  }

  markAsFirm(id: number) {
    const obj = { dealId: id, status: this.dealStatusEnum.Firm.toString() }
    this.worksheetService.updateDealStatus(obj).subscribe(res => {

      if (res.isSuccess) {
        this.snackbarWrapperService.open('Deal status updated');
        this.router.navigate(['builder-admin/deals']);
      }
    }, err => {
      this.snackbarWrapperService.open('Deal status failed to update');
    });
  }



  cancelDeal(id: number) {

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '90vw',
      maxWidth: '55vw',
      disableClose: true,
      data: { heading: "Cancel Deal", content: "Are you sure, you want to cancel deal?" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const obj = { dealId: id, status: this.dealStatusEnum.Cancelled.toString() }
        this.worksheetService.updateDealStatus(obj).subscribe(res => {

          if (res.isSuccess) {
            this.snackbarWrapperService.open('Deal cancelled succefully');
            this.router.navigate(['builder-admin/deals']);
          }
        }, err => {
          this.snackbarWrapperService.open('Deal status failed to update');
        });
      }
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

  calculatePrice() {
    this.worksheetUnitPrice = [];
    const priceDetail = PriceCalculation.UnitPriceCalculation(this.worksheet);
    this.extraUnitPriceArr = priceDetail.extraUnitPriceArr;
    this.flatPrice = priceDetail.amount;
    this.extraUnitPriceArr.forEach(item => {
      this.worksheetUnitPrice.push({
        WorksheetId: this.worksheet.projectWorkSheetID,
        TowerId: item.projectTowerTowerId,
        TowerLockerId: item.towerLockerId,
        TowerParkingId: item.towerParkingId,
        UnitId: this.worksheet.flatId,
        IsSelected: item.isSelected,
        WorksheetUnitPriceId: 0
      });
    });
  }

  openPriceDialog(worksheet: any) {
    const dialogRef = this.dialog.open(WorksheetPriceComponent, {
      width: '50vw',
      maxWidth: '99vw',
      disableClose: false,
      data: { ...worksheet, isItemVisible: false, isDisabled: true }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {
        this.calculatePrice();
      }
    });
  }
}