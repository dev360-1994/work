import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { IFormBuilder } from '@rxweb/types';
import { Flatbalconysize, FlatbathroomSize, FlatBedRoom, FlatdenSize, FlatprojectUnitAdditionalFeature, FlatterraceSize, ProjectUnitFlat, ProjectUnitFlat1 } from '../../../models/project-res.model';
import { DropDownCONSTANT } from '../../../__dropDownConstants';

@Component({
  selector: 'app-unit-pricing-detail',
  templateUrl: './unit-pricing-detail.component.html',
  styleUrls: ['./unit-pricing-detail.component.scss']
})
export class UnitPricingDetailComponent implements OnInit {
  towerIndex: number = 0;
  blockIndex: number = 0;
  selectedFloorNo: number = 0
  unitIndex: number = 0;
  selectedIndex: any = 1;
  floorIndex = 0;
  unitFlatIndex = 0;
  fb: IFormBuilder;
  isContinue: boolean = false;
  @ViewChild('pdfTemplate')
  pdfTemplate!: TemplateRef<any>;
  @ViewChild('customNameDialog') customNameDialog!: TemplateRef<any>;
  @ViewChild('editDelDialog') editDelDialog!: TemplateRef<any>;
  @ViewChild('confirmFloorPremimumDialog') confirmFloorPremimumDialog!: TemplateRef<any>;
  //@ViewChild('confirmSaveOnBackDialog') confirmSaveOnBackDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  file: any;
  isProcessing!: boolean;
  fileObj: any;
  unitNumber: string = '';
  fileIndex: any;
  selectedStackName: string = '';
  unitTypes: any;
  floorPremium: number = 0;
  unitpricingIndex = 0;
  isSingleSelection: boolean = false;
  selectedUnitFlatIndex: number = 0;
  readonly constant = DropDownCONSTANT;
  unitFlatForm!: FormGroup;
  unitsToCopy: any = [];
  selectedValueToCopy: any = [];
  @Input() form!: FormGroup;
  @Output() formEmitter = new EventEmitter<FormGroup>();
  @Output() stepperChange = new EventEmitter<any>();
  @Output() onSaveData = new EventEmitter<boolean>();
  constructor(

    private dialog: MatDialog,
    public fb2: FormBuilder,
    private snackbarWrapperService: SnackbarWrapperService
  ) {
    this.fb = fb2;

  }

  ngOnInit(): void {
    console.log("grid from last page value", this.form.value);
    // this.form.get('towerIndex')?.setValue(0);
    // this.form.get('blockIndex')?.setValue(0);
    this.blockIndex = this.form.get('blockIndex')?.value;
    this.towerIndex = this.form.get('towerIndex')?.value;
    this.refreshCopiedUnits();
    this.unitFlatForm = this.initSecondryform();
    this.unitFlatTypeChanges();

    // this.unitFlatForm?.get('unitType')?.valueChanges.subscribe(res => {
    //   // if (res != "1") {
    //   this.unitFlatForm.get('noOfBedroom')?.clearValidators()
    //   this.unitFlatForm.get('nOofBaths')?.clearValidators()
    //   this.unitFlatForm.get('noofBalcony')?.clearValidators()
    //   this.unitFlatForm.get('noofDen')?.clearValidators()
    //   this.unitFlatForm.get('terrace')?.clearValidators()

    //   this.unitFlatForm.get('noOfBedroom')?.updateValueAndValidity()
    //   this.unitFlatForm.get('nOofBaths')?.updateValueAndValidity()
    //   this.unitFlatForm.get('noofBalcony')?.updateValueAndValidity()
    //   this.unitFlatForm.get('noofDen')?.updateValueAndValidity()
    //   this.unitFlatForm.get('terrace')?.updateValueAndValidity()
    //   // } else {
    //   //   this.unitFlatForm.get('noOfBedroom')?.setValidators([Validators.required])
    //   //   this.unitFlatForm.get('nOofBaths')?.setValidators([Validators.required])
    //   //   this.unitFlatForm.get('noofBalcony')?.setValidators([Validators.required])
    //   //   this.unitFlatForm.get('noofDen')?.setValidators([Validators.required])
    //   //   this.unitFlatForm.get('terrace')?.setValidators([Validators.required])
    //   //   this.unitFlatForm.markAsPristine();
    //   //   this.unitFlatForm.get('noOfBedroom')?.updateValueAndValidity()
    //   //   this.unitFlatForm.get('nOofBaths')?.updateValueAndValidity()
    //   //   this.unitFlatForm.get('noofBalcony')?.updateValueAndValidity()
    //   //   this.unitFlatForm.get('noofDen')?.updateValueAndValidity()
    //   //   this.unitFlatForm.get('terrace')?.updateValueAndValidity()
    //   // }
    // });
    this.unitTypes = this.projectTowerUnitTypesDetails(this.towerIndex)?.value?.filter(item => item.isSelected);
  }

  unitFlatTypeChanges() {
    this.unitFlatForm?.get('unitType')?.valueChanges.subscribe(res => {
      // if (res != "1") {
      if (res == '' || res == 'null' || res == null) {
        this.unitFlatForm?.get('unitType')?.setErrors({ 'incorrect': true });
      }
      this.unitFlatForm.get('noOfBedroom')?.clearValidators()
      this.unitFlatForm.get('nOofBaths')?.clearValidators()
      this.unitFlatForm.get('noofBalcony')?.clearValidators()
      this.unitFlatForm.get('noofDen')?.clearValidators()
      this.unitFlatForm.get('terrace')?.clearValidators()

      this.unitFlatForm.get('noOfBedroom')?.updateValueAndValidity()
      this.unitFlatForm.get('nOofBaths')?.updateValueAndValidity()
      this.unitFlatForm.get('noofBalcony')?.updateValueAndValidity()
      this.unitFlatForm.get('noofDen')?.updateValueAndValidity()
      this.unitFlatForm.get('terrace')?.updateValueAndValidity()
      // } else {
      //   this.unitFlatForm.get('noOfBedroom')?.setValidators([Validators.required])
      //   this.unitFlatForm.get('nOofBaths')?.setValidators([Validators.required])
      //   this.unitFlatForm.get('noofBalcony')?.setValidators([Validators.required])
      //   this.unitFlatForm.get('noofDen')?.setValidators([Validators.required])
      //   this.unitFlatForm.get('terrace')?.setValidators([Validators.required])
      //   this.unitFlatForm.markAsPristine();
      //   this.unitFlatForm.get('noOfBedroom')?.updateValueAndValidity()
      //   this.unitFlatForm.get('nOofBaths')?.updateValueAndValidity()
      //   this.unitFlatForm.get('noofBalcony')?.updateValueAndValidity()
      //   this.unitFlatForm.get('noofDen')?.updateValueAndValidity()
      //   this.unitFlatForm.get('terrace')?.updateValueAndValidity()
      // }
    });
  }

  refreshCopiedUnits() {
    if (this.blockDetails(this.towerIndex)?.value?.length > 0) {
      this.setCopiedUnitBlockoninit().then(x => {
        this.unitsToCopy = x;
      }, err => console.log("error", err));
    }

    this.unitTypes = this.projectTowerUnitTypesDetails(this.towerIndex)?.value?.filter(item => item.isSelected);
  }
  get tabList(): FormArray {
    return this.form.get('projectTower') as FormArray;
  }
  blockDetails(tabIndex: number): FormArray {
    return this.tabList
      .at(tabIndex)
      .get('projectBlocks') as FormArray;
  }

  projectTowerUnitTypesDetails(tabIndex: number): FormArray {
    return this.tabList
      .at(tabIndex)
      .get('projectTowerUnitTypes') as FormArray;
  }


  initSecondryform(flatStaus = "", isSkip = false, price: number | null = null, interiorSize: number | null = null, ceilingHeight: number | null = null, unitName = '', balconysizes: number | null = null, floorPremium: number | null = null, view = 0, livingRoomSize: number | null = null, diningRoomSize: number | null = null, noOfBedroom: number | null = null, nOofBaths: number | null = null, terrace: number | null = null, noofBalcony: number | null = null, noofden: number | null = null, unitTypeId: number | null = null, unitType = '', isDelete = false): FormGroup {
    let unitForm = this.fb.group<ProjectUnitFlat1>({
      flatStatus: flatStaus ?? '',
      isSkip: isSkip ?? false,
      unitTypeId: unitTypeId,
      unitType: [unitType, Validators.required],
      price: [price, Validators.required],
      interiorSize: [interiorSize, Validators.required],
      ceilingHeight: [ceilingHeight, Validators.required],
      unitName: [unitName, Validators.required],
      balconySize: [balconysizes, Validators.required],
      floorPremium: this.floorPremium > 0 ? this.floorPremium : floorPremium,
      view: [view, Validators.required],
      livingRoomSize: [livingRoomSize],
      diningRoomSize: [diningRoomSize],
      noOfBedroom: [noOfBedroom],
      nOofBaths: [nOofBaths],
      flatBedRooms: this.fb.array<FlatBedRoom>([]),
      flatbathroomSizes: this.fb.array<FlatbathroomSize>([]),
      flatterraceSizes: this.fb.array<FlatterraceSize>([]),
      flatbalconysizes: this.fb.array<Flatbalconysize>([]),
      flatdenSizes: this.fb.array<FlatdenSize>([]),
      terrace: [terrace],
      noofBalcony: [noofBalcony],
      noofDen: [noofden],
      flatProjectUnitAdditionalFeatures: this.fb.array<FlatprojectUnitAdditionalFeature>([]),
      floorPlanFile: "",
      PlanSchedlePath: "",
    });
    if (!isDelete) {
      if (this.tabList?.value[this.towerIndex]?.projectTowerParkings?.length > 0) {
        (unitForm.get('flatProjectUnitAdditionalFeatures') as FormArray).controls = [];
        (unitForm.get('flatProjectUnitAdditionalFeatures') as FormArray).setValue([]);
        this.tabList?.value[this.towerIndex]?.projectTowerParkings?.forEach(pe => {
          (unitForm.get('flatProjectUnitAdditionalFeatures') as FormArray).push(this.newProjectUnitAdditionalFeaturesForFlat(pe?.name, 0, 0, pe.included, pe.eligible))
        })
      }
      // if (this.floorPremium > 0) {
      //   unitForm?.get('floorPremium')?.disable();
      // }

      if (this.tabList?.value[this.towerIndex]?.projectTowerLockers?.length > 0) {
        this.tabList?.value[this.towerIndex]?.projectTowerLockers?.forEach(le => {
          (unitForm.get('flatProjectUnitAdditionalFeatures') as FormArray).push(this.newProjectUnitAdditionalFeaturesForFlat(le?.name, 0, 0, le.included ?? false, le.eligible ?? false))
        })
      }
      if (unitForm.get('flatProjectUnitAdditionalFeatures')?.value?.length == 0) {
        (unitForm.get('flatProjectUnitAdditionalFeatures') as FormArray).push(this.newProjectUnitAdditionalFeaturesForFlat())
      }
    }
    return unitForm
  }

  projectFloorDetails(tabIndex, blockIndex: number) {
    return this.blockDetails(tabIndex).at(blockIndex)
      .get('projectFloorDetails') as FormArray;


  }

  getBlockIndex(towerIndex, blockIndex, floorIndex) {
    var index = 0
    var projectFloorDetails = this.blockDetails(towerIndex).at(blockIndex)?.value?.projectFloorDetails?.length;
    if (projectFloorDetails > 0) {
      index = projectFloorDetails - (floorIndex + 1)
    }
    return index
  }
  getFloors(towerIndex, blockIndex) {
    return this.blockDetails(towerIndex)?.value?.length > 0 ? this.projectFloorDetails(towerIndex, blockIndex)?.value : []
  }
  getFlats(towerIdx, blockIdx, floorIdx) {
    return this.blockDetails(towerIdx)?.value?.length > 0 ? this.projectUnitFlatsDetail(towerIdx, blockIdx, floorIdx)?.value : []
  }

  projectUnitFlatsDetail(tabIndex: number, blockIndex: number, ufi: number) {

    return this.projectFloorDetails(tabIndex, blockIndex).at(ufi)
      .get('projectUnitFlats') as FormArray;
  }


  // projectUnitAdditionalFeaturesDetail(tabIndex: number, blockIndex: number, unitPricingIndex: number) {
  //   return this.projectFloorDetails(tabIndex, blockIndex).at(unitPricingIndex)
  //     .get('projectUnitAdditionalFeatures') as FormArray;
  // }

  projectUnitAdditionalFeaturesDetailForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex: number) {
    return this.projectUnitFlatsDetail(tabIndex, blockIndex, unitPricingIndex).at(flatIndex)
      .get('flatProjectUnitAdditionalFeatures') as FormArray;
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
  denDetailForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex) {
    return this.projectUnitFlatsDetail(tabIndex, blockIndex, unitPricingIndex).at(flatIndex)
      .get('flatdenSizes') as FormArray;
  }
  addBedroomDetailsForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex: number) {
    this.bedRoomsDetailForFlat(tabIndex, blockIndex, unitPricingIndex, flatIndex).push(this.newBedRoomsForFlat());
  }
  addbathroomDetailsForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex) {
    this.bathRoomsDetailForFlat(tabIndex, blockIndex, unitPricingIndex, flatIndex).push(this.newBathRoomSizesForFlat());
  }
  addTerraceDetailsForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex: number) {

    this.terranceDetailForFlat(tabIndex, blockIndex, unitPricingIndex, flatIndex).push(this.newTerraceSizesForFlat());
  }
  addBalconyDetailsForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex: number) {

    this.balconyDetailForFlat(tabIndex, blockIndex, unitPricingIndex, flatIndex).push(this.newBalconySizesForFlat());
  }
  addDenDetailsForFlat(tabIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex: number) {
    this.denDetailForFlat(tabIndex, blockIndex, unitPricingIndex, flatIndex).push(this.newDenSizesForFlat());
  }

  newBedRoomsForFlat(id: number = 0, flatId: number = 0, number: number = 0, size: null | number = 0): FormGroup {
    return this.fb.group<FlatBedRoom>({
      bedRoomsId: id,
      flatId: flatId,
      number: number,
      size: size
    });
  }
  newBathRoomSizesForFlat(bathsId: number = 0, flatId: number = 0, number: number = 0, size: number | null = 0): FormGroup {
    return this.fb.group<FlatbathroomSize>({
      bathsId: bathsId,
      flatId: flatId,
      number: number,
      size: size
    });
  }
  newTerraceSizesForFlat(terraceId: number = 0, flatId: number = 0, number: number = 0, size: number | null = 0): FormGroup {
    return this.fb.group<FlatterraceSize>({
      terraceId: terraceId,
      flatId: flatId,
      number: number,
      size: size
    });
  }
  newBalconySizesForFlat(balconyId: number = 0, flatId: number = 0, number: number = 0, size: number | null = 0): FormGroup {
    return this.fb.group<Flatbalconysize>({
      balconyId: balconyId,
      flatId: flatId,
      number: number,
      size: size
    });
  }
  newDenSizesForFlat(denId: number = 0, flatId: number = 0, number: number = 0, size: null | number = 0): FormGroup {
    return this.fb.group<FlatdenSize>({
      denId: denId,
      flatId: flatId,
      number: number,
      size: size
    });
  }
  newProjectUnitAdditionalFeaturesForFlat(name = 'parking', id: number = 0, flatId: number = 0, isIncluded = false, isEligible = false, isChecked = false): FormGroup {
    return this.fb.group({
      additionalFeatureId: id,
      flatId: flatId,
      name: name,
      isChecked: isChecked,
      isIncluded: isIncluded,
      isEligible: isEligible
    });
  }
  counter(i: number) {
    return new Array(i);
  }

  openPdfDialog() {
    this.dialogRef = this.dialog.open(this.pdfTemplate, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
  }
  savePdfDoc() {
    if (this.fileObj)
      this.fileIndex == 0 ?
        this.projectFloorDetails(this.form.get('towerIndex')?.value, this.form.get('blockIndex')?.value)?.at(this.unitIndex)?.get('floorPlanFile')?.setValue(this.fileObj) :
        this.projectFloorDetails(this.form.get('towerIndex')?.value, this.form.get('blockIndex')?.value)?.at(this.unitIndex)?.get('planScheduleFile')?.setValue(this.fileObj)

    this.dialogRef?.close();
  }
  exitpdfdoc() {
    this.file = '';
    this.fileObj = '';
    this.dialogRef?.close();
    // this.imageChangedEvent = null;
    const ele: HTMLInputElement = this.fileIndex == 0 ? document.getElementById('floorPlanFile') as HTMLInputElement : document.getElementById('planScheduleFile') as HTMLInputElement;
    if (ele) {
      ele.value = '';
    }
  }
  uploadPdfFile(event: any, index: number) {
    this.fileIndex = index;
    this.fileObj = event.target.files[0];
    this.file = event.target.files[0];
    this.openPdfDialog();
    if (event.target.files[0].type == 'application/pdf') {
      if (typeof (FileReader) !== 'undefined') {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.file = e.target.result;
        };
        // this.isPdfUploaded = true;
        reader.readAsArrayBuffer(this.file);
      }
    } else {
      alert('Please upload pdf file')
    }
  }
  onFileChange(event: any, index: number) {
    this.fileIndex = index;
    if (event != null && event.length > 0 && event.length == 1 && event[0].type == 'application/pdf') {
      this.fileObj = event[0];
      this.file = event[0];
      this.openPdfDialog();
      if (typeof (FileReader) !== 'undefined') {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.file = e.target.result;
        };
        reader.readAsArrayBuffer(this.file);
      }
    } else {
      alert('Please upload pdf file')
    }
  }
  bedroomChange(e: any) {

    this.clearFormArray((this.unitFlatForm.get('flatBedRooms') as FormArray))
    if (e?.target.value > 0) {
      for (let i = 1; i <= e?.target.value; i++) {
        (this.unitFlatForm.get('flatBedRooms') as FormArray).push(this.newBedRoomsForFlat(0, 0, 0, null));
      }
    }
  }
  bathRoomChange(e: any) {
    this.clearFormArray((this.unitFlatForm.get('flatbathroomSizes') as FormArray))

    if (e?.target.value > 0) {
      for (let i = 1; i <= e?.target.value; i++) {
        (this.unitFlatForm.get('flatbathroomSizes') as FormArray).push(this.newBathRoomSizesForFlat(0, 0, 0, null));
      }
    }
  }
  balconyChange(e: any) {

    this.clearFormArray((this.unitFlatForm.get('flatbalconysizes') as FormArray))
    if (e?.target.value > 0) {
      for (let i = 1; i <= e?.target.value; i++) {
        (this.unitFlatForm.get('flatbalconysizes') as FormArray).push(this.newBalconySizesForFlat(0, 0, 0, null));
      }
    }
  }

  terranceChange(e: any) {

    this.clearFormArray((this.unitFlatForm.get('flatterraceSizes') as FormArray))
    if (e?.target.value > 0) {
      for (let i = 1; i <= e?.target.value; i++) {
        (this.unitFlatForm.get('flatterraceSizes') as FormArray).push(this.newTerraceSizesForFlat(0, 0, 0, null));
      }
    }

  }

  denChange(e: any) {

    this.clearFormArray((this.unitFlatForm.get('flatdenSizes') as FormArray));
    if (e?.target.value > 0) {
      for (let i = 1; i <= e?.target.value; i++) {
        (this.unitFlatForm.get('flatdenSizes') as FormArray).push(this.newDenSizesForFlat(0, 0, 0, null));
      }
    }
  }
  fileChangeEvent(e: any) { }

  backToGrid() {
    // if(this.isContinue){
    //  this.openDialogOnBack(); 
    // }
    // else{
    //   this.stepperChange.emit();
    // }
    this.stepperChange.emit();
  }
  onSave() {
    this.stepperChange.emit();
    this.formEmitter.emit(this.form);
    this.onSaveData.emit(true);
  }
  getTotalUnits() {
    if (this.blockDetails(this.towerIndex)?.value?.length > 0) {
      var toFloor = this.blockDetails(this.towerIndex).at(this.form.get('blockIndex')?.value).get("toFloor")?.value;
      var startFloor = this.blockDetails(this.towerIndex).at(this.form.get('blockIndex')?.value).get("startingFloor")?.value;
      var tottalFloor = (toFloor - startFloor) + 1;
      var totalUnitsPerFloor = this.blockDetails(this.towerIndex).at(this.form.get('blockIndex')?.value).get('numberUnitsPerFloor')?.value
      var totalUnits = ((toFloor - startFloor) + 1) * totalUnitsPerFloor;
      return tottalFloor + " floors * " + totalUnitsPerFloor + " units | " + totalUnits + " | " + startFloor + " - " + toFloor + " floors";
    }
    else
      return null
  }
  showSelectedFloor(towerIndex, blockIndex, floorIndex, flatNo): any {
    if (this.blockDetails(towerIndex)?.value?.length > 0) {
      return this.projectUnitFlatsDetail(towerIndex, blockIndex, floorIndex)?.value?.find(x => x.flatNo == flatNo)?.isMultipleStackSelected;
    }
    else return [];
  }
  customFlatIndex: number = 0;
  customOpCode: number = 0;
  addprojectUnitAdditionalFeaturesDetail(towerIndex: number, blockIndex: number, unitPricingIndex: number, flatIndex: number = 0, opCode: number = 0) {
    this.towerIndex = towerIndex;
    this.blockIndex = blockIndex;
    this.unitpricingIndex = unitPricingIndex;
    this.customFlatIndex = flatIndex;
    this.customOpCode = opCode;
    this.openCustomNameDialog();

  }
  saveCustomName(event) {
    if (this.customOpCode == 1) {
      if (this.projectUnitAdditionalFeaturesDetailForFlat(this.towerIndex, this.blockIndex, this.unitpricingIndex, this.customFlatIndex).length < 5)
        this.projectUnitAdditionalFeaturesDetailForFlat(this.towerIndex, this.blockIndex, this.unitpricingIndex, this.customFlatIndex).push(this.newProjectUnitAdditionalFeaturesForFlat(event.value));
      this.closeDialog();
    }
  }
  closeDialog() {
    this.dialogRef?.close();
  }
  openCustomNameDialog() {
    this.dialogRef = this.dialog.open(this.customNameDialog, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
  }

  towerChange(event) {
    this.towerIndex = parseInt(event.target.value);
    this.form.get('towerIndex')?.setValue(event.target.value)
    this.blockIndex = 0;
    this.form.get('blockIndex')?.setValue(0);    // this.setCopiedBlockoninit();
    this.refreshCopiedUnits();
    this.selectedStackName = '';
    this.unitNumber = '';
    // this.form.get('blockIndex')?.setValue(0);
  }
  clickContinue() {
    //towerIndex, blockIndex
    var details = this.blockDetails(this.towerIndex)?.value?.at(this.blockIndex);
    this.floorPremium = details != null && details.floorPremium > 0 ? details.floorPremium : 0;

    if (this.selectedStackName.length == 0 && !this.isSingleSelection && this.unitNumber.length == 0)
      this.snackbarWrapperService.open("please select any stack");
    else
      this.isContinue = true;
    this.unitFlatForm = this.initSecondryform();
    this.unitFlatTypeChanges();
  }

  setStackNumber(tabIndex, blockIndex, stackNo, isSelected) {
    if (tabIndex >= 0 && blockIndex >= 0 && stackNo >= 0) {
      // let startFloor = this.blockDetails(tabIndex).at(blockIndex).get('startingFloor')?.value;
      // let toFloor = this.blockDetails(tabIndex).at(blockIndex).get('toFloor')?.value;
      this.unitNumber = '';
      // this.selectedStackName = this.projectUnitPricingDetail(tabIndex, blockIndex)?.value.map(x => x.unitNumber).join(",")
      // this.selectedFloorName = this.projectFloorDetails(tabIndex, blockIndex)?.value.filter(x => x.isFloorSelected).map(x => x.floorNo).join(",")


      if (this.selectedStackName.length > 0 && this.selectedStackName.split(",").indexOf(stackNo.toString()) > -1 && !isSelected) {
        var arr = this.selectedStackName.split(",");
        var index = arr.indexOf(stackNo.toString());
        if (index > -1) {
          arr.splice(index, 1);
          this.selectedStackName = arr.join(",")
        }
      }
      else if (isSelected) {
        this.selectedStackName += this.selectedStackName != '' ? ',' + stackNo + 1 : stackNo + 1
        this.selectedUnitFlatIndex = stackNo;
      }
      if (this.selectedStackName.length == 0)
        return;
      // this.selectedStackName.split(",").forEach(x => {
      //   for (var i = startFloor; i <= toFloor; i++) {
      //     var temp = parseInt(x) <= 9 ? i + '0' + x : i + '' + x
      //     this.unitNumber += this.unitNumber != '' ? ',' + temp : temp;
      //   }
      // });    
      // this.selectedStackName?.split(",").forEach(val => {
      //   this.selectedUnitFlatNo = this.projectFloorDetails(tabIndex, blockIndex)?.value?.find(x => x.isFloorSelected && x.floorNo == val)?.projectUnitFlats[0]?.flatNo;
      // });
    }
  }
  isMultiSelect: boolean = false;
  setSelectedStack(stackNo: number, tabIndex: number, blockIndex: number) {
    if (this.unitNumber.length > 0) {
      this.snackbarWrapperService.open("you Can't select Stack as Single Select is on")
      return
    }
    if (this.isContinue) {
      this.snackbarWrapperService.open("Please add stack to continue")
      return;
    }

    if ((this.unitsToCopy.findIndex(y => y.id == stackNo && y.isStack == true && y.blockIndex == this.blockIndex) >= 0)) {
      this.selectedStackName = stackNo.toString();
      this.openEditDelDialogfun();
      return;
    }

    if (stackNo >= 0 && tabIndex >= 0 && blockIndex >= 0) {
      if (this.isSingleSelection) {
        this.snackbarWrapperService.open("you Can't select Stack as Single Select is on")
        return
      }

      let isSelected = false;
      // floorNo += 1;
      this.selectedFloorNo = stackNo;
      // this.unitNumber = floorNo.toString();
      // let floorIndex = this.projectFloorDetails(tabIndex, blockIndex)?.value.findIndex(x => x.floorNo == floorNo);
      // if (floorIndex == -1) {
      //   console.log("floor not found");
      //   return;
      // }
      if (this.selectedStackName.length > 0 && this.selectedStackName.split(",").indexOf((stackNo).toString()) > -1) {
        var arr = this.selectedStackName.split(",");
        var index = arr.indexOf((stackNo).toString());
        if (index > -1) {
          arr.splice(index, 1);
          this.selectedStackName = arr.join(",")
          isSelected = false;
        }
      }
      else {
        this.selectedStackName += (this.selectedStackName != '' ? ',' + (stackNo) : (stackNo));
        this.selectedUnitFlatIndex = stackNo;
        isSelected = true;
      }

      this.selectedUnitFlatIndex = stackNo;

      // this.blockDetails(tabIndex)?.value.forEach((block, bi) => {
      //   if (bi == blockIndex) {
      //     block?.projectFloorDetails?.forEach(floor => {
      //       floor?.projectUnitFlats?.forEach((flat, fi) => {
      //         if (fi == stackNo - 1 && !flat.isSingleStackSelected) {
      //           flat.isMultipleStackSelected = isSelected;
      //         }
      //       });
      //     });
      //   }
      // });
    }
  }

  unitChange(event, tabIndex, blockIndex) {
    this.selectedValueToCopy;
    if (!event?.isStack && event?.id > 0) {
      if (tabIndex >= 0 && blockIndex >= 0) {
        let flatMap: any;
        this.blockDetails(tabIndex)?.value?.forEach((b, bi) => b?.projectFloorDetails?.forEach(y =>
          y?.projectUnitFlats.forEach((x, i) => {
            if (x.flatNo == event.id && bi == event.blockIndex) {
              flatMap = x;
            }
          })));
        console.log("flat to edit", flatMap.flatNo);
        if (flatMap)
          this.setValue_In_UnitFormToEdit(flatMap);
      }
    }
    else {
      if (tabIndex >= 0 && blockIndex >= 0 && event?.isStack && event?.id > 0) {
        let flatMap: any;
        this.blockDetails(tabIndex)?.value?.forEach((b, bi) => b?.projectFloorDetails[0]?.projectUnitFlats.forEach((x, i) => {
          if (i == (event?.id - 1) && bi == event?.blockIndex) {
            flatMap = x;
          }
        }));
        if (flatMap)
          this.setValue_In_UnitFormToEdit(flatMap);
      }
    }
  }
  checkValidation = (f: FormGroup): any => {
    const invalid: any = [];
    const controls = f.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  addStack() {
    const unitType = this.unitFlatForm?.get('unitType')?.value;
    if (unitType == '' || unitType == 'null' || unitType == null) {
      this.unitFlatForm?.get('unitType')?.setErrors({ 'incorrect': true });
    }

    if (this.unitFlatForm.invalid) {
      this.unitFlatForm.markAllAsTouched();
      let value = this.checkValidation(this.unitFlatForm);
      this.snackbarWrapperService.open(`${value.join()} Fields are invalid`);
      return;
    }
   // console.log('add stackform=>', this.form.value);
    this.updatemainForm();
    console.log('after stackform=>', this.form.value);
    this.unitFlatForm = this.initSecondryform();
    this.unitFlatTypeChanges();
    (this.unitFlatForm?.get('flatBedRooms') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatbathroomSizes') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatbalconysizes') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatterraceSizes') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatdenSizes') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatProjectUnitAdditionalFeatures') as FormArray).controls = []
    // if (this.selectedStackName.length > 0) {
    //   this.selectedStackName.split(',').forEach(x => {
    //     //   if(this.selectedUnits.findIndex(y=>y.iD==parseInt(x))==-1)
    //     //  this.selectedUnits.push({iD:parseInt(x)});
    //     if ((this.blockDetails(this.towerIndex)?.at(this.blockIndex)?.get('copiedFloors') as FormArray)?.value.findIndex(y => y.floorId == parseInt(x)) == -1)
    //       (this.blockDetails(this.towerIndex)?.at(this.blockIndex)?.get('copiedFloors') as FormArray).push(this.fb.group({ floorId: parseInt(x) }))
    //   })
    // }
    this.isContinue = false;
    this.isSingleSelection = false;
    this.selectedStackName = '';
    this.unitNumber = '';
    this.refreshCopiedUnits();
  }

  blockChange(event) {
    this.blockIndex = parseInt(event.target.value);
    this.form.get('blockIndex')?.setValue(event.target.value);
    this.isContinue = false;
    this.selectedStackName = '';
    this.unitNumber = '';
    // this.setCopiedBlockoninit();
    this.refreshCopiedUnits();
    this.unitFlatForm = this.initSecondryform();
    this.unitFlatTypeChanges();
    (this.unitFlatForm?.get('flatBedRooms') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatbathroomSizes') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatbalconysizes') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatterraceSizes') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatdenSizes') as FormArray).controls = [];
    (this.unitFlatForm?.get('flatProjectUnitAdditionalFeatures') as FormArray).controls = []

  }
  // sortedFloorValues: any = [];
  singleUnitClick(towerIndex, blockIndex, floorIndex, floorNo, flatInfo) {
    if (this.selectedStackName.length > 0) {
      this.snackbarWrapperService.open("Can't Choose Single Select when Stack is Selected");
      return;
    }
    if (this.isContinue) {
      this.snackbarWrapperService.open("Please add stack to continue")
      return;
    }
    // this.sortedFloorValues = this.projectFloorDetails(towerIndex, blockIndex)?.value?.sort((a, b) => parseInt(b.floorNo) - parseInt(a.floorNo));

    if ((this.unitsToCopy.findIndex(y => y.id == flatInfo?.flatNo && y.isStack == false, blockIndex == this.blockIndex) >= 0)) {
      this.unitNumber = (flatInfo.flatNo).toString();
      this.floorIndex = floorIndex;
      this.openEditDelDialogfun();
      return;
    }

    let flatNo = flatInfo?.flatNo
    let isSelected = false;
    if (this.unitNumber.length > 0 && this.unitNumber.split(",").indexOf(flatNo.toString()) > -1) {
      var arr = this.unitNumber.split(",");
      var index = arr.indexOf(flatNo.toString());
      if (index > -1) {
        arr.splice(index, 1);
        this.unitNumber = arr.join(",")
        isSelected = false;
      }
    }
    else {
      this.unitNumber += this.unitNumber != '' ? ',' + (flatNo) : (flatNo);
      isSelected = true;
    }


    if (towerIndex >= 0 && blockIndex >= 0 && floorIndex >= 0 && floorNo >= 0 && flatNo >= 0) {
      if (this.isContinue) {
        this.snackbarWrapperService.open("Please add stack to continue")
        return;
      }
      if (this.selectedStackName.length > 0) {
        this.snackbarWrapperService.open("Can't Choose Single Select when Stack is Selected");
        return;
      }
      // this.sortedFloorValues = this.projectFloorDetails(towerIndex, blockIndex)?.value?.sort((a, b) => parseInt(b.floorNo) - parseInt(a.floorNo));
      // this.sortedFloorValues?.find((x, fi) => {
      //   x.projectUnitFlats.findIndex((y, i) => {
      //     if (y.flatNo == flatNo) {
      //      // y.isSingleStackSelected = !y?.isSingleStackSelected;
      //       this.selectedUnitFlatIndex = i;
      //       //       this.projectUnitFlatsDetail(towerIndex, blockIndex, fi)?.at(i).get('isSingleStackSelected')?.setValue( y.isSingleStackSelected);
      //     }
      //   });
      // });
      // if (this.selectedUnitFlatIndex < 0)
      //   return
    }
  }

  // getSingleSelectColor(towerIndex, blockIndex, floorIndex, flatNo): any {
  //   if (towerIndex >= 0 && blockIndex >= 0 && floorIndex >= 0 && flatNo >= 0)
  //     return this.projectUnitFlatsDetail(towerIndex, blockIndex, floorIndex)?.value?.find(x => x.flatNo == flatNo)?.isSingleStackSelected;
  // }

  updatemainForm() {
    console.log("temmp form ", this.unitFlatForm.value);
    this.form.get('projectTower')?.value?.forEach((pt, pi) => {
      pt.projectBlocks.forEach((b, bi) => {
        if (pi == this.towerIndex && bi == this.blockIndex)
          this.onBlurFormForFlat(pi, bi);
      })
    })

  }
  selectedUnits: Array<{ iD: number }> = [];
  onBlurFormForFlat(tabIndex, blockIndex) {
    //  this.projectFloorDetails(tabIndex, blockIndex)?.value?.sort((a, b) => parseInt(b.floorNo) - parseInt(a.floorNo));
    if (tabIndex >= 0 && blockIndex >= 0) {
      const unitNumberArr = this.unitNumber.length > 0 ? this.unitNumber.split(',') : [];
      if (unitNumberArr.length && this.selectedStackName.length == 0) {
        this.projectFloorDetails(tabIndex, blockIndex)?.value?.forEach((floor: any, fi) => {
          this.projectUnitFlatsDetail(tabIndex, this.blockIndex, fi)?.value?.forEach((field, index) => {
            if (unitNumberArr.findIndex(x => parseInt(x) == field?.flatNo) >= 0) {
              console.log("flatNO", field?.flatNo)
              this.insertAndUpdateUnitFlats(tabIndex, blockIndex, fi, index, this.unitFlatForm.value, false, true);
            }
          });
        });

      }
      else {
        const floorN = this.selectedStackName.length > 0 ? this.selectedStackName.split(',') : [];
        if (floorN.length)
          this.projectFloorDetails(tabIndex, blockIndex)?.value?.forEach((floor: any, fi) => {
            floor?.projectUnitFlats?.forEach((field, index) => {
              if (floorN?.findIndex(x => (parseInt(x)) == (index + 1)) >= 0 && !field.isSingleStackSelected) {

                this.insertAndUpdateUnitFlats(tabIndex, blockIndex, fi, index, this.unitFlatForm.value, true, false);
              }
            });
          });
      }
      this.projectFloorDetails(tabIndex, blockIndex)?.value?.sort((a, b) => parseInt(b.floorNo) - parseInt(a.floorNo));

    }
  }
  radioButtonChange(towerIndex, blockIndex, floorIndex, flatIndex = 0, adfIndex, opCode = 1, isFlat = false) {
    if (towerIndex >= 0 && blockIndex >= 0 && floorIndex >= 0 && adfIndex >= 0) {
      if (opCode == 1) {
        if (this.projectUnitAdditionalFeaturesDetailForFlat(towerIndex, blockIndex, floorIndex, flatIndex).at(adfIndex)?.get('isIncluded')?.value) {
          this.projectUnitAdditionalFeaturesDetailForFlat(towerIndex, blockIndex, floorIndex, flatIndex).at(adfIndex)?.get('isEligible')?.setValue(false);
        }
      }
      else {
        if (this.projectUnitAdditionalFeaturesDetailForFlat(towerIndex, blockIndex, floorIndex, flatIndex).at(adfIndex)?.get('isEligible')?.value) {
          this.projectUnitAdditionalFeaturesDetailForFlat(towerIndex, blockIndex, floorIndex, flatIndex).at(adfIndex)?.get('isIncluded')?.setValue(false);
        }
      }
    }
  }

  getStackDetail(unit) {
    return unit.isMultipleStackSelected;
  }

  handleChange(e, i, opcode) {
    if (opcode == 1) {
      if ((this.unitFlatForm.get('flatProjectUnitAdditionalFeatures') as FormArray)?.at(i)?.get('isIncluded')?.value)
        (this.unitFlatForm.get('flatProjectUnitAdditionalFeatures') as FormArray)?.at(i)?.get('isEligible')?.setValue(false);
      else (this.unitFlatForm.get('flatProjectUnitAdditionalFeatures') as FormArray)?.at(i)?.get('isIncluded')?.setValue(true)


    } else {
      if ((this.unitFlatForm.get('flatProjectUnitAdditionalFeatures') as FormArray)?.at(i)?.get('isEligible')?.value)
        (this.unitFlatForm.get('flatProjectUnitAdditionalFeatures') as FormArray)?.at(i)?.get('isIncluded')?.setValue(false);
      else
        (this.unitFlatForm.get('flatProjectUnitAdditionalFeatures') as FormArray)?.at(i)?.get('isEligible')?.setValue(true);


    }
  }
  changeCheckbox(e, i) {
    if (e.target.checked)
      (this.unitFlatForm.get('flatProjectUnitAdditionalFeatures') as FormArray)?.at(i)?.get('isChecked')?.setValue(true)
    else
      (this.unitFlatForm.get('flatProjectUnitAdditionalFeatures') as FormArray)?.at(i)?.get('isChecked')?.setValue(false)
  }
  openEditDelDialogfun() {
    this.dialogRef = this.dialog.open(this.editDelDialog, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
  }
  cancel() {
    this.closeDialog();
    this.unitNumber = "";
    this.selectedStackName = "";
  }

  deleteUnit() {
    this.closeDialog();
    this.floorPremium = 0;
    let __form = this.initSecondryform("", false, 0, 0, 0, "", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "", true);
    if (this.selectedStackName.length) {
      //for all units  Delete 
      __form.value.flatProjectUnitAdditionalFeatures = [];
      this.projectFloorDetails(this.towerIndex, this.blockIndex)?.value?.forEach((floor: any, fi) => {
        floor?.projectUnitFlats?.forEach((field, index) => {
          if ((index + 1) == parseInt(this.selectedStackName)) {
            this.insertAndUpdateUnitFlats(this.towerIndex, this.blockIndex, fi, index, __form.value, false, false);
          }
        })
      });
      // id remove from copied array
      this.selectedStackName = "";
    }
    else {
      //for single unit click Delete 
      if (this.unitNumber.length) {
        (__form.get('flatProjectUnitAdditionalFeatures') as FormArray).value;
        this.projectFloorDetails(this.towerIndex, this.blockIndex)?.value?.forEach((floor: any, fi) => {
          floor?.projectUnitFlats?.forEach((field, index) => {
            if ((this.unitNumber) == field?.flatNo) {
              this.insertAndUpdateUnitFlats(this.towerIndex, this.blockIndex, fi, index, __form.value, false, false);
            }
          })
        });
        this.unitNumber = "";
      }
    }
    this.refreshCopiedUnits();
  }
  unitChangeForStack(event, toweridx, blockidx) {
    let flatMap: any;
    this.projectFloorDetails(toweridx, blockidx)?.value[0].projectUnitFlats?.forEach((x, i) => {
      if (i == +(event - 1)) {
        flatMap = x;
      }
    });
    if (flatMap)
      this.setValue_In_UnitFormToEdit(flatMap);
  }

  editUnits() {
    this.closeDialog();
    if (this.selectedStackName.length) {
      this.isContinue = true;
      this.unitChangeForStack(this.selectedStackName, this.towerIndex, this.blockIndex);
    }
    else {
      if (this.unitNumber.length) {
        this.isContinue = true;
        this.setSingleUnitForEdit(this.unitNumber, this.floorIndex, this.towerIndex, this.blockIndex);
      }
    }
  }

  insertAndUpdateUnitFlats(towerIndex, blockIndex, fi, index, unitF, isStack, isUnits) {

    this.projectUnitFlatsDetail(towerIndex, blockIndex, fi)?.at(index).patchValue({
      ...unitF,
      isSingleStackSelected: isUnits,
      flatStatus: '',
      isSkip: false,
      isMultipleStackSelected: isStack,
      unitTypeId: parseInt(unitF.unitTypeId ?? 0),
      unitType: unitF.unitType ?? '',
      interiorSize: +unitF?.interiorSize ?? 0,
      ceilingHeight: (+unitF.ceilingHeight) || 0,
      balconySize: (+unitF.balconySize) || 0,
      floorPremium: +unitF.floorPremium || 0, //this.floorPremium > 0 ? this.floorPremium : +unitF.floorPremium || 0,
      view: unitF.view ?? 0,
      livingRoomSize: +unitF.livingRoomSize ?? 0,
      diningRoomSize: +unitF.diningRoomSize ?? 0,
      noOfBedroom: +unitF.noOfBedroom || 0,
      nOofBaths: +unitF.nOofBaths || 0,
      terrace: +unitF.terrace || 0,
      noofBalcony: +unitF.noofBalcony || 0,
      noofDen: +unitF.noofDen || 0
    });

    this.bedRoomsDetailForFlat(towerIndex, blockIndex, fi, index).controls = [];
    this.bedRoomsDetailForFlat(towerIndex, blockIndex, fi, index).setValue([]);
    //this.clearFormArrayToDefault(this.bedRoomsDetailForFlat(towerIndex, blockIndex, fi, index))
    unitF?.flatBedRooms?.forEach(val => {
      this.bedRoomsDetailForFlat(towerIndex, blockIndex, fi, index).push(this.newBedRoomsForFlat(0, val?.flatId ?? 0, val?.number ?? 0, val?.size || 0));
    });
    this.bathRoomsDetailForFlat(towerIndex, blockIndex, fi, index).controls = [];
    this.bathRoomsDetailForFlat(towerIndex, blockIndex, fi, index).setValue([]);
    unitF?.flatbathroomSizes?.forEach(val => {

      this.bathRoomsDetailForFlat(towerIndex, blockIndex, fi, index).push(this.newBathRoomSizesForFlat(0, 0, val?.number ?? 0, val.size || 0));
    });

    this.balconyDetailForFlat(towerIndex, blockIndex, fi, index).controls = [];
    this.balconyDetailForFlat(towerIndex, blockIndex, fi, index).setValue([]);
    unitF?.flatbalconysizes?.forEach(val => {

      this.balconyDetailForFlat(towerIndex, blockIndex, fi, index)?.push(this.newBalconySizesForFlat(0, 0, val?.number ?? 0, val?.size ?? 0));
    });

    this.terranceDetailForFlat(towerIndex, blockIndex, fi, index).controls = [];
    this.terranceDetailForFlat(towerIndex, blockIndex, fi, index).setValue([]);

    unitF?.flatterraceSizes?.forEach(val => {

      this.terranceDetailForFlat(towerIndex, blockIndex, fi, index).push(this.newTerraceSizesForFlat(0, 0, val?.number ?? 0, val?.size ?? 0));
    });
    this.denDetailForFlat(towerIndex, blockIndex, fi, index).controls = [];
    this.denDetailForFlat(towerIndex, blockIndex, fi, index).setValue([]);
    unitF?.flatdenSizes?.forEach(val => {
      this.denDetailForFlat(towerIndex, blockIndex, fi, index).push(this.newDenSizesForFlat(0, 0, val?.number ?? 0, val?.size ?? 0));
    });
    this.projectUnitAdditionalFeaturesDetailForFlat(towerIndex, blockIndex, fi, index).controls = [];
    unitF?.flatProjectUnitAdditionalFeatures?.forEach(val => {
      this.projectUnitAdditionalFeaturesDetailForFlat(towerIndex, blockIndex, fi, index).push(this.newProjectUnitAdditionalFeaturesForFlat(val?.name ?? '', 0, 0, val?.isIncluded, val?.isEligible));
    });


  }

  // setCopiedBlockoninit() {
  //   let arr: any = [];
  //   (this.projectFloorDetails(this.towerIndex, this.blockIndex) as FormArray)?.value[0]?.projectUnitFlats?.forEach((u, ufi) => {
  //     if (u.isMultipleStackSelected)
  //       arr.push(ufi);
  //   });
  //   console.log("ismulti", arr);
  //   if (arr.length > 0) {
  //     arr.forEach(e => {
  //       this.setcopiedstacks(e + 1);
  //     });
  //   }
  // }

  setCopiedUnitBlockoninit() {
    return new Promise((res, rej) => {
      let unitarr: Array<{ blockIndex: number, towerIndex: number, isStack: boolean, id: number, name: string }> = [];
      (this.blockDetails(this.towerIndex)?.value.forEach((b, bi) =>
        b.projectFloorDetails[0]?.projectUnitFlats?.forEach((u, ufi) => {
          if (u.isMultipleStackSelected)
            unitarr.push({ towerIndex: this.towerIndex, blockIndex: bi, isStack: true, id: (ufi + 1), name: 'Block- ' + (b.blockNo) + ' Stack-' + (ufi + 1) });
        })));

      (this.blockDetails(this.towerIndex)?.value.forEach((b, bi) =>
        b.projectFloorDetails.forEach(x =>
          x?.projectUnitFlats?.forEach((u, ufi) => {
            if (u.isSingleStackSelected && !u.isMultipleStackSelected)
              unitarr.push({ blockIndex: bi, towerIndex: this.towerIndex, isStack: false, id: u.flatNo, name: 'Block- ' + (b.blockNo) + ' Unit-' + u.flatNo });
          }))));
      console.log("isSingle", unitarr);
      res(unitarr);
    });
  }
  // setcopiedstacks(stackNo) {
  //   if ((this.blockDetails(this.towerIndex)?.at(this.blockIndex)?.get('copiedFloors') as FormArray)?.value.findIndex(y => y.floorId == stackNo) < 0) {
  //     (this.blockDetails(this.towerIndex)?.at(this.blockIndex)?.get('copiedFloors') as FormArray).push(this.fb.group({ floorId: parseInt(stackNo) }))

  //   }
  // }

  setSingleUnitForEdit(flatNo, floorIndex, towerIndex, blockIndex) {
    if (towerIndex >= 0 && blockIndex >= 0 && floorIndex >= 0) {
      let flatMap: any;
      this.projectFloorDetails(towerIndex, blockIndex)?.value?.[this.floorIndex].projectUnitFlats.forEach((x, i) => {
        if (x.flatNo == flatNo)
          flatMap = x;
      });
      if (flatMap)
        this.setValue_In_UnitFormToEdit(flatMap);
    }
  }

  setValue_In_UnitFormToEdit(flatMap) {
    if (flatMap) {
      this.unitFlatForm.patchValue({
        price: flatMap?.price,
        flatStatus: '',
        isSkip: false,
        interiorSize: flatMap?.interiorSize,
        ceilingHeight: flatMap?.ceilingHeight,
        unitTypeId: flatMap.unitTypeId,
        unitType: flatMap?.unitType == 'null' || flatMap?.unitType == null ? '' : flatMap?.unitType,
        unitName: flatMap?.unitName,
        balconySize: flatMap?.balconySize,
        nOofBaths: flatMap?.nOofBaths,
        floorPremium: flatMap?.floorPremium,
        view: flatMap?.view,
        livingRoomSize: flatMap?.livingRoomSize,
        diningRoomSize: flatMap?.diningRoomSize,
        noOfBedroom: flatMap?.noOfBedroom,
        terrace: flatMap?.terrace,
        noofBalcony: flatMap?.noofBalcony,
        noofDen: flatMap?.noofDen,
        flatdenSizes: flatMap?.flatdenSizes,
        floorPlanFile: flatMap?.floorPlanFile,
        planScheduleFile: flatMap?.planScheduleFile,
      });
      (this.unitFlatForm?.get('flatBedRooms') as FormArray).controls = [];
      (this.unitFlatForm?.get('flatBedRooms') as FormArray).setValue([]);
      flatMap?.flatBedRooms?.forEach(val => {
        (this.unitFlatForm.get('flatBedRooms') as FormArray)?.push(this.newBedRoomsForFlat(0, val?.flatId ?? 0, val?.number ?? 0, val?.size ?? 0));
      });
      (this.unitFlatForm?.get('flatbathroomSizes') as FormArray).controls = [];
      (this.unitFlatForm?.get('flatbathroomSizes') as FormArray).setValue([]);
      flatMap?.flatbathroomSizes?.forEach(val => {
        (this.unitFlatForm.get('flatbathroomSizes') as FormArray).push(this.newBathRoomSizesForFlat(0, 0, val?.number ?? 0, val?.size ?? 0));
      });
      (this.unitFlatForm?.get('flatbalconysizes') as FormArray).controls = [];
      (this.unitFlatForm?.get('flatbalconysizes') as FormArray).setValue([]);
      flatMap?.flatbalconysizes?.forEach(val => {
        (this.unitFlatForm.get('flatbalconysizes') as FormArray).push(this.newBalconySizesForFlat(0, 0, val?.number ?? 0, val?.size ?? 0));
      });
      (this.unitFlatForm?.get('flatterraceSizes') as FormArray).controls = [];
      (this.unitFlatForm?.get('flatterraceSizes') as FormArray).setValue([]);
      flatMap?.flatterraceSizes?.forEach(val => {
        (this.unitFlatForm.get('flatterraceSizes') as FormArray).push(this.newTerraceSizesForFlat(0, 0, val?.number ?? 0, val?.size ?? 0));
      });
      (this.unitFlatForm?.get('flatdenSizes') as FormArray).controls = [];
      (this.unitFlatForm?.get('flatdenSizes') as FormArray).setValue([]);
      flatMap?.flatdenSizes?.forEach(val => {
        (this.unitFlatForm.get('flatdenSizes') as FormArray).push(this.newDenSizesForFlat(0, 0, val?.number ?? 0, val?.size ?? 0));
      });
      (this.unitFlatForm?.get('flatProjectUnitAdditionalFeatures') as FormArray).controls = [];
      (this.unitFlatForm?.get('flatProjectUnitAdditionalFeatures') as FormArray).setValue([]);
      flatMap?.flatProjectUnitAdditionalFeatures?.forEach(val => {
        (this.unitFlatForm.get('flatProjectUnitAdditionalFeatures') as FormArray).push(this.newProjectUnitAdditionalFeaturesForFlat(val?.name ?? '', 0, 0, val?.isIncluded, val?.isEligible, val.isChecked ?? false));
      });
    }
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  trackByIndex(index, value) {
    return index;
  }

  // openDialogOnBack() {
  //   this.dialogRef = this.dialog.open(this.confirmSaveOnBackDialog, {
  //     width: '40rem',
  //     maxWidth: '99vw',
  //     disableClose: true
  //   });
  // }
  // undoChanges(){
  //   this.stepperChange.emit();
  //   this.dialogRef?.close();
  // }
  confirmFloorPremium() {
    if (this.floorPremium > 0) {
      this.openConfirmFloorPremimumDialogfun();
    }
  }
  openConfirmFloorPremimumDialogfun() {
    this.dialogRef = this.dialog.open(this.confirmFloorPremimumDialog, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
  }
  updateFloorPremimum() {
    this.closeFloorPremimumDialog();
  }
  cancelFloorPremimum() {
    this.unitFlatForm?.get("floorPremium")?.setValue(this.floorPremium);
    this.closeFloorPremimumDialog();
  }
  closeFloorPremimumDialog() {
    this.dialogRef?.close();
  }
}
