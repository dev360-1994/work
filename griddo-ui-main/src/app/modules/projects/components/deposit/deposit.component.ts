import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { CONSTANT } from 'src/app/constants';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent implements OnInit, OnChanges {
  form!: FormGroup;
  @Input() buildGridVal!: any;
  @Output() formEmitter = new EventEmitter<FormGroup>();
  keydownEvent = CONSTANT.KEY_DOWN_EVENT_PREVENT_ENTER_KEY;
  unitPrice!: number;
  addRowTrack: { [depositIndex: string]: { addRowDisabled: boolean } } = {};
  totalDepositRequiredType = '%';
  totalDepositSubmit = 0;
  totalPercentageSubmit = 0;

  constructor(
    private projectSevice: ProjectsService,
    private snackbarWrapperService: SnackbarWrapperService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.initForm();
    this.form.valueChanges.subscribe((val) => this.formEmitter.emit(this.form));
  }

  ngOnInit(): void { }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.buildGridVal?.currentValue) {
      this.buildGridVal?.projectTower?.some((tower) => {
        return tower?.projectBlocks?.some((block) => {
          return block?.projectFloorDetails?.some((pfd) => {
            return pfd.projectUnitFlats?.some((puf) => {
              if (puf?.price) {
                this.unitPrice = puf?.price;
                (
                  this.form?.get('depositStructure') as FormArray
                )?.controls?.forEach((ds) => {
                  (ds as FormGroup)?.get('amount')?.setValue(this.unitPrice);
                });
                return;
              }
            });
          });
        });
      });
    }
  }

  difference_In_Days(date) {
    let difference_In_Days = 0;
    if (date) {
      var date1 = new Date();
      var date2 = new Date(date);
      // To calculate the time difference of two dates
      var difference_In_Time = date2.getTime() - date1.getTime();
      // To calculate the no. of days between two dates
      difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
    }
    return difference_In_Days;
  }

  checkDueOn = (e, key, depositIndex, rowIndex): any => {
    let _days = 0,
      difference_In_Days = 0;
    let days =
      this.form.get(`depositStructure.${depositIndex}.time`)?.value || 0;

    if (key == 'fixedDate') {
      let _date2 = this.form.get(
        `depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.fixedDate`
      )?.value;
      
      if (_date2) {
        if(_date2?.toISOString){
          _date2 = _date2?.toISOString();
        }

        difference_In_Days = this.difference_In_Days(_date2);
        if (difference_In_Days < 0) {
          return this.snackbarWrapperService.open(`Please select Future Fixed Date`);
        }
      }
    }

    if (key == 'datefromAgreement') {
      let _date2 = this.form.get(
        `depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.datefromAgreement`
      )?.value;
      if (_date2) {
        if(_date2?.toISOString){
          _date2 = _date2?.toISOString();
        }
        difference_In_Days = this.difference_In_Days(_date2);
        if (difference_In_Days < 0) {
          return this.snackbarWrapperService.open(`Please select Future Agreement Date`);
        }
      }
    }

    // (this.form.get(`depositStructure.${depositIndex}.projectDepositStructureDetails`) as FormArray).controls.forEach(pds => {
    //   switch (pds?.value?.installmentType?.toLowerCase()) {
    //     case 'Days'.toLowerCase():
    //       _days += (pds?.value?.time || 0);
    //       break;
    //     case 'Weeks'.toLowerCase():
    //       _days += ((pds?.value?.time || 0) * 7);
    //       break;
    //     case 'Months'.toLowerCase():
    //       _days += ((pds?.value?.time || 0) * 30);
    //       break;
    //     case 'Occupancy'.toLowerCase():
    //       _days += (pds?.value?.dollarValue || 0)
    //       break;
    //     case 'Fixed Date'.toLowerCase():
    //       if (pds?.value?.fixeddate) {
    //         _days += this.difference_In_Days(pds?.value?.fixeddate)
    //       }
    //       break;
    //     case 'Date from Agreement'.toLowerCase():
    //       if (pds?.value?.datefromAgreement) {
    //         _days += this.difference_In_Days(pds?.value?.datefromAgreement)
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    // });
    // if (_days > days) {
    //   this.snackbarWrapperService.open(`Deposit amount (${_days}) exceeding limit (Total Days ${days || 0})`);
    //   this.form.get(`depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.${key}`)?.setValue(null);
    // }
  };

  initForm() {
    this.form = this.fb.group({
      depositStructure: this.fb.array([]),
    });
  }
  get depositStructureItem(): FormArray {
    return this.form?.get('depositStructure') as FormArray;
  }

  depostDetails(dStructureIndex: number): FormArray {
    return this.depositStructureItem
      .at(dStructureIndex)
      .get('projectDepositStructureDetails') as FormArray;
  }

  calculateTotal_dollor_percentage(depositIndex) {
    let totalDollar = 0;
    let totalPercentage = 0;
    (
      this.form.get(
        `depositStructure.${depositIndex}.projectDepositStructureDetails`
      ) as FormArray
    ).controls.forEach((pds) => {
      switch (pds?.value?.typeOfDeposit) {
        case 1:
        case '1':
          totalPercentage += pds?.value?.percentage || 0;
          break;
        case 2:
        case '2':
          totalDollar += pds?.value?.dollarValue || 0;
          break;
        case 3:
        case '3':
          totalPercentage = pds?.value?.balanceto || 0;
          break;
        default:
          break;
      }
    });

    return { totalDollar, totalPercentage };
  }

  checkTotalUnitPrice = (depositIndex, key?, rowIndex?) => {
    const totalDepositRequiredType =
      this.form.get(`depositStructure.${depositIndex}.totalDepositRequiredType`)?.value || '%';
    const totalDepositRequired =
      this.form.get(`depositStructure.${depositIndex}.totalDepositRequired`)?.value || 0;

    const depositRequiredPercentage =
      totalDepositRequiredType == '%' ? totalDepositRequired : 0;
    const depositRequiredDollor =
      totalDepositRequiredType == '$' ? totalDepositRequired : 0;

    let calculateTotal_dollor_percentage =
      this.calculateTotal_dollor_percentage(depositIndex);
    let { totalDollar, totalPercentage } = calculateTotal_dollor_percentage;

    if (rowIndex >= 0 && key == 'balanceto') {
      const structure = this.depositStructureItem.at(depositIndex)?.value;
      this.totalDepositRequiredType = structure?.totalDepositRequiredType;
      let totalValue = 0;
      structure?.projectDepositStructureDetails.forEach((i, index) => {
        if (index < structure?.projectDepositStructureDetails.length - 1) {
          // if (this.totalDepositRequiredType === '%') {
          totalValue = totalValue + (i?.percentage || i?.balanceto || 0);
          if (i?.typeOfDeposit == '3' && i?.balanceto != 0)
            totalValue = i?.balanceto || 0;
          // } else {
          //   totalValue = totalValue + (i?.dollarValue || (totalDepositRequired * i?.percentage) / 100 ||
          //     (totalDepositRequired * i?.balanceto) / 100 || 0);
          //   if (i?.typeOfDeposit == '3' && i?.balanceto != 0)
          //     totalValue = (totalDepositRequired * i?.balanceto) / 100 || 0;
          // }
        }
      });

      let balanceToValue = this.form.get(`depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.${key}`)?.value;
      let balancetoFoDollar = (totalDepositRequired * balanceToValue) / 100 || 0;
      if (this.totalDepositRequiredType === '%' && totalValue > totalPercentage) {
        this.snackbarWrapperService.open(
          `Balance to (${totalPercentage}) less than limit Percentage value ${totalValue}%`
        );
        this.form
          .get(
            `depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.${key}`
          )
          ?.setValue(0);
      } else if (this.totalDepositRequiredType === '$' && totalValue >= balancetoFoDollar) {
        this.snackbarWrapperService.open(`Balance to (${balanceToValue}) less than deposit value ${totalValue}`);
        this.form.get(`depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.${key}`)?.setValue(0);
      }
    }

    calculateTotal_dollor_percentage =
      this.calculateTotal_dollor_percentage(depositIndex);
    totalDollar = calculateTotal_dollor_percentage.totalDollar;
    totalPercentage = calculateTotal_dollor_percentage.totalPercentage;

    if (this.addRowTrack && this.addRowTrack[depositIndex]) {
      if (totalDepositRequiredType == '$') {
        this.addRowTrack[depositIndex].addRowDisabled =
          totalDollar >= depositRequiredDollor;
      } else {
        this.addRowTrack[depositIndex].addRowDisabled =
          totalPercentage >= depositRequiredPercentage;
      }
    } else {
      if (totalDepositRequiredType == '$') {
        this.addRowTrack[depositIndex] = {
          addRowDisabled: totalDollar >= depositRequiredDollor,
        };
      } else {
        this.addRowTrack[depositIndex] = {
          addRowDisabled: totalPercentage >= depositRequiredPercentage,
        };
      }
    }
  };

  checkDepositStructure = (depositIndex) => {
    const totalDepositRequiredType =
      this.form.get(`depositStructure.${depositIndex}.totalDepositRequiredType`)
        ?.value || '%';
    const totalDepositRequired =
      this.form.get(`depositStructure.${depositIndex}.totalDepositRequired`)
        ?.value || 0;

    const depositRequiredPercentage =
      totalDepositRequiredType == '%' ? totalDepositRequired : 0;
    const depositRequiredDollor =
      totalDepositRequiredType == '$' ? totalDepositRequired : 0;
    if (totalDepositRequiredType == '$') {
      if (depositRequiredDollor < this.totalDepositSubmit) {
        this.snackbarWrapperService.open(
          `Deposit amount (${this.totalDepositSubmit}) exceeding limit (Deposit Required ${depositRequiredDollor})`
        );
        return false;
      }
      if (depositRequiredDollor > this.totalDepositSubmit) {
        this.snackbarWrapperService.open(
          `Deposit amount (${this.totalDepositSubmit}) less than Deposit Required ${depositRequiredDollor}`
        );
        return false;
      }
      return true;
    }

    let calculateTotal_dollor_percentage =
      this.calculateTotal_dollor_percentage(depositIndex);
    let { totalDollar, totalPercentage } = calculateTotal_dollor_percentage;

    let depositStructure = (
      this.form.get(
        `depositStructure.${depositIndex}.projectDepositStructureDetails`
      ) as FormArray
    ).controls;
    if (depositStructure.length > 0) {
      let lastBalanceTo = depositStructure[depositStructure.length - 1];
      let isLastBlanceExist =
        lastBalanceTo.get('typeOfDeposit')?.value === '3' ? true : false;

      if (isLastBlanceExist) {
        if (
          depositRequiredPercentage > lastBalanceTo.get('balanceto')?.value &&
          totalDepositRequiredType == '%'
        ) {
          this.snackbarWrapperService.open(
            `Balance to amount (${lastBalanceTo.get('balanceto')?.value
            }) less than Deposit Required ${depositRequiredPercentage}%`
          );
          return false;
          //this.form.get(`depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.${key}`)?.setValue(0);
        }
        if (
          depositRequiredPercentage < lastBalanceTo.get('balanceto')?.value &&
          totalDepositRequiredType == '%'
        ) {
          this.snackbarWrapperService.open(
            `Balance to amount (${lastBalanceTo.get('balanceto')?.value
            }) exceeding limit (Deposit Required ${depositRequiredPercentage}%)`
          );
          return false;
          //this.form.get(`depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.${key}`)?.setValue(0);
        }
      }
    }

    if (
      totalPercentage > depositRequiredPercentage &&
      totalDepositRequiredType == '%'
    ) {
      this.snackbarWrapperService.open(
        `Deposit amount (${totalPercentage}) exceeding limit (Deposit Required ${depositRequiredPercentage}%)`
      );
      return false;
      //this.form.get(`depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.${key}`)?.setValue(0);
    }
    if (
      totalDollar > depositRequiredDollor &&
      totalDepositRequiredType == '$'
    ) {
      this.snackbarWrapperService.open(
        `Deposit amount (${totalDollar}) exceeding limit (Fixed Dollar Value ${depositRequiredDollor})`
      );
      return false;
      //this.form.get(`depositStructure.${depositIndex}.projectDepositStructureDetails.${rowIndex}.${key}`)?.setValue(0);
    }

    if (
      totalPercentage < depositRequiredPercentage &&
      totalDepositRequiredType == '%'
    ) {
      this.snackbarWrapperService.open(
        `Deposit amount (${totalPercentage}) less than Deposit Required ${depositRequiredPercentage}%`
      );
      return false;
    }
    if (
      totalDollar < depositRequiredDollor &&
      totalDepositRequiredType == '$'
    ) {
      this.snackbarWrapperService.open(
        `Deposit amount (${totalDollar}) less than Fixed Dollar Value ${depositRequiredDollor}`
      );
      return false;
    }
    return true;
  };

  newDepositStructure(
    id = 0,
    name = '',
    depositType = 3,
    totalDepositRequiredType = '%',
    description = '',
    projectId = 0,
    totalDepositRequired = null,
    saved = false,
    newval = true
  ): FormGroup {
    const form = new FormGroup({
      projectDepositStructureId: new FormControl(id),
      depositName: new FormControl(name, [Validators.required]),
      description: new FormControl(description),
      depositType: new FormControl(depositType || 3),
      totalDepositRequiredType: new FormControl(
        totalDepositRequiredType || '%'
      ),
      totalDepositRequired: new FormControl(totalDepositRequired || null, [
        Validators.required,
      ]),
      projectid: new FormControl(projectId),
      saved: new FormControl(saved),
      new: new FormControl(newval),
      projectDepositStructureDetails: new FormArray([
        this.newDepositDetails({ typeOfDeposit: '1', order: 0 }),
      ]),
    });

    const indexOfCurrentDeposit = this.depositStructureItem?.length || 0;
    form
      .get('totalDepositRequiredType')
      ?.setValue(form.get('depositType')?.value == 2 ? '$' : '%');

    this.totalDepositRequiredType = '%';

    form.get('totalDepositRequiredType')?.valueChanges.subscribe((val) => {
      (form.get('projectDepositStructureDetails') as FormArray).clear();
      //this.checkTotalUnitPrice(indexOfCurrentDeposit);
      form.get('depositType')?.setValue(val == '$' ? '2' : '1');
      this.totalDepositRequiredType = val;
    });

    form.get('depositType')?.valueChanges.subscribe((val) => {
      //form.get('totalDepositRequiredType')?.setValue(val == 2 ? '$' : '%');
      (form.get('projectDepositStructureDetails') as FormArray).clear();

      // if (val == 1 || val == 2) {
      //   (form.get('projectDepositStructureDetails') as FormArray).push(this.newDepositDetails({ typeOfDeposit: val, order: 0 }));
      // } else if (val == 3) {
      // (form.get('projectDepositStructureDetails') as FormArray).push(this.newDepositDetails({ typeOfDeposit: '2', order: 0 }));
      // (form.get('projectDepositStructureDetails') as FormArray).push(this.newDepositDetails({ typeOfDeposit: '3', order: 1 }));
      // (form.get('projectDepositStructureDetails') as FormArray).push(this.newDepositDetails({ typeOfDeposit: '1', order: 2 }));
      // }
      // this.checkTotalUnitPrice(indexOfCurrentDeposit);
    });

    return form;
  }

  newDepositDetails(obj?: {
    projectDepositStructureId?: number;
    projectId?: number;
    unitType?: string;
    typeOfDeposit?: string;
    amount?: number;
    percentage?: number;
    time?: string;
    dollarValue?: number;
    balanceto?: number;
    fixedDate?: string;
    datefromAgreement?: string;
    dueOn?: string;
    installmentType?: string;
    numOfInstallments?: string;
    order?: number;
  }): FormGroup {
    const form= new FormGroup({
      //projectDepositStructureDetailId: new FormControl(id),
      projectDepositStructureId: new FormControl(
        obj?.projectDepositStructureId || 0
      ), //[projectDepositStructureId]
      projectid: new FormControl(obj?.projectId || 0),
      unitType: new FormControl(obj?.unitType || ''), //[unitType],
      typeOfDeposit: new FormControl(obj?.typeOfDeposit || '1', [
        Validators.required,
      ]), //typeOfDeposit,
      amount: new FormControl(obj?.amount || 0), //amount,
      percentage: new FormControl(obj?.percentage || 0), //percentage,
      time: new FormControl(obj?.time || ''), // time,
      dollarValue: new FormControl(obj?.dollarValue || 0), //dollarValue,
      balanceto: new FormControl(obj?.balanceto || 0), //balanceto,
      fixedDate: new FormControl(obj?.fixedDate || ''), // fixedDate,
      datefromAgreement: new FormControl(obj?.datefromAgreement || ''), //datefromAgreement,
      dueOn: new FormControl(obj?.dueOn || new Date().toISOString()), //[dueOn],
      installmentType: new FormControl(obj?.installmentType || 'Days', [
        Validators.required,
      ]), // [installmentType],
      numOfInstallments: new FormControl(obj?.numOfInstallments || ''), // [numOfInstallments],
      order: new FormControl(obj?.order || 0),
    });


    form.get('fixedDate')?.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        form.get('fixedDate')?.setValue(val.toISOString());
      }
    })

    return form;
  }

  depositDetails(depositStructureIndex: number): FormArray {
    return this.depositStructureItem
      .at(depositStructureIndex)
      .get('projectDepositStructureDetails') as FormArray;
  }

  addDepositeDetails(
    depositStructureIndex: number,
    depositStructureDepositType
  ) {
    // 2,3,1

    // this.depositDetails(depositStructureIndex).push(this.newDepositDetails({ typeOfDeposit: depositStructureDepositType == 2 ? '2' : '1', order: this.depositDetails(depositStructureIndex).length }));
    let typeOfDeposit = 2;
    // if (this.depositDetails(depositStructureIndex).length) {
    //   let values: Array<any> = (this.depositDetails(depositStructureIndex)?.value || []);
    //   const typeOfDeposit_dollor = values.find(v => v.typeOfDeposit == 2);
    //   const typeOfDeposit_balanceto = values.find(v => v.typeOfDeposit == 3);
    //   if (typeOfDeposit_dollor && typeOfDeposit_balanceto) {
    //     typeOfDeposit = 1;
    //   } else if (!typeOfDeposit_dollor && typeOfDeposit_balanceto) {
    //     typeOfDeposit = 2;
    //   } else if (typeOfDeposit_dollor && !typeOfDeposit_balanceto) {
    //     typeOfDeposit = 3;
    //   } else if (!typeOfDeposit_dollor && !typeOfDeposit_balanceto) {
    //     typeOfDeposit = 2;
    //   }
    // }
    if (depositStructureDepositType == '2') {
      typeOfDeposit = 2;
    } else {
      typeOfDeposit = 1;
    }
    // this.depositDetails(depositStructureIndex).push(this.newDepositDetails({ typeOfDeposit: depositStructureDepositType == 2 ? '2' : '1', order: this.depositDetails(depositStructureIndex).length }));
    this.depositDetails(depositStructureIndex).push(
      this.newDepositDetails({
        typeOfDeposit: `${typeOfDeposit}`,
        order: this.depositDetails(depositStructureIndex).length,
      })
    );
  }

  saveDepositeStructure(depositStructureIndex: number, edit = false) {
    if (edit) {
      const structure = this.depositStructureItem.at(
        depositStructureIndex
      )?.value;
      this.totalDepositRequiredType = structure?.totalDepositRequiredType;
      this.getTotal(
        structure?.projectDepositStructureDetails,
        this.totalDepositRequiredType == '$' ? 2 : 1,
        0,
        depositStructureIndex
      );
    }
    const isDepositValid = this.checkDepositStructure(depositStructureIndex);

    if (isDepositValid) {
      // if (!edit) {
      //   const totalDepositRequiredType =
      //     this.form.get(
      //       `depositStructure.${depositStructureIndex}.totalDepositRequiredType`
      //     )?.value || '%';
      //   const totalDepositRequired =
      //     this.form.get(
      //       `depositStructure.${depositStructureIndex}.totalDepositRequired`
      //     )?.value || 0;

      //   const depositRequiredPercentage =
      //     totalDepositRequiredType == '%' ? totalDepositRequired : 0;
      //   const depositRequiredDollor =
      //     totalDepositRequiredType == '$' ? totalDepositRequired : 0;

      //   let calculateTotal_dollor_percentage =
      //     this.calculateTotal_dollor_percentage(depositStructureIndex);
      //   let { totalDollar, totalPercentage } = calculateTotal_dollor_percentage;

      //   if (
      //     totalPercentage < depositRequiredPercentage &&
      //     totalDepositRequiredType == '%'
      //   ) {
      //     return this.snackbarWrapperService.open(
      //       `Deposit amount (${totalPercentage}) less than Deposit Required ${depositRequiredPercentage}%`
      //     );
      //   }
      //   if (
      //     totalDollar < depositRequiredDollor &&
      //     totalDepositRequiredType == '$'
      //   ) {
      //     return this.snackbarWrapperService.open(
      //       `Deposit amount (${totalDollar}) less than Fixed Dollar Value ${depositRequiredDollor}`
      //     );
      //   }
      // }

      if (edit) {
        this.depositStructureItem
          .at(depositStructureIndex)
          ?.get('saved')
          ?.setValue(false);
      } else {
        this.depositStructureItem
          .at(depositStructureIndex)
          ?.get('saved')
          ?.setValue(true);
        this.depositStructureItem
          .at(depositStructureIndex)
          ?.get('new')
          ?.setValue(false);
      }
    }
  }

  getTotal(values: Array<any>, type = 1, s = 0, depositIndex = 0) {
    const lastDepositValue = values[values.length - 1]?.typeOfDeposit;
    const totalDepositRequired =
      this.form.get(`depositStructure.${depositIndex}.totalDepositRequired`)
        ?.value || 0;

    values?.forEach((i) => {
      // if (this.totalDepositRequiredType === '$') {
      //   s =
      //     s +
      //     (i?.dollarValue ||
      //       (totalDepositRequired * i?.percentage) / 100 ||
      //       (totalDepositRequired * i?.balanceto) / 100 ||
      //       0);
      //   if (i?.typeOfDeposit == '3')
      //     s = (totalDepositRequired * i?.balanceto) / 100;

      //   this.totalDepositSubmit = s;
      // } else

      if (type == 2) {
        s = s + (i?.dollarValue || 0);
        this.totalDepositSubmit = s;
      } else if (type == 1) {
        s = s + (i?.percentage || i?.balanceto || 0);
        if (i?.balanceto && i?.typeOfDeposit == '3' && i?.balanceto != 0)
          s = i?.balanceto || 0;

        this.totalPercentageSubmit = s;
      }
    });
    return s;
  }

  closeFormPanel(depositStructureIndex: number) {
    if (
      this.depositStructureItem.at(depositStructureIndex)?.get('new')?.value
    ) {
      this.removeDepositStructure(depositStructureIndex);
    } else {
      this.saveDepositeStructure(depositStructureIndex);
    }
  }

  addDepositStructure() {
    // if (this.depositStructureItem.value.length <= 2)
    this.depositStructureItem.push(this.newDepositStructure());
    //this.newValue();
  }

  removeDepositStructure(depositStructureIndex: number) {
    this.depositStructureItem.removeAt(depositStructureIndex);
    if (this.addRowTrack && this.addRowTrack[depositStructureIndex]) {
      delete this.addRowTrack[depositStructureIndex];
    }
  }

  removeDepositDetails(depositStructureIndex: number, detailIndex: number) {
    this.depositDetails(depositStructureIndex).removeAt(detailIndex);
    this.checkTotalUnitPrice(depositStructureIndex);
  }

  resetValueOnChange(formControl) {
    formControl.get('amount')?.setValue(0);
    formControl.get('percentage')?.setValue(0);
    formControl.get('dollarValue')?.setValue(0);
    formControl.get('balanceto')?.setValue(0);
    formControl.get('fixedDate')?.setValue('');
    formControl.get('datefromAgreement')?.setValue('');
  }

  calulate(depositIndex) {
    let total = 0;
    let dollarTotal = 0;
    let result = this.depositDetails(depositIndex)?.value.filter(
      (x) => x.typeOfDeposit == 'Percentage'
    );
    let dollarResult = this.depositDetails(depositIndex)?.value.filter(
      (x) => x.typeOfDeposit == 'Dollar Value'
    );
    result.forEach((element) => {
      total = total + element.percentage;
    });
    dollarResult.forEach((element) => {
      dollarTotal += element.dollarValue;
    });

    return dollarTotal > 0
      ? total + '%' + '+' + dollarTotal + ' $'
      : total + '%';
  }
}
