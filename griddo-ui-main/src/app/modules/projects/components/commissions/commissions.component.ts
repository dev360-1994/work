import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgModel, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { CONSTANT } from 'src/app/constants';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss']
})
export class CommissionsComponent implements OnInit {

  form !: FormGroup;
  @Input() buildGridVal!: any;

  @Output() formEmitter = new EventEmitter<FormGroup>();
  keydownEvent = CONSTANT.KEY_DOWN_EVENT_PREVENT_ENTER_KEY;

  get projectCommisionStructure(): FormArray {
    return this.form.get('projectCommisions.projectCommisionStructure') as FormArray;
  }

  projectCommisionStructureDetails(projectCommisionStructureIdx: number): FormArray {
    return this.form.get(`projectCommisions.projectCommisionStructure.${projectCommisionStructureIdx}.projectCommisionStructureDetails`) as FormArray;
  }

  get projectCommisionBonus(): FormArray {
    return this.form.get('projectCommisions.projectCommisionBonus') as FormArray;
  }

  constructor(private projectSevice: ProjectsService,
    private snackbarWrapperService: SnackbarWrapperService,
    public dialog: MatDialog,
    private fb: FormBuilder) {

    this.initForm();
    this.form.valueChanges.subscribe(val => this.formEmitter.emit(this.form));
  }
  ngOnInit(): void {

  }

  initForm() {
    this.form = this.fb.group({
      projectCommisions: new FormGroup({
        projectCommisionId: new FormControl(0),
        projectid: new FormControl(0),
        paymentOnPurchase: new FormControl(false),
        paymentOnPurchasePricenetofTax: new FormControl(false),
        paymentOnParking: new FormControl(false),
        paymentOnLocker: new FormControl(false),
        paymentOnTaxHST: new FormControl(false),
        extras: new FormControl(false),
        projectCommisionStructure: new FormArray([]),
        projectCommisionBonus: new FormArray([])
      }),
    });
    // this.newProjectCommisionStructure();
  }

  newProjectCommisionBonus(id = 0, bonustype = '', bonusValue = 0, time = null, fixedDate = null, datefromAggriment = null, installmentType = 1, taxable = false, saved = false, newValue = true) {
    const form = new FormGroup({
      projectCommisionBonusId: new FormControl(id),
      bonusType: new FormControl(bonustype, Validators.required),
      bonusValue: new FormControl(bonusValue, Validators.required),
      time: new FormControl(time == 'null' ? '' : time),// time,
      fixedDate: new FormControl(fixedDate),
      datefromAgreement: new FormControl(datefromAggriment),
      installmentType: new FormControl(installmentType),
      taxable: new FormControl(taxable),
      saved: new FormControl(saved),
      new: new FormControl(newValue),
    });
    form.get('fixedDate')?.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        form.get('fixedDate')?.setValue(val.toISOString());
      }
    })
    form.get('datefromAgreement')?.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        form.get('datefromAgreement')?.setValue(val.toISOString());
      }
    })
    this.projectCommisionBonus.push(form);
  }

  bonusDueChange(index: number) {
    const value = this.projectCommisionBonus.at(index)?.get('installmentType')?.value;
    if (value === '4') this.projectCommisionBonus.at(index)?.get('time')?.setValue('');
  }

  comissionDueChange(comissionIndex: number, structureIndex: number) {
    const value = this.projectCommisionStructureDetails(comissionIndex)?.at(structureIndex)?.get('installmentType')?.value;
    if (value === '4') this.projectCommisionStructureDetails(comissionIndex)?.at(structureIndex)?.get('time')?.setValue('');
  }

  removeProjectCommisionBonus(bonusIdx) {
    this.projectCommisionBonus.removeAt(bonusIdx)
  }

  saveProjectCommisionBonus(bonusIdx: number, edit = false) {
    if (edit) {
      this.projectCommisionBonus.at(bonusIdx)?.get('saved')?.setValue(false);
    } else {
      this.projectCommisionBonus.at(bonusIdx)?.get('saved')?.setValue(true);
      this.projectCommisionBonus.at(bonusIdx)?.get('new')?.setValue(false);
    }
  }

  newProjectCommisionStructure(id = 0, commisionName = '', commisionValue = 0, commisionType = 1, saved = false, newvalue = true) {
    this.projectCommisionStructure.push(new FormGroup({
      projectCommisionStructureId: new FormControl(id),
      commisionName: new FormControl(commisionName, Validators.required),
      commisionValue: new FormControl(commisionValue),
      commisionType: new FormControl(commisionType),
      saved: new FormControl(saved),
      new: new FormControl(newvalue),
      projectCommisionStructureDetails: new FormArray([])
    }));
    if (newvalue) {
      this.newProjectCommisionStructureDetails(this.projectCommisionStructure.length - 1);
    }
  }

  getTotal(values: Array<any>, type = 1) {
    let s = 0;
    values?.forEach(i => {
      if (type == 2) {
        s = s + (i?.dollarValue || 0)
      } else {
        s = s + (i?.percentage || i?.balanceto || 0)
      }
    })
    return s;
  }

  newProjectCommisionStructureDetails(index, id = 0, unittyp = '', typeOfDeposit = 1, amount = 0, percentage = 0, time = '', dueOn = new Date().toISOString(), dollarValue = 0, balanceTo = 0, fixedDate = '', datefromAggriment = '', installmentType = 1) {

    const form = new FormGroup({
      projectCommisionStructureDetailId: new FormControl(id),
      unitType: new FormControl(unittyp),
      typeOfDeposit: new FormControl(typeOfDeposit),
      amount: new FormControl(amount),
      percentage: new FormControl(percentage),
      time: new FormControl(time == 'null' ? '' : time),
      dueOn: new FormControl(dueOn),
      dollarValue: new FormControl(dollarValue),
      balanceto: new FormControl(balanceTo),
      fixedDate: new FormControl(fixedDate),
      datefromAgreement: new FormControl(datefromAggriment),
      installmentType: new FormControl(installmentType, [Validators.required]),// [installmentType],
      // numOfInstallments: new FormControl(''),// [numOfInstallments],
    });

    form.get('fixedDate')?.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        form.get('fixedDate')?.setValue(val.toISOString());
      }
    });

    form.get('datefromAgreement')?.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        form.get('datefromAgreement')?.setValue(val.toISOString());
      }
    });

    (this.form.get(`projectCommisions.projectCommisionStructure.${index}.projectCommisionStructureDetails`) as FormArray).push(form)
  }

  saveProjectCommisionStructure(projectCommisionStructureIdx: number, edit = false) {
    if (edit) {
      this.projectCommisionStructure.at(projectCommisionStructureIdx)?.get('saved')?.setValue(false);
    } else {
      this.projectCommisionStructure.at(projectCommisionStructureIdx)?.get('saved')?.setValue(true);
      this.projectCommisionStructure.at(projectCommisionStructureIdx)?.get('new')?.setValue(false);
    }
  }

  closeFormPanel(projectCommisionStructureIdx: number) {
    if (this.projectCommisionStructure.at(projectCommisionStructureIdx)?.get('new')?.value) {
      this.projectCommisionStructure.removeAt(projectCommisionStructureIdx);
    } else {
      this.saveProjectCommisionStructure(projectCommisionStructureIdx);
    }
  }

  removeProjectCommisionStructure(projectCommisionStructureIdx: number) {
    this.projectCommisionStructure.removeAt(projectCommisionStructureIdx);
  }

  removeProjectCommisionStructureDetails(projectCommisionStructureIdx: number, projectCommisionStructureDetailsIdx: number) {
    this.projectCommisionStructureDetails(projectCommisionStructureIdx).removeAt(projectCommisionStructureDetailsIdx);
  }

  resetValueOnChange(formControl) {
    formControl.get('amount')?.setValue(0);
    formControl.get('percentage')?.setValue(0);
    formControl.get('dollerValue')?.setValue(0);
    formControl.get('balanceto')?.setValue(0);
    formControl.get('fixedDate')?.setValue('');
    formControl.get('datefromAgreement')?.setValue('');
  }

}
