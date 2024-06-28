
import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { IskipUnits } from 'src/app/models/project.model';
import { DropDownCONSTANT } from '../../__dropDownConstants';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { FlatprojectUnitAdditionalFeature, ProjectBlock, ProjectFloorDetail, ProjectGridColor, ProjectModel, ProjectSkipType, ProjectTax, ProjectTower, ProjectTowerLocker, ProjectTowerParking, ProjectTowerUnitType, ProjectUnit, ProjectUnitDetail, ProjectUnitFlat } from '../../models/project-res.model';
@Component({
  selector: 'app-build-grid',
  templateUrl: './build-grid.component.html',
  styleUrls: ['./build-grid.component.scss']
})
export class BuildGridComponent implements OnInit {

  public form!: FormGroup;
  isProcessing!: boolean;
  visibility: boolean = false;
  isEditable: boolean = false;

  @ViewChild('dialogAddCustomName')
  dialogAddCustomName!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  step: number = 0;
  file: any;
  tabIndex = 0;
  firstFormvalue = 0;
  isBlockPreview: boolean = false;
  isCustomBlockName: boolean = false;
  isUnitValueEntered: boolean = false;
  isEditMode: boolean = false;
  endPrevValue: number = 0;
  prevValue: number = 0;
  unitTypeArray: any = [];
  skipOptions: Array<IskipUnits> = [];
  isCustomUnitType = false;
  endFloorPrevValue: number = 0;
  fb: IFormBuilder;
  readonly dropDownCONSTANT = DropDownCONSTANT;
  @Output() formEmitter = new EventEmitter<FormGroup>();
  @Output() stepperChange = new EventEmitter<{ section: 'unit-pricing' | 'unit-numbers', blockIndex: number, towerIndex: number }>();
  constructor(

    private dialog: MatDialog,
    private snackbarWrapperService: SnackbarWrapperService,
    private fb1: FormBuilder
  ) {
    this.fb = fb1;
    this.initForm();

    this.form.valueChanges.subscribe(val => { 
      this.formEmitter.emit(this.form);
    });
    //details
    this.form.get("numberofTowers")?.valueChanges.subscribe(val => {
      if (this.form.get("numberofTowers")?.value > 0) {
        this.towerList.controls = [];
        for (let i = 0; i < this.form.get("numberofTowers")?.value; i++) {
          // this.towerList.push(this.newTowerList());
          this.towerList.push(this.newTowerList(0, 0, 0, 0, 0, 0, true, "tower" + (i + 1), 0, 0, 0, i + 1))
        }
      } else if (this.form != undefined && (this.form.get("numberofTowers")?.value == 0 || this.form.get("numberofTowers")?.value == null) && (this.form?.get('projectTower') as FormArray)?.length) {
        // this.form.get("numberofTowers")?.setValue(0);
        (this.form?.get('projectTower') as FormArray).controls = [];
        (this.form?.get('projectTower') as FormArray).setValue([]);
        // this.form.get("projectTower")?.setValue([]);
      }
    });

  }



  ngOnInit() {
    this.isEditMode = false;
    console.log("print form", this.form)
  }


  setValueOfTowerAndBlocks(towerIndex: any = null) {
    this.isBlockPreview = false;
    this.isUnitValueEntered = false;
    // if (this.form.get("numberofTowers")?.value > 2) {
    //   this.snackbarWrapperService.open("Number of tower should not be greater than 2 ");
    //   this.form.get("numberofTowers")?.setValue(2);
    //   return;
    // }
    if (towerIndex != null) {
      if (this.towerList.at(towerIndex).get("numberofUniqueBlocks")?.value > 0 && this.form.get("numberofTowers")?.value > 0) {
        this.blockDetails(towerIndex).controls = [];
        for (let j = 0; j < this.towerList.at(towerIndex).get("numberofUniqueBlocks")?.value; j++) {
          this.addBlockDetails(towerIndex);
        }
      }
    }
    let array = this.blockDetails(towerIndex)?.value;
    if (array.every(x => x.blockNo == 0)) {
      array.forEach((b, bi) =>
        b.blockNo = bi + 1
      );
    }
    this.blockDetails(towerIndex).controls = [];
    array?.sort((a, b) => parseInt(b.blockNo) - parseInt(a.blockNo)).forEach(b => {
      this.blockDetails(towerIndex).push(this.newBlockDetails(0, 0, false, 0, '', '', null, null, null, 0, false, 0, 0, 0, b.blockNo));
    });;

  }
  uniqueBlockChange(towerIndex) {
    this.setValueOfTowerAndBlocks(towerIndex);
    this.blockDetails(towerIndex)?.value?.sort((a, b) => parseInt(b.blockNo) - parseInt(a.blockNo))

  }
  get towerList(): FormArray {
    return this.form.get('projectTower') as FormArray;
  }
  blockDetails(tabIndex: number): FormArray {
    return this.towerList.at(tabIndex)?.get('projectBlocks') as FormArray || [];
  }
  projectTowerParkingsDetails(tabIndex: number): FormArray {
    return this.towerList
      .at(tabIndex)
      .get('projectTowerParkings') as FormArray;
  }
  projectTowerUnitTypesDetails(tabIndex: number): FormArray {
    return this.towerList
      .at(tabIndex)
      .get('projectTowerUnitTypes') as FormArray;
  }
  projectTowerLockersDetails(tabIndex: number): FormArray {
    return this.towerList
      .at(tabIndex)
      .get('projectTowerLockers') as FormArray;
  }
  initForm() {
    this.form = this.fb.group({
      projectGeneralSettingId: [0],
      projectId: 0,
      towerIndex: 0,
      blockIndex: 0,
      numberofTowers: [null, [Validators.required, Validators.min(1)]],
      skipFloor: 0,
      skipUnit: 0,
      priceInclusiveTaxes: false,
      projectTower: this.fb.array<ProjectTower>([]),
      projectGridColors: this.fb.array<ProjectGridColor>([]),
      projectTax: this.fb.array<ProjectTax>([]),
    });
    // add colors and title
    this.getProjectGridColors.push(this.newProjectGridColors(0, 0, 'Available', '#1e1e2c'))
    this.getProjectGridColors.push(this.newProjectGridColors(0, 0, 'Allocated', '#F4AB3C'))
    this.getProjectGridColors.push(this.newProjectGridColors(0, 0, 'Sold-firm', '#51f44c'))
    this.getProjectGridColors.push(this.newProjectGridColors(0, 0, 'Worksheet submitted', '#766cf4'))
    this.getProjectGridColors.push(this.newProjectGridColors(0, 0, 'Sold(10 days)', '#3cf4d5'))
    this.getProjectGridColors.push(this.newProjectGridColors(0, 0, 'Off Market', '#e9f63c'))
    ///project tax entries 
    this.getProjectTax.push(this.newProjectTax(0, false, 'GST', '', false, 0))
    this.getProjectTax.push(this.newProjectTax(0, false, 'QST', '', false, 0))
    this.getProjectTax.push(this.newProjectTax(0, false, 'PST', '', false, 0))
    this.getProjectTax.push(this.newProjectTax(0, false, 'HST', '', false, 0))
  }
  setStep(index: number) {
    this.step = index;
  }

  projectFloorDetails(tabIndex, blockIndex: number) {
    return this.blockDetails(tabIndex).at(blockIndex)
      .get('projectFloorDetails') as FormArray;
  }
  get getSkipItems(): FormArray {
    return this.form.get('skipItems') as FormArray;
  }
  get getProjectTax(): FormArray {
    return this.form.get('projectTax') as FormArray;
  }
  get getProjectGridColors(): FormArray {
    return this.form.get('projectGridColors') as FormArray;
  }
  get getProjectSkipTypes(): FormArray {
    return this.form.get('projectSkipType') as FormArray;
  }
  newProjectGridColors(id = 0, colorId = 0, colortitle: string = '', colorCode: string = '', projectId = 0): FormGroup {
    return this.fb.group({
      id: id,
      colorId: colorId,
      colorTitle: colortitle,
      colorCode: colorCode,
      projectId: projectId
    });
  }
  newProjectSkipType(id = 0, skipId = 0, projectId = 0, skiptext = '', number = 0, startsFrom, endFrom, checked = false): FormGroup {
    return this.fb.group({
      id: id,
      skipId: skipId,
      projectId: projectId,
      skiptext: skiptext,
      number: number,
      startFrom: startsFrom,
      endFrom: endFrom,
      checked: checked
    });
  }
  newProjectTax(id = 0, checked = false, taxType: string = '', value: string = '', isCustomTax = false, projectId = 0): FormGroup {
    return this.fb.group({
      id: id,
      checked: checked,
      taxType: taxType,
      value: value,
      isCustomTax: isCustomTax,
      projectId: projectId
    });
  }
  newSkipItems(): FormGroup {
    return this.fb.group({
      skipItemId: 0,
      skipFloor: 0,
      skipUnit: 0,
    });
  }
  addSkipItems() {
    this.getSkipItems.push(this.newSkipItems())
  }
  newTowerList(towerId = 0, numberofFloors: number | null = 0, totalUnits: number | null = 0, ceilingHeight = 0, numberofUniqueBlocks: number | null = 0, numberOfUnits: number | null = 0, sameCeilingHeight = true, towerName = "tower", projectId = 0, skipFloor = 0, skipUnit = 0, towerNum: number | null = 0): FormGroup {
    let projectTower = this.fb.group<ProjectTower>({
      towerId: towerId,
      towerNo: towerNum,
      numberofFloors: [numberofFloors, [Validators.required, Validators.min(1)]],
      totalUnits: [totalUnits, [Validators.required, Validators.min(1)]],
      ceilingHeight: ceilingHeight,
      numberofUniqueBlocks: [numberofUniqueBlocks, [Validators.required, Validators.min(1)]],
      numberOfUnits: numberOfUnits,
      sameCeilingHeight: sameCeilingHeight,
      towerName: towerName,
      skipFloor: skipFloor,
      skipUnit: skipUnit,
      projectId: projectId,
      projectBlocks: this.fb.array([]),
      projectTowerParkings: this.fb.array<ProjectTowerParking>([this.newProjectTowerParkings()]),
      projectTowerLockers: this.fb.array<ProjectTowerLocker>([this.newProjectTowerLockers()]),
      projectTowerUnitTypes: this.fb.array<ProjectTowerUnitType>([this.newProjectTowerUnitTypes(0, 'Studio', false, 0), this.newProjectTowerUnitTypes(0, '1B', false, 0), this.newProjectTowerUnitTypes(0, '1B+D', false, 0), this.newProjectTowerUnitTypes(0, '2B', false, 0), this.newProjectTowerUnitTypes(0, '2B+D', false, 0), this.newProjectTowerUnitTypes(0, '3B+D', false, 0)]),
    });
    projectTower.get('projectTowerUnitTypes')?.valueChanges.subscribe(x => {
      this.unitTypeArray = projectTower.get('projectTowerUnitTypes')?.value?.filter(x => x.isSelected);
      projectTower?.get("projectTowerParkings")?.value?.filter((element, index) => {
        var dropDownValue = this.projectTowerParkingsDetails(this.tabIndex)?.at(index)?.get("unitTypeValues")?.value
        let filtered = dropDownValue?.filter(y => this.unitTypeArray.some(z => z.unitType == y));
        if (filtered?.length > 0)
          this.projectTowerParkingsDetails(this.tabIndex)?.at(index)?.get("unitTypeValues")?.setValue(filtered)
      }
      );
      projectTower?.get("projectTowerLockers")?.value?.filter((element, index) => {
        var dropDownValue = this.projectTowerLockersDetails(this.tabIndex)?.at(index)?.get("unitTypeValues")?.value
        let filtered = dropDownValue?.filter(y => this.unitTypeArray.some(z => z.unitType == y));
        if (filtered?.length > 0)
          this.projectTowerLockersDetails(this.tabIndex)?.at(index)?.get("unitTypeValues")?.setValue(filtered)
      }
      );
    });
    return projectTower;
  }

  newBlockDetails(id = 0, projectId = 0, isCustomBlock = false, towerNo = 0, stackName = '', blockName = '', numberUnitsPerFloor: number | null = 0, startingFloor: number | null = 0, toFloor: number | null = 0, ceilingHeight = 0, isEditMode = false, projectTowerTowerId = 0, towerId = 0, floorPremium = 0, blockNo = 0): FormGroup {
    let block = this.fb.group<ProjectBlock>({
      blockId: id,
      blockNo: blockNo,
      projectId: projectId,
      isCustomBlock: isCustomBlock,
      towerNo: towerNo,
      stackName: [stackName, Validators.required],//[stackName, Validators.required],
      blockName: [blockName, Validators.required],
      numberUnitsPerFloor: numberUnitsPerFloor,// [numberUnitsPerFloor, [Validators.required, Validators.min(1)]],
      startingFloor: [startingFloor, [Validators.required, Validators.min(1)]],
      toFloor: [toFloor, [Validators.required, Validators.min(1)]],
      ceilingHeight: ceilingHeight,
      projectFloorDetails: this.fb.array([]),
      towerId: towerId,
      projectTowerTowerId: projectTowerTowerId,
      floorPremium: floorPremium ?? 0
    })
    const updateUnits = (val) => {
      this.prevValue = 0;
      (block.get('projectFloorDetails') as FormArray).clear();
      if (val.startingFloor > 0 && val.toFloor > 0 && val.numberUnitsPerFloor > 0) {
        let unitFlag: boolean = false;
        var arr = this.blockDetails(this.tabIndex)?.value
        var index = arr.findIndex(x => x.stackName == val.stackName)
        index = index > 0 ? index - 1 : index;
        arr = this.blockDetails(this.tabIndex).at(index)?.get("projectFloorDetails")?.value
        var max = 0;
        arr.map(function (a) {
          max = a.floorNo > max ? a.floorNo : max;
        });
        this.endFloorPrevValue = max;
        var startFloor = this.endFloorPrevValue >= val.startingFloor ? this.endFloorPrevValue + 1 : val.startingFloor
        for (let floor = startFloor; floor <= val.toFloor; floor++) {
          (block.get('projectFloorDetails') as FormArray).push(this.newProjectFloors(floor, val), { emitEvent: false });
        }
      }
    }
    if (!isEditMode) {
      block.get('startingFloor')?.valueChanges.subscribe(startingFloor => {
        updateUnits({ ...block?.value, startingFloor })
      });
      block.get('toFloor')?.valueChanges.subscribe(toFloor => updateUnits({ ...block?.value, toFloor }));
      block.get('numberUnitsPerFloor')?.valueChanges.subscribe(numberUnitsPerFloor => {
        updateUnits({ ...block?.value, numberUnitsPerFloor })
      }
      );
    }
    (block.get('projectFloorDetails') as FormArray)?.value?.sort((a, b) => parseInt(b.floorNo) - parseInt(a.floorNo));
    return block;
  }

  addProjectUnitFlast(val, block) {
    this.prevValue = 0;
    (block.get('projectFloorDetails') as FormArray).clear();
    if (val.startingFloor > 0 && val.toFloor > 0 && val.numberUnitsPerFloor > 0) {
      let unitFlag: boolean = false;
      var startFloor = val.startingFloor;
      var toFloor = val.toFloor;
      var arr = this.blockDetails(this.tabIndex)?.value
      var index = arr.findIndex(x => x.stackName == val.stackName)
      index = index > 0 ? index - 1 : index;
      arr = this.blockDetails(this.tabIndex).at(index)?.get("projectFloorDetails")?.value
      var max = 0;
      var blockdetails: any = []
      if (arr.length > 0) {
        arr.map(function (a) {
          if (a.floorNo > max) {
            max = a.floorNo;
            blockdetails = [];
            blockdetails.push(a);
          }
        });
        // this.endFloorPrevValue = max;
        // startFloor = this.endFloorPrevValue >= val.startingFloor ? this.endFloorPrevValue + 1 : val.startingFloor;
        // var diff = this.endFloorPrevValue >= val.startingFloor ? this.endFloorPrevValue - val.toFloor == 0 ? 1 : this.endFloorPrevValue - val.startingFloor : 0
        // toFloor = val.toFloor + diff;

        // var selectedSkipOptions = this.skipOptions.filter(x => x.checked);
      }
      var toFloorSkipedOption = this.skipOptions.filter(x => x.checked && x.number > startFloor && x.number < toFloor);
      toFloor = toFloorSkipedOption.length > 0 ? toFloor + toFloorSkipedOption.length : toFloor;

      var startFromSkipedOption = this.skipOptions.filter(x => x.checked && x.number < startFloor);
      startFloor = startFromSkipedOption.length > 0 ? startFloor + startFromSkipedOption.length : startFloor;
      toFloor = startFromSkipedOption.length > 0 ? toFloor + startFromSkipedOption.length : toFloor;

      for (let floor = startFloor; floor <= toFloor; floor++) {
        // var result = this.skipOptions.find(x => x.checked && x.number == floor && );
        // if (result != null)
        //   floor = floor + 1;
        floor = this.checkStartFloor(floor);

        (block.get('projectFloorDetails') as FormArray).push(this.newProjectFloors(floor, val), { emitEvent: false });
      }
    }
    return block;
  }

  newProjectTowerUnitTypes(id = 0, UnitType = '', checked = false, towerId = 0): FormGroup {
    let unitType = this.fb.group({
      unitTypeId: id,
      unitType: UnitType,
      isSelected: checked,
      towerId: towerId,
    })
    unitType.valueChanges.subscribe(x => {
      unitType.value;
      this.towerList.value.forEach((y, ti) => {
        this.unitTypeArray = this.projectTowerUnitTypesDetails(ti).value.filter(x => x.isSelected);
        if (!x.isSelected) {
          y?.projectTowerParkings.forEach(z => {

            if (z.unitTypeValues?.length > 0) {
              let filtered = z.unitTypeValues?.filter(y => this.unitTypeArray.some(z => z.unitType == y));
              if (filtered?.length > 0)
                this.projectTowerParkingsDetails(ti).get('unitTypeValues')?.setValue(z.unitTypeValues, { emitEvent: false });
              else
                this.projectTowerParkingsDetails(ti).get('unitTypeValues')?.setValue([], { emitEvent: false });
            }
            else {
              this.projectTowerParkingsDetails(ti).get('unitTypeValues')?.setValue([], { emitEvent: false });
            }

          })
        }
      });
    });
    return unitType
  }
  newProjectTowerParkings(name: string = 'Parking', id = 0, numberOfParkingSlots = 0, availableto = '', unitSizeinSqft = '', included = false, eligible = false, towerId = 0, price = 0, amount = 0, unitTypeOptions = '', unitTypeArr = []): FormGroup {

    const parkingEligibility = this.fb.group<ProjectTowerParking>({
      towerParkingId: id,
      numberOfParkingSlots: numberOfParkingSlots,
      name: name,
      availableto: availableto,
      unitSizeinSqft: unitSizeinSqft,
      included: included,
      eligible: eligible,
      towerId: towerId,
      price: price,
      amount: amount,
      unitTypeOptions: unitTypeOptions,
      unitTypeValues: unitTypeArr
    });

    parkingEligibility?.get('availableto')?.valueChanges.subscribe(val => {

      if (val != 'Unit Type') {
        parkingEligibility.get('unitTypeValues')?.setValue([], { emitEvent: false });
        parkingEligibility.get('unitTypeOptions')?.setValue("", { emitEvent: false });
      }

    });

    parkingEligibility?.get('unitTypeValues')?.valueChanges.subscribe(val => {
      if (this.unitTypeArray.length > 0) {
        let filtered = val.filter(x => this.unitTypeArray.some(y => y.unitType == x))
        if (filtered?.length > 0)
          parkingEligibility.get('unitTypeValues')?.setValue(filtered, { emitEvent: false });
        if (val?.length > 0)
          parkingEligibility.get('unitTypeOptions')?.setValue(val.join(","), { emitEvent: false })
        else
          parkingEligibility.get('unitTypeOptions')?.setValue("", { emitEvent: false });
      }
      else {
        parkingEligibility.get('unitTypeOptions')?.setValue("", { emitEvent: false });
        parkingEligibility.get('unitTypeValues')?.setValue([], { emitEvent: false });
      }
    });

    return parkingEligibility;
  }
  newProjectTowerLockers(name: string = 'Locker', id = 0, numberOfLockerSlots = 0, availableto = '', unitSizeinSqft = '', included = false, eligible = false, towerId = 0, price = 0, amount = 0, unitTypeOptions = '', unitTypeArr = []): FormGroup {
    let lockerEligibility = this.fb.group<ProjectTowerLocker>({
      towerLockerId: id,
      numberOfLockerSlots: numberOfLockerSlots,
      name: name,
      availableto: availableto,
      unitSizeinSqft: unitSizeinSqft,
      included: included,
      eligible: eligible,
      towerId: towerId,
      price: price,
      amount: amount,
      unitTypeOptions: unitTypeOptions,
      unitTypeValues: unitTypeArr
    })
    lockerEligibility?.get('availableto')?.valueChanges.subscribe(val => {

      if (val != 'Unit Type') {
        lockerEligibility.get('unitTypeOptions')?.setValue("", { emitEvent: false })
        lockerEligibility.get('unitTypeValues')?.setValue([], { emitEvent: false });
      }
    });

    lockerEligibility?.get('unitTypeValues')?.valueChanges.subscribe(val => {

      let filtered = val.filter(x => this.unitTypeArray.some(y => y.unitType == x))
      if (filtered?.length > 0)
        lockerEligibility.get('unitTypeValues')?.setValue(filtered, { emitEvent: false });

      if (val?.length > 0)
        lockerEligibility?.get('unitTypeOptions')?.setValue(val.join(","), { emitEvent: false })
      else
        lockerEligibility?.get('unitTypeOptions')?.setValue("", { emitEvent: false })
    });
    return lockerEligibility;
  }

  newProjectUnitFlats(flatNo: number = 0, flatStaus = "available", flatId = 0, isSkip = false, isSingleStackSelected = false, isMultiStack = false, unitNumber = 0, id = 0, price = 0, interiorSize = 0, ceilingHeight = 0, unitName = '', balconysizes = 0, floorPremium = 0, view = 0, livingRoomSize = 0, diningRoomSize = 0, noOfBedroom = 0, nOofBaths = 0, terrace = 0, noofBalcony = 0, noofden = 0, isEdit = false, unitTypeId = 0, unitType = "", assignAgentId = 0, inActiveStatus = false,
    projectFloorDetailsFloorId = 0): FormGroup {
    return this.fb.group<ProjectUnitFlat>({
      unitNo: unitNumber,
      price: price,
      floorNo: 0,
      unitTypeId: unitTypeId,
      unitType: unitType,
      isMultipleStackSelected: isMultiStack,
      isSingleStackSelected: isSingleStackSelected,
      assignAgentId: assignAgentId,
      flatId: flatId,
      flatNo: flatNo,
      flatStatus: flatStaus || 'available',
      isSkip: isSkip,
      interiorSize: interiorSize,
      ceilingHeight: ceilingHeight,
      unitName: unitName,
      balconySize: balconysizes,
      floorPremium: floorPremium,
      view: view,
      livingRoomSize: livingRoomSize,
      diningRoomSize: diningRoomSize,
      noOfBedroom: noOfBedroom,
      flatBedRooms: this.fb.array([]),
      nOofBaths: nOofBaths,
      flatbathroomSizes: this.fb.array([]),
      terrace: terrace,
      flatterraceSizes: this.fb.array([]),
      noofBalcony: noofBalcony,
      flatbalconysizes: this.fb.array([]),
      noofDen: noofden,
      flatdenSizes: this.fb.array([]),
      inActiveStatus: inActiveStatus ? 1 : 0,
      projectFloorDetailsFloorId: projectFloorDetailsFloorId,
      flatProjectUnitAdditionalFeatures: this.fb.array([this.newProjectUnitAdditionalFeaturesForFlat("parking"), this.newProjectUnitAdditionalFeaturesForFlat("locker")]),
      floorPlanFile: "",
      PlanSchedlePath: "",

    });
  }
  projectUnitAdditionalFeaturesDetailForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex: number) {
    return this.projectUnitFlatsDetail(tabIndex, blockIndex, unitPricingIndex).at(flatIndex)
      .get('flatProjectUnitAdditionalFeatures') as FormArray;
  }

  newProjectFloors(floorNo: number, blockVal?: any, floorId = 0, isFloorSelected = false, isEdit = false, projectBlockBlockId = 0, blockUnitPriceId = 0): FormGroup {
    let projectfloors = this.fb.group<ProjectFloorDetail>({
      floorId: floorId,
      floorNo: floorNo,
      projectBlockBlockId: projectBlockBlockId,
      isFloorSelected: isFloorSelected,
      blockUnitPriceId: blockUnitPriceId,
      projectUnitFlats: this.fb.array([]),

    });
    if (blockVal.startingFloor > 0 && blockVal.toFloor > 0 && blockVal.numberUnitsPerFloor > 0 && !isEdit) {
      floorNo = this.checkStartFloor(floorNo);
      projectfloors.get('floorNo')?.setValue(floorNo)
      //this.endFloorPrevValue = floorNo;
      this.prevValue = floorNo;
      this.endPrevValue = 0;
      Array.from(Array(blockVal.numberUnitsPerFloor), (_, unitIndex) => {

        unitIndex = unitIndex + 1;
        unitIndex = this.checkEndFloor(unitIndex)
        this.endPrevValue = unitIndex;
        let flatNo = unitIndex < 10 ? parseInt(`${floorNo}0${unitIndex}`) : parseInt(`${floorNo}${unitIndex}`);
        if (!projectfloors?.value?.projectUnitFlats?.find(i => i?.floorNo == flatNo)) {

          (projectfloors.get('projectUnitFlats') as FormArray).push(this.newProjectUnitFlats(flatNo), { emitEvent: false });
        }
      });
    }
    return projectfloors;
  }

  checkFloorNo(floorNo) {
    debugger
    //if (this.skipOptions.find(sso => floorNo.toString() == sso.number && sso.type == 'floor' && sso.checked) || this.prevValue == floorNo || this.prevValue > floorNo) {
    if (this.skipOptions.find(sso => floorNo.toString().startsWith(sso.number.toString()) && sso.startFrom && sso.type == 'floor' && sso.checked && !sso.has) || this.prevValue == floorNo || this.prevValue > floorNo) {
      return true;
    }
    var arr = this.skipOptions.filter(sso => sso.has && sso.type == 'stack' && sso.checked);
    if (this.skipOptions.find(sso => floorNo.toString().includes(sso.number.toString()) && sso.has && sso.type == 'stack' && sso.checked)) {
      return true;
    }
    else
      return false;
  }


  checkStartFloor(floorNo) {
    let flag: boolean = true;
    while (flag == true) {
      flag = this.checkFloorNo(floorNo);
      if (flag)
        floorNo = floorNo + 1;
    }
    return floorNo;
  }

  checkEndFloor(flatNo) {
    let flag: boolean = true;
    while (flag == true) {
      flag = this.checkFlatNo(flatNo);
      if (flag)
        flatNo = flatNo + 1;
    }
    return flatNo;
  }

  checkFlatNo(flatNo) {
    // debugger
    var skipedOptions = this.skipOptions.filter(sso => sso.type == 'stack' && sso.checked && !sso.has && !sso.startFrom);
    var isExist = false;
    skipedOptions.forEach(item => {
      if (item.number.toString().length==1 && flatNo>9) {
        var arr = flatNo.toString().split('');
        if(arr.length>1){
          if (item.number == arr[1] && item.type == 'stack' && item.checked && !item.has || this.endPrevValue == flatNo || this.endPrevValue > flatNo) {
            isExist = true;    
          }
        }
      }
      else if (flatNo.toString() == item.number && item.type == 'stack' && item.checked && !item.has || this.endPrevValue == flatNo || this.endPrevValue > flatNo) {
        isExist = true;
      }

    })
    if (isExist)
      return true;

    // if (this.skipOptions.find(sso => flatNo.toString() == sso.number && sso.type == 'stack' && sso.checked && !sso.has) || this.endPrevValue == flatNo || this.endPrevValue > flatNo) {
    //   return true;
    // }
    if (this.skipOptions.find(sso => flatNo.toString().includes(sso.number.toString()) && sso.has && sso.type == 'stack' && sso.checked)) {
      return true;
    }
    else
      return false;
  }

  // newProjectUnitPricings(unitNumber?, blockVal?: any, id = 0, blockId = 0, isStackSelected = false, status = '', price = 0, interiorSize = 0, ceilingHeight = 0, unitName = '', balconysizes = 0, floorPremium = 0, view = 0, livingRoomSize = 0, diningRoomSize = 0, noOfBedroom = 0, nOofBaths = 0, terrance = 0, noofBalcony = 0, noofden = 0, isEdit = false): FormGroup {

  //   let projectUnitPricing = this.fb.group({
  //     blockUnitPriceId: id,
  //     blockId: blockId,
  //     isStackSelected: isStackSelected,
  //     status: status,
  //     unitNo: unitNumber || 0,
  //     price: [price, Validators.required],
  //     interiorSize: [interiorSize, Validators.required],
  //     ceilingHeight: [ceilingHeight, Validators.required],
  //     unitName: [unitName, Validators.required],
  //     balconySize: [balconysizes, Validators.required],
  //     floorPremium: [floorPremium, Validators.required],
  //     view: [view, Validators.required],
  //     livingRoomSize: [livingRoomSize],
  //     diningRoomSize: [diningRoomSize],
  //     noOfBedroom: [noOfBedroom],
  //     projectUnitFlats: this.fb.array([]),
  //     bedRooms: this.fb.array([]),
  //     nOofBaths: [nOofBaths],
  //     bathroomSizes: this.fb.array([]),
  //     terrace: [terrance],
  //     terraceSizes: this.fb.array([]),
  //     noofBalcony: [noofBalcony],
  //     balconysizes: this.fb.array([]),
  //     noofDen: [noofBalcony],
  //     denSizes: this.fb.array([]),
  //     projectUnitAdditionalFeatures: this.fb.array([this.newProjectUnitAdditionalFeatures('Parking'), this.newProjectUnitAdditionalFeatures('Locker')]),
  //     floorPlanFile: "",
  //     planScheduleFile: "",
  //   });
  //   if (blockVal.startingFloor > 0 && blockVal.toFloor > 0 && blockVal.numberUnitsPerFloor > 0 && !isEdit) {
  //     let floorFlag: boolean = false;
  //     for (let floor = blockVal.startingFloor; floor <= blockVal.toFloor; floor++) {
  //       let flatNo = unitNumber < 10 ? parseInt(`${floor}0${unitNumber}`) : parseInt(`${floor}${unitNumber}`);
  //       if (!projectUnitPricing?.value?.projectUnitFlats?.find(i => i?.unitNo == flatNo)) {
  //         if (this.skipOptions.find(sso => flatNo.toString()[sso.f]([sso.number.toString()]) && sso.type == 'floor' && sso.checked)) {
  //           console.log("skip floor", flatNo);
  //           floorFlag = true;
  //         }
  //         if (floorFlag) {
  //           flatNo = unitNumber < 10 ? parseInt(`${floor + 1}0${unitNumber}`) : parseInt(`${floor + 1}${unitNumber}`);
  //         }

  //         let flat = this.newProjectUnitFlats(flatNo);
  //         (projectUnitPricing.get('projectUnitFlats') as FormArray).push(flat, { emitEvent: false });

  //       }
  //     }
  //   }
  //   return projectUnitPricing;
  // }
  newBedRooms(id = 0, blockUnitPriceId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      bedRoomsId: id,
      blockUnitPriceId: blockUnitPriceId,
      number: number,
      size: size,//[size, Validators.required]
    });
  }
  newBathRoomSizes(bathsId = 0, blockUnitPriceId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      bathsId: bathsId,
      blockUnitPriceId: blockUnitPriceId,
      number: number,
      size: size,//[size, Validators.required]
    });
  }
  newTerraceSizes(terraceId = 0, blockUnitPriceId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      terraceId: terraceId,
      blockUnitPriceId: blockUnitPriceId,
      number: number,
      size: size,//[size, Validators.required]
    });
  }
  newBalconySizes(balconyId = 0, blockUnitPriceId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      balconyId: balconyId,
      blockUnitPriceId: blockUnitPriceId,
      number: number,
      size: 0,//[0, Validators.required]
    });
  }
  newDenSizes(denSizeId = 0, blockUnitPriceId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      denId: denSizeId,
      blockUnitPriceId: blockUnitPriceId,
      number: number,
      size: size,//[size, Validators.required]
    });
  }
  newProjectUnitAdditionalFeatures(name = '', id = 0, blockUnitPriceId = 0, isIncluded = false, isEligible = false): FormGroup {
    return this.fb.group({
      additionalFeatureId: id,
      blockUnitPriceInd: blockUnitPriceId,
      name: name,
      isIncluded: isIncluded,
      isEligible: isEligible
    });
  }
  newBedRoomsForFlat(id = 0, flatId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      bedRoomsId: id,
      flatId: flatId,
      number: number,
      size: size,//[size, Validators.required]
    });
  }
  newBathRoomSizesForFlat(bathsId = 0, flatId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      bathsId: bathsId,
      flatId: flatId,
      number: number,
      size: size,//[size, Validators.required]
    });
  }
  newTerraceSizesForFlat(terraceId = 0, flatId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      terraceId: terraceId,
      flatId: flatId,
      number: number,
      size: size,//[size, Validators.required]
    });
  }
  newBalconySizesForFlat(balconyId = 0, flatId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      balconyId: balconyId,
      flatId: flatId,
      number: number,
      size: size,//[0, Validators.required]
    });
  }
  newDenSizesForFlat(denId = 0, flatId = 0, number = 0, size = 0): FormGroup {
    return this.fb.group({
      denId: denId,
      flatId: flatId,
      number: number,
      size: size,// [size, Validators.required]
    });
  }
  newProjectUnitAdditionalFeaturesForFlat(name = '', id = 0, flatId = 0, isIncluded = false, isEligible = false): FormGroup {
    return this.fb.group<FlatprojectUnitAdditionalFeature>({
      additionalFeatureId: id,
      flatId: flatId,
      name: name,
      isIncluded: isIncluded,
      isEligible: isEligible
    });
  }
  addBlockDetails(tabIndex: number) {
    var blockIndex = this.blockDetails(tabIndex)?.length
    this.blockDetails(tabIndex).push(this.newBlockDetails(0, 0, false, 0, '', '', null, null, null, 0, false, 0, 0, 0));
  }
  counter(i: number) {
    return new Array(i);
  }

  checkFloorOccupancy(tabIndex, key, blockIndex, event) {
    this.isBlockPreview = false;
    var value = (+event.target.value);
    var blockDetails = this.blockDetails(tabIndex).at(blockIndex)?.value;
    if (value > 0) {
      var towerDetails = this.towerList.at(tabIndex).value;
      if (value > towerDetails.numberofFloors) {
        this.blockDetails(tabIndex).at(blockIndex).get(event.target.id)?.setValue(1);
        this.snackbarWrapperService.open(`Floor number should be smaller than ` + towerDetails.numberofFloors);
        return;
      }
      this.blockDetails(tabIndex).value.forEach((element, i) => {
        if (value >= element.startingFloor && value <= element.toFloor && blockIndex != i) {
          this.snackbarWrapperService.open(`Floor ${event.target.value} already occupied `);
          this.blockDetails(tabIndex).at(blockIndex).get(event.target.id)?.setValue(1);
        }
        else if (blockIndex == i && element.startingFloor > 0 && element.toFloor > 0 && element.startingFloor > element.toFloor) {
          key == 1 ? this.snackbarWrapperService.open(`Starting Floor should be smaller than To FLoor`) :
            this.snackbarWrapperService.open(`To Floor should be greater than Starting Floor`);
          this.blockDetails(tabIndex).at(blockIndex).get(event.target.id)?.setValue(0);
        }
      });
    }
    if (this.isEditMode && blockDetails?.toFloor > 0 && blockDetails?.startingFloor > 0 && blockDetails?.numberUnitsPerFloor > 0) {
      (this.blockDetails(tabIndex).at(blockIndex)?.get('projectFloorDetails') as FormArray).controls = [];
      (this.blockDetails(tabIndex).at(blockIndex)?.get('projectFloorDetails') as FormArray).setValue([]);
      (this.blockDetails(tabIndex).at(blockIndex)?.get('projectFloorDetails') as FormArray).setValue(this.addProjectUnitFlast(this.blockDetails(tabIndex).at(blockIndex)?.value, this.blockDetails(tabIndex).at(blockIndex)))
    }
  }
  blockPreview() {
    this.isBlockPreview = true;

  }

  unitValueChange(towerIndex, blockIndex, event) {
    this.isUnitValueEntered = true;
    var value = (+event.target.value);
    if (value > 0) {
      const tower = this.towerList.at(towerIndex).value;
      const totalUnits = tower?.totalUnits || 0;
      let _totalUnits = 0;
      this.blockDetails(towerIndex).value.forEach(block => {
        _totalUnits += ((block?.toFloor || 0) - (block.startingFloor || 0) + 1) * (block.numberUnitsPerFloor || 0);
      });
      var blockDetails = this.blockDetails(towerIndex).at(blockIndex)?.value;
      if (_totalUnits > totalUnits) {
        // const towerName = this.towerList.at(towerIndex).get('towerName')?.value;
        const msg = `The number of units (${_totalUnits}) have exceeded the total number of units (${totalUnits}) mentioned in Tower (${towerIndex + 1}).`
        this.snackbarWrapperService.open(msg);
        this.blockDetails(towerIndex).at(blockIndex).get('numberUnitsPerFloor')?.setValue(0);
      }
      //this.isEditMode &&
      else if (blockDetails?.toFloor > 0 && blockDetails?.startingFloor > 0 && blockDetails?.numberUnitsPerFloor > 0) {
        (this.blockDetails(towerIndex).at(blockIndex)?.get('projectFloorDetails') as FormArray).controls = [];
        (this.blockDetails(towerIndex).at(blockIndex)?.get('projectFloorDetails') as FormArray).setValue([]);
        (this.blockDetails(towerIndex).at(blockIndex)?.get('projectFloorDetails') as FormArray).setValue(this.addProjectUnitFlast(this.blockDetails(towerIndex).at(blockIndex)?.value, this.blockDetails(towerIndex).at(blockIndex)))
      }
    }
  }
  setTowerIndex(towerIndex: number) {
    this.tabIndex = towerIndex;
    this.step = 0
  }

  goToUnitPricing(section: 'unit-pricing' | 'unit-numbers', blockIndex: number, towerIndex: number) {
    // if (this.isEditMode) {
    //   this.form.get('projectTower')?.value.forEach((e, i) => {
    //     this.projectTowerParkingsDetails(i)?.value.forEach((val) => {

    //       this.blockDetails(i)?.value.forEach((block, blockIndex) => {
    //         this.projectFloorDetails(i, blockIndex)?.value.forEach((floor, floorIndex) => {
    //           floor?.projectUnitFlats?.forEach((flat, flatIndex) => {
    //             if (!this.projectUnitAdditionalFeaturesDetailForFlat(i, blockIndex, floorIndex, flatIndex)?.value.find(x => x.name == val.name)) {
    //               this.projectUnitAdditionalFeaturesDetailForFlat(i, blockIndex, floorIndex, flatIndex)?.clear();
    //               this.projectUnitAdditionalFeaturesDetailForFlat(i, blockIndex, floorIndex, flatIndex)?.push(this.newProjectUnitAdditionalFeaturesForFlat(val?.name), { emitEvent: false });

    //             }
    //           });
    //         });
    //       });
    //     });
    //   });
    //   ///locker change
    //   this.form.get('projectTower')?.value.forEach((e, i) => {
    //     this.projectTowerLockersDetails(i)?.value.forEach((val, lpi) => {

    //       this.blockDetails(i)?.value.forEach((block, blockIndex) => {
    //         this.projectFloorDetails(i, blockIndex)?.value.forEach((floor, floorIndex) => {
    //           floor?.projectUnitFlats?.forEach((flat, flatIndex) => {
    //             if (!this.projectUnitAdditionalFeaturesDetailForFlat(i, blockIndex, floorIndex, flatIndex)?.value.find(x => x.name == val.name)) {
    //               this.projectUnitAdditionalFeaturesDetailForFlat(i, blockIndex, floorIndex, flatIndex)?.clear();
    //               this.projectUnitAdditionalFeaturesDetailForFlat(i, blockIndex, floorIndex, flatIndex)?.push(this.newProjectUnitAdditionalFeaturesForFlat(val?.name), { emitEvent: false });

    //             }

    //           });
    //         });
    //       });
    //     });
    //   });
    // }
    // this.stepperChange.emit({ section, blockIndex, towerIndex });
    this.form.get("blockIndex")?.setValue(blockIndex);
    this.form.get("towerIndex")?.setValue(towerIndex);
    console.log("form value on pricing", this.form.value);
    this.stepperChange.emit({ section, blockIndex, towerIndex });
  }

  customUnitNameChange(tabIndex, blockIndex, value) {
    if (value)
      this.blockDetails(tabIndex).at(blockIndex).get("isCustomBlock")?.setValue(true);
    else
      this.blockDetails(tabIndex).at(blockIndex).get("isCustomBlock")?.setValue(false);
  }

  getTotalAndMissingUnits(key: number) {
    let totalUnits = 0;
    this.blockDetails(this.tabIndex).value?.forEach(element => {
      totalUnits = totalUnits + (((element.toFloor - element.startingFloor) + 1) * element.numberUnitsPerFloor)
    });
    if (key == 1)
      return totalUnits;
    else {
      const towerDetails = this.towerList.at(this.tabIndex)?.value;
      var missingUnits = towerDetails?.totalUnits - totalUnits;
      return missingUnits;

    }
  }

  changeParkingAvailableOption(event: any, index, parkingtowerIndex) {
    switch (event.target.value) {
      case 'All Units':
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.enable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('included')?.enable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('eligible')?.enable();
        break;
      case 'Unit size Above':
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.enable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('included')?.enable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('eligible')?.enable();
        break;
      case 'Unit Type':
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.setValue('');
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.disable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('included')?.enable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('eligible')?.enable();
        break;
      case 'Price Above':
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.setValue('');
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.disable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('included')?.setValue(false);
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('included')?.disable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('eligible')?.setValue(false);
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('eligible')?.disable();
        break;
      default:
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.setValue('');
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.disable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('included')?.setValue(false);
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('included')?.disable();
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('eligible')?.setValue(false);
        this.projectTowerParkingsDetails(index).at(parkingtowerIndex)?.get('eligible')?.disable();
        break;
    }
  }

  changeLockerAvailableOption(event: any, index, parkingtowerIndex) {
    switch (event.target.value) {
      case 'All Units':
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.enable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('included')?.enable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('eligible')?.enable();
        break;
      case 'Unit size Above':
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.enable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('included')?.enable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('eligible')?.enable();
        break;
      case 'Unit Type':
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.setValue('');
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.disable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('included')?.enable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('eligible')?.enable();
        break;
      case 'Price Above':
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.setValue('');
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.disable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('included')?.setValue(false);
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('included')?.disable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('eligible')?.setValue(false);
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('eligible')?.disable();
        break;
      default:
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.setValue('');
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('unitSizeinSqft')?.disable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('included')?.setValue(false);
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('included')?.disable();
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('eligible')?.setValue(false);
        this.projectTowerLockersDetails(index).at(parkingtowerIndex)?.get('eligible')?.disable();
        break;
    }
  }
  addCustomNameForLockersAndLockers(towerIndex, opcode) {
    this.customTowerParkingsOpcode = opcode;
    this.openCustomNameDialog();
  }
  removeCustomNameForLockersAndLockers(towerIndex, index, opcode) {
    if (opcode == 1)
      this.projectTowerParkingsDetails(towerIndex).removeAt(index);
    else
      this.projectTowerLockersDetails(towerIndex).removeAt(index);
  }
  customTowerParkingsOpcode: number = 0;
  closeDialog() {
    this.dialogRef?.close();
  }
  saveCustomName(event) {
    if (this.customTowerParkingsOpcode == 1) {
      if (this.projectTowerParkingsDetails(this.tabIndex).length < 5)
        this.projectTowerParkingsDetails(this.tabIndex).push(this.newProjectTowerParkings(event.value));
    }
    else if (this.customTowerParkingsOpcode == 2) {
      if (this.projectTowerParkingsDetails(this.tabIndex).length < 5)
        this.projectTowerLockersDetails(this.tabIndex).push(this.newProjectTowerLockers(event.value));
    }
    else if (this.isCustomUnitType) {
      this.projectTowerUnitTypesDetails(this.tabIndex).push(this.newProjectTowerUnitTypes(0, event.value, false, 0));
      this.isCustomUnitType = false;
    }
    else {
      this.getProjectTax.push(this.newProjectTax(0, false, event.value, '', true, 0));
    }
    this.closeDialog();
  }
  openCustomNameDialog() {
    this.dialogRef = this.dialog.open(this.dialogAddCustomName, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }
  addTaxtype() {
    this.addCustomNameForLockersAndLockers(0, 3);
    // this.taxes.push({ taxType: '', value: '', checked: false, custom: true });
  }
  removeCustomTaxType(index) {
    this.getProjectTax.removeAt(index);
  }
  // getHighlighSkipedUnits(towerIndex,blockIndex,unitpricingindex,flatIndex){

  // return this.projectUnitFlatsDetail(towerIndex,blockIndex,unitpricingindex).at(flatIndex)?.get('isSkip')?.value;

  // }

  getUnitIndex(towerIndex, blockIndex, floorIndex) {
    var index = 0
    var projectFloorDetails = this.blockDetails(towerIndex).at(blockIndex)?.value?.projectFloorDetails?.length;
    if (projectFloorDetails > 0) {
      index = projectFloorDetails - (floorIndex + 1)
    }
    return index
  }

  getTotalBlocksLength(towerIndex, blockIndex) {
    var towerBlocks = this.towerList
      .at(towerIndex)
      .get('projectBlocks')?.value?.length;
    if (towerBlocks > 0) {
      return towerBlocks - blockIndex;
    }
    return blockIndex + 1;
  }

  projectUnitFlatsDetail(tabIndex: number, blockIndex: number, ufi: number) {
    return this.projectFloorDetails(tabIndex, blockIndex).at(ufi)
      .get('projectUnitFlats') as FormArray;
  }
  radioButtonChange(towerIndex, towerLockerIndex, opCode = 1, isTowerParking = false) {
    if (!isTowerParking) {
      if (opCode == 1) {
        if (this.projectTowerLockersDetails(towerIndex).at(towerLockerIndex)?.get('included')?.value) {
          this.projectTowerLockersDetails(towerIndex).at(towerLockerIndex)?.get('eligible')?.setValue(false);
        }
      }
      else {
        if (this.projectTowerLockersDetails(towerIndex).at(towerLockerIndex)?.get('eligible')?.value) {
          this.projectTowerLockersDetails(towerIndex).at(towerLockerIndex)?.get('included')?.setValue(false);
        }
      }
    }
    else {
      if (opCode == 1) {
        if (this.projectTowerParkingsDetails(towerIndex).at(towerLockerIndex)?.get('included')?.value) {
          this.projectTowerParkingsDetails(towerIndex).at(towerLockerIndex)?.get('eligible')?.setValue(false);
        }
      }
      else {
        if (this.projectTowerParkingsDetails(towerIndex).at(towerLockerIndex)?.get('eligible')?.value) {
          this.projectTowerParkingsDetails(towerIndex).at(towerLockerIndex)?.get('included')?.setValue(false);
        }
      }
    }
  }
  onChangetax(taxIdx: number = 0) {

    if (!this.getProjectTax?.at(taxIdx).get('checked')?.value) {
      this.getProjectTax?.at(taxIdx).get('value')?.setValue('');
      this.getProjectTax?.at(taxIdx).get('value')?.disable();
    }
    else {
      this.getProjectTax?.at(taxIdx).get('value')?.enable();
    }
  }

  bedRoomsDetailForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex) {
    return this.projectUnitFlatsDetail(tabIndex, blockIndex, unitPricingIndex).at(flatIndex)
      .get('flatBedRooms') as FormArray;
  }
  bathRoomsDetailForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex) {
    return this.projectUnitFlatsDetail(tabIndex, blockIndex, unitPricingIndex).at(flatIndex)
      .get('flatbathroomSizes') as FormArray;
  }
  terranceDetailForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex) {
    return this.projectUnitFlatsDetail(tabIndex, blockIndex, unitPricingIndex).at(flatIndex)
      .get('flatterraceSizes') as FormArray;
  }
  balconyDetailForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex) {
    return this.projectUnitFlatsDetail(tabIndex, blockIndex, unitPricingIndex).at(flatIndex)
      .get('flatbalconysizes') as FormArray;
  }
  // projectUnitFlatsDetailForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex) {
  //   return this.projectUnitFlatsDetail(tabIndex, blockIndex, unitPricingIndex).at(flatIndex)
  //     .get('projectUnitFlats') as FormArray;
  // }
  denDetailForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex) {
    return this.projectUnitFlatsDetail(tabIndex, blockIndex, unitPricingIndex).at(flatIndex)
      .get('flatdenSizes') as FormArray;
  }
  updateSkipOptionInUnits(event) {
    if (this.towerList != null) {
      // var arr:any=[] ;
      var tabIndex = this.tabIndex;
      this.towerList.value.forEach((element, towerIndex) => {
        this.endFloorPrevValue = 0;
        this.tabIndex = towerIndex;
        this.blockDetails(towerIndex).value.forEach((item, blockIndex) => {
          (this.blockDetails(towerIndex).at(blockIndex)?.get('projectFloorDetails') as FormArray).controls = [];
          (this.blockDetails(towerIndex).at(blockIndex)?.get('projectFloorDetails') as FormArray).patchValue([]);
          this.addProjectUnitFlast(this.blockDetails(towerIndex).at(blockIndex)?.value, this.blockDetails(towerIndex).at(blockIndex))
          //arr.push(result)
          //  var result = this.addProjectUnitFlast(this.blockDetails(towerIndex).at(blockIndex)?.value, item)
          //(this.blockDetails(towerIndex).at(blockIndex)?.get('projectFloorDetails') as FormArray).patchValue(result.get('projectFloorDetails') as FormArray);
          //this.addUnitFlats(towerIndex, blockIndex, this.blockDetails(towerIndex).at(blockIndex))
        })
      });
    }
    // this.towerList?.reset();
    // this.isUnitValueEntered = false;
    // this.form.get('numberofTowers')?.reset();
  }

  setSameCeilingHeight(towerIndex, val) {
    if (!val) {
      this.towerList.at(towerIndex).get('ceilingHeight')?.setValue(0);
      this.towerList.at(towerIndex).get('ceilingHeight')?.disable();
    }
    else
      this.towerList.at(towerIndex).get('ceilingHeight')?.enable();
  }

  disableEnableTax(val) {
    if (!val) {
      this.getProjectTax.controls.forEach((element, index) => {
        this.getProjectTax?.at(index).get('value')?.setValue('');
        this.getProjectTax?.at(index).get('checked')?.setValue(false);
        this.getProjectTax?.at(index).get('checked')?.disable();
        this.getProjectTax?.at(index).get('value')?.disable();
      })
    }
    else {
      this.getProjectTax.controls.forEach((element, index) => {
        this.getProjectTax?.at(index).get('checked')?.enable();
        this.getProjectTax?.at(index).get('value')?.enable();
      })
    }
  }

  addUnittype() {
    this.isCustomUnitType = true;
    this.addCustomNameForLockersAndLockers(0, 3);
  }

  removeCustomUnitType(index) {
    this.projectTowerUnitTypesDetails(this.tabIndex).removeAt(index);
  }
  handleNullValueForNumber(e, towerIndex, blockIndex) {
    if (e.target.value == '') {
      e.target.value = 0
      this.blockDetails(towerIndex).at(blockIndex).get("floorPremium")?.setValue(0);
    }
  }

  checkTotalUnitCount() {
    var count = this.checkValidationOnUnits();
    if (count > 10000) {
      this.snackbarWrapperService.open(`You cannot add max 10000 units in a project `);
      this.towerList.at(this.tabIndex).get("totalUnits")?.setValue(0);
    }
  }

  checkValidationOnUnits() {
    let count = 0;
    this.towerList?.value?.forEach(tower => {
      count += tower.totalUnits;
    });
    return count;
  }

}
