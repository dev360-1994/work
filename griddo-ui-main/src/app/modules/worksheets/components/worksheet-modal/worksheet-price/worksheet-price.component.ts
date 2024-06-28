import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PriceCalculation } from 'src/app/shared/price-calculation';
import { WorksheetService } from '../../../worksheet.service';
import * as cloneDeep from 'lodash/cloneDeep'
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';

@Component({
  selector: 'app-worksheet-price',
  templateUrl: './worksheet-price.component.html',
  styleUrls: ['./worksheet-price.component.scss']
})
export class WorksheetPriceComponent implements OnInit {
  priceTotal: number = 0;
  taxTotal: number = 0;
  taxAmount: number = 0;
  extraUnitPriceArr: any = [];
  //cloneExtraUnitPriceArr: any = [];
  edit!: boolean;
  isPriceStructureUpdated!: boolean;
  cloneWorksheetData: any;

  constructor(public dialogRef: MatDialogRef<WorksheetPriceComponent>,
    @Inject(MAT_DIALOG_DATA) public worksheet: any,
    public dialog: MatDialog, private worksheetService: WorksheetService,
    private snackbarWrapperService: SnackbarWrapperService) {


  }

  ngOnInit() {
    // console.log("worksheet data=>",this.worksheet);
    if (this.worksheet) {
      console.log(this.worksheet);
      this.cloneWorksheetData = cloneDeep(this.worksheet);
      this.calculatePrice();
      //this.cloneExtraUnitPriceArr = cloneDeep(this.extraUnitPriceArr);
      //console.log('before', this.cloneExtraUnitPriceArr);
    }
  }

  changeEditable(isNotEditable: boolean) {
    this.edit = isNotEditable;
    if (this.cloneWorksheetData?.isDisabled != undefined) {
      this.cloneWorksheetData.isDisabled = !isNotEditable;
    }
    if (isNotEditable)
      this.isPriceStructureUpdated = false;
    // this.updateWorksheetPrice();
  }

  updateWorksheetPrice() {

    this.changeEditable(false);

    this.extraUnitPriceArr.forEach(item => {
      this.cloneWorksheetData?.worksheetUnitPrice?.filter(unitPrice => {
        if (item.towerLockerId == unitPrice.towerLockerId || item.towerParkingId == unitPrice.towerParkingId)
          unitPrice.isSelected = item.isSelected
      });
    });

    const data = { worksheetUnitPrice: this.cloneWorksheetData?.worksheetUnitPrice }
    this.worksheetService.updateWorksheetUnitPrice(data).subscribe(res => {
      this.isPriceStructureUpdated = true;
      //this.cloneExtraUnitPriceArr = Object.assign([], this.extraUnitPriceArr);
      this.snackbarWrapperService.open("Unit price is updated");
      this.onClose();
    }, err => {
      this.snackbarWrapperService.open("Error while updating unit price");
    });
  }

  calculatePrice() {
    const priceDetail = PriceCalculation.UnitPriceCalculation(this.cloneWorksheetData);
    this.extraUnitPriceArr = priceDetail.extraUnitPriceArr;
    this.priceTotal = priceDetail.amount;
    this.taxAmount = priceDetail.taxAmount;
    this.taxTotal = priceDetail.taxTotal;
  }

  reCalculatePrice(unitSetting: any, event: any) {
    let isChecked = false;
    if (event?.currentTarget?.checked) {
      isChecked = event?.currentTarget?.checked;
    }

    this.cloneWorksheetData?.unitTower.projectTowerLockers.forEach(item => {
      if (item.towerLockerId === unitSetting.towerLockerId) item.isSelected = isChecked;
    });

    this.cloneWorksheetData?.unitTower.projectTowerParkings.forEach(item => {
      if (item.towerParkingId === unitSetting.towerParkingId) item.isSelected = isChecked;
    });

    this.calculatePrice();
  }

  onClose() {
    if (this.isPriceStructureUpdated || !this.worksheet?.isAgentAssign) {
      this.worksheet = cloneDeep(this.cloneWorksheetData);
      this.dialogRef.close({ status: true, cloneWorksheetData: this.cloneWorksheetData });
    }
    else {
      //console.log('after', this.cloneExtraUnitPriceArr);
      //console.log(this.extraUnitPriceArr);
      this.dialogRef.close({ status: false });
    }
  }
}
