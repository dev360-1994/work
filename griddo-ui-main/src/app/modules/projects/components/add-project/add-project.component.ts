import { Component, Input, Output, OnInit, TemplateRef, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { CountryISO } from 'ngx-intl-tel-input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CONSTANT } from 'src/app/constants';
import { Util } from 'src/app/shared/common.utils';
import { ProjectsService, TimeZoneModel } from '../../services/projects.service';
import { DropDownCONSTANT } from '../../__dropDownConstants';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit, OnDestroy {
  readonly constant = DropDownCONSTANT;
  public form!: FormGroup;
  CountryISO = CountryISO;
  isProcessing!: boolean;
  visibility: boolean = false;
  isEditable: boolean = false;
  isEdit: boolean = false;
  userDetail = CONSTANT.getUser();
  projectTimeDropDown = DropDownCONSTANT.projectTimeValues;
  isBuilder = false;
  companyName = '';
  mindate = '2000-01-01T00:00:00.0000'
  maxdate = '3000-01-01T00:00:00.0000'
  todayDate = new Date(this.mindate);
  startMinDate = new Date(this.mindate);
  startMaxDate = new Date(this.maxdate);
  completeMinDate = new Date(this.mindate);
  completeMaxDate = null as any;

  selectedAddress: any = {
    address: '',
    provision: '',
    city: '',
    zipCode: '',
    country: ''
  }

  selectedDays: string[] = [];
  isAllDaysSelected = false;

  dialogRef!: MatDialogRef<any>;
  @ViewChild('imgCropperTemplate')
  imgCropperTemplate!: TemplateRef<any>;
  imageChangedEvent: any;
  tranform: ImageTransform = {};
  croppedImage!: File;
  scale = 1;
  fileKey: string = '';
  projectBase64Img!: string | null | undefined;
  projectHeroBase64Img!: string | null | undefined;
  builders: Array<{ value: number, text: string, companyName: string }> = [];

  amenties: Array<{ value: number, text: string, disabled?: boolean }> = [];

  @Output() formEmitter = new EventEmitter<FormGroup>();
  weeks: Array<{
    days: Array<{
      day: string,
      selected: boolean,
      short: string,
      alreadyChosen: boolean
    }>,
    timeZone: string, startTime: string, endTime: string,
  }> = [];

  timeZones: Array<TimeZoneModel> = [];
  currentTimeZone!: string;
  constructor(private _projectService: ProjectsService,
    private snackbarWrapperService: SnackbarWrapperService,
    public dialog: MatDialog,
    private router: Router, private activatedRoute: ActivatedRoute, private fb: FormBuilder) {
    this.initForm();
    this.form.valueChanges.subscribe(val => {
      this.formEmitter.emit(this.form)
    });
    // this.form.setValidators(this.validateDate);
    this._projectService.timeZones().toPromise().then(timeZones => {
      this.timeZones = timeZones;
      const currentTimeZone = this.timeZones.find(tz => tz?.utc?.map(i => i.toLowerCase()).includes(Intl.DateTimeFormat()?.resolvedOptions()?.timeZone?.toLowerCase()));
      this.currentTimeZone = currentTimeZone?.value || 'India Standard Time';
      //this.addWeek();
    });
  }
  ngOnInit(): void {
    this.getBuilderForDropDown();
    this.getAmentiesForDropDown();
  }

  ngUnsubscribe$: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  // formatDate(date?: string) {
  //   var now = new Date(2013, 11, 31);
  //   var str = now.toLocaleDateString();
  //   str = str.replace("31", "dd");
  //   str = str.replace("12", "mm");
  //   str = str.replace("2013", "yyyy");

  //   var d = date ? new Date(date) : new Date(),
  //     month = '' + (d.getMonth() + 1),
  //     day = '' + d.getDate(),
  //     year = d.getFullYear();

  //   if (month.length < 2)
  //     month = '0' + month;
  //   if (day.length < 2)
  //     day = '0' + day;
  //   return [year, month, day].join('-');
  // }

  initForm() {
    const phoneRegx = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);
    const phoneRegx1 = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    //const urlRegEx = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    this.form = this.fb.group({
      projectId: [0],
      selectedTab: 0,
      isActive: true,
      projectName: ['', Validators.required],
      projectLogoPath: [''],
      builderid: ['', Validators.required],
      builderName: [''],
      projectModel: ['1', Validators.required],
      projectType: ['1'],
      address: ['', Validators.required],
      address1: [''],
      city: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      createdBy: [''],
      createdDate: [''],
      zipCode: ['', Validators.required],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phoneNumber: ['', [Validators.pattern(phoneRegx1)]],
      workingHour: [''],
      logo: [''],
      heroImage: [''],
      startDate: [''],
      completionDate: [''],
      buildingHeight: [''],
      buildingHeightUnit: ['mt'],
      buildingDescription: [''],
      websiteUrl: ['', Validators.pattern(pattern)],
      miniSiteURL: ['', Validators.pattern(pattern)],
      projectStatus: ['1'],
      LogoFile: [''],
      HeroImageFile: [''],
      FloorPlanImage: [''],
      FloorPlanPDF: [''],
      currentIncentive: [''],
      landscaping: this.fb.array([this.newLandscaping()]),
      architects: this.fb.array([this.newArchitec()]),
      interiorDesigners: this.fb.array([this.newInteriorDesigner()]),
      marketingCompany: this.fb.array([this.newMarketingCompany()]),
      addAgency: this.fb.array([this.newAddAgency()]),
      amenities: this.fb.array([this.newAmenity()]),
      featuresAndFinishes: this.fb.array([this.newFeaturesAndFinish()]),
      projectSalesOfficeDetails: this.fb.group({
        projectSalesOfficeDetailId: 0,
        address: '',
        email: '',
        city: '',
        province: '',
        country: '',
        postal: '',
        zipCode: '',
        workingHours: this.fb.array([this.newWorkingHours()]),
        phoneNumber: null
        //  this.fb.group({
        //   projectSalePhoneId:  new FormControl(0),
        //   number:  new FormControl(''),
        //   internationalNumber: new FormControl(''),
        //   nationalNumber: new FormControl(''),
        //   e164Number: new FormControl(''),
        //   countryCode: new FormControl(''),
        //   dialCode: new FormControl('')
        // })
      }),

    });

    this.form.get('builderid')?.valueChanges.subscribe(val => {
      if(val){
        this.builders.some((item:any):any => {
          if (item.value == val) {
            this.companyName = item.companyName;
            this.form?.get('builderName')?.setValue(this.companyName);
            return true;
          }
        });
      }
    })

    this.form.get('startDate')?.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        let date = Util.ConvertDateTime(val);
        this.form.get('startDate')?.setValue(date.toISOString());
      }
    })
    this.form.get('completionDate')?.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        let date = Util.ConvertDateTime(val);
        this.form.get('completionDate')?.setValue(date.toISOString());
      }
    })

    this.form.controls.amenities.valueChanges.subscribe((val: Array<any>) => {
      if (val?.length) {
        // this.filteredAmenties = this.amenties.filter(i => !val.filter(a => a?.amenityValue).find(a => a.amenityValue == i.value));
        this.amenties.forEach(i => {
          // if (val.filter(a => a?.amenityValue).find(a => a.amenityValue == i.value)) {
          i.disabled = val.filter(a => a?.amenityValue).find(a => a.amenityValue == i.value);
          // }
        });
      } else {
        this.amenties?.forEach(a => a['disabled'] = false);
      }
    });
  }



  newWorkingHours(id = 0, day = '', startTime = '', endTime = '', timeZone = '', projectSalesOfficeDetailId = 0, order = 1): FormGroup {
    let userSelectedDays = day?.split(',');
    if (userSelectedDays)
      this.selectedDays = [...this.selectedDays, ...userSelectedDays];
    return this.fb.group({
      id: id,
      day: day,
      startTime: startTime,
      endTime: endTime,
      timeZone: timeZone!="null" && timeZone!=""? timeZone :'India Standard Time',
      projectSalesOfficeDetailId: projectSalesOfficeDetailId,
      order: order, 
      weeks: {
        days: [
        { day: "Monday", selected: day?.split(',').some(x => x === "Monday") ? true : false, short: "M", alreadyChosen: this.selectedDays.some(x => x === "Monday") ? true : false },
        { day: "Tuesday", selected: day?.split(',').some(x => x === "Tuesday") ? true : false, short: "T", alreadyChosen: this.selectedDays.some(x => x === "Tuesday") ? true : false },
        { day: "Wednesday", selected: day?.split(',').some(x => x === "Wednesday") ? true : false, short: "W", alreadyChosen: this.selectedDays.some(x => x === "Wednesday") ? true : false },
        { day: "Thursday", selected: day?.split(',').some(x => x === "Thursday") ? true : false, short: "T", alreadyChosen: this.selectedDays.some(x => x === "Thursday") ? true : false },
        { day: "Friday", selected: day?.split(',').some(x => x === "Friday") ? true : false, short: "F", alreadyChosen: this.selectedDays.some(x => x === "Friday") ? true : false },
        { day: "Saturday", selected: day?.split(',').some(x => x === "Saturday") ? true : false, short: "S", alreadyChosen: this.selectedDays.some(x => x === "Saturday") ? true : false },
        { day: "Sunday", selected: day?.split(',').some(x => x === "Sunday") ? true : false, short: "S", alreadyChosen: this.selectedDays.some(x => x === "Sunday") ? true : false }],
        startTime: startTime === '' || startTime === null || startTime === "null" ? '6:00 AM' : startTime,
        endTime: endTime === '' || endTime === null || endTime === "null" ? '4:00 PM' : endTime,
        timeZone: timeZone === '' || timeZone === null || timeZone==='null' ? this.currentTimeZone ? this.currentTimeZone : 'Eastern Standard Time' : 'Eastern Standard Time'
      }
    })
  }

  reCheckContorlsSelectionDays() {
    for (let i = 0; i < (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).controls.length; i++) {
      let workingHours = (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).controls[i];
      workingHours["controls"].weeks.value.days?.map(item => {
        item.alreadyChosen = !item.selected && this.selectedDays.some(x => x === item.day) ? true : false;
      });
      workingHours["controls"].order.setValue(i + 1);
    }
    this.checkAllDaysSelected();
  }

  get architects(): FormArray {
    return this.form.get('architects') as FormArray;
  }
  get getWorkingHours(): FormArray {
    return this.form.get('workingHours') as FormArray;
  }
  get getPhoneNumber(): FormArray {
    return this.form.get('phoneNumber') as FormArray;
  }
  get interiorDesigners(): FormArray {
    return this.form.get('interiorDesigners') as FormArray;
  }
  get landscaping(): FormArray {
    return this.form.get('landscaping') as FormArray;
  }
  get marketingCompany(): FormArray {
    return this.form.get('marketingCompany') as FormArray;
  }
  get amenities(): FormArray {
    return this.form.get('amenities') as FormArray;
  }

  get featuresAndFinishes(): FormArray {
    return this.form.get('featuresAndFinishes') as FormArray;
  }

  get workingHours(): FormArray {
    return this.form.get('projectSalesOfficeDetails.workingHours') as FormArray;
  }

  newFeaturesAndFinish(id = 0, items = '', projectId = 0): FormGroup {
    return this.fb.group({
      featuresAndFinishesId: id,
      items: items,
      projectId: projectId
    })
  }

  newAmenity(id = 0, value = 0, projectId = 0): FormGroup {
    const form = this.fb.group({
      amenitiesId: id,
      amenityValue: value,
      projectId: projectId
    });
    return form;
  }

  newAddAgency(id = 0, email = '', projectId = 0): FormGroup {

    return this.fb.group({
      addAgencyId: id,
      email: email,
      projectId: projectId
    })
  }

  newMarketingCompany(id = 0, email = '', projectId = 0): FormGroup {
    return this.fb.group({
      marketingCompanyId: id,
      // email: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      email: email,
      projectId: projectId
    })
  }

  newInteriorDesigner(id = 0, email = '', projectId = 0): FormGroup {
    const emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    return this.fb.group({
      interiorDesignerId: id,
      email: [email],
      projectId: projectId
    })
  }

  newLandscaping(id = 0, projectId = 0, email = ''): FormGroup {
    const emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    return this.fb.group({
      landscapingId: id,
      email: [email],
      projectId: projectId
    })
  }

  newArchitec(id: number = 0, projectId = 0, email: string = ""): FormGroup {
    const emailRegEx = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
    return this.fb.group({
      architectId: id,
      email: [email],
      projectId: projectId
    })
  }

  save() {
    if (!this.form.valid) {
      return;
    }

    this.isProcessing = true;
    //console.log("saved form=>", this.form.value);
    this._projectService.add(this.form.value).subscribe((res) => {
      this.isProcessing = false;
      if (res.isSuccess) {
        //console.log("data res=>", res);
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      } else {
        this.snackbarWrapperService.open(res.message);
        this.isProcessing = false;
      }
    }, err => {
      this.snackbarWrapperService.open(JSON.stringify(err));
      this.isProcessing = false;
    });

  }

  addField(name: string) {
    const phoneRegx = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
    const validators = [Validators.required];
    switch (name) {
      case 'architects':
        (this.form.get(name) as FormArray).push(this.newArchitec());
        break;
      case 'interiorDesigners':
        (this.form.get(name) as FormArray).push(this.newInteriorDesigner());
        break;
      case 'landscaping':
        (this.form.get(name) as FormArray).push(this.newLandscaping());
        break;
      case 'marketingCompany':
        (this.form.get(name) as FormArray).push(this.newMarketingCompany());
        break;
      case 'amenities':
        (this.form.get(name) as FormArray).push(this.newAmenity());
        break;
      case 'featuresAndFinishes':
        (this.form.get(name) as FormArray).push(this.newFeaturesAndFinish());
        break;
    }
  }

  removeField(name: string, index: number) {
    (this.form.get(name) as FormArray).removeAt(index);
  }

  onFileChange(files: Array<File>, key: string = '') {
    this.fileKey = key;
    if (files?.length) {
      this.fileChangeEvent({ target: { files } }, key);
    }
  }

  fileChangeEvent(event: any, key: string = ''): void {
    this.fileKey = key;
    if (!event?.target?.files?.length) {
      return this.exitCropImage();
    }
    //this.fileName = (event?.target?.files[0] as File).name;
    this.imageChangedEvent = event;
    this.openDialog()
  }

  clearImg(key: string = '') {
    if (key === 'logo') {
      this.projectBase64Img = '';
      this.form.controls['logo'].setValue(null);
      this.form.controls['LogoFile'].setValue(null);
      this.form.controls.projectLogoPath.setValue(null);
    }
    else {
      this.projectHeroBase64Img = '';
      this.form.controls.heroImage.setValue(null);
      this.form.controls['HeroImageFile'].setValue(null);
    }
    this.croppedImage = undefined as any;
  }

  dataURLtoFile(dataurl?: any, filename?: string) {

    const arr: Array<any> = dataurl?.split(','),
      mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let length = bstr.length;
    const u8arr = new Uint8Array(length);

    while (length--) {
      u8arr[length] = bstr.charCodeAt(length);
    }
    return new File([u8arr], filename || 'img.jpeg', { type: mime });
  }

  zoomOut() {
    this.scale -= .1;
    this.tranform = {
      ...this.tranform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.tranform = {
      ...this.tranform,
      scale: this.scale
    };
  }

  imageCropped(event: ImageCroppedEvent) {
    const file = this.dataURLtoFile(event.base64, 'img.jpeg');
    if (this.fileKey == 'logo')
      this.projectBase64Img = event.base64;
    else
      this.projectHeroBase64Img = event.base64;
    this.croppedImage = file;
  }

  saveCropImage() {
    this.uploadFile(this.croppedImage);
  }



  exitCropImage() {

    this.dialogRef?.close();
    this.imageChangedEvent = null;
    const ele: HTMLInputElement = document.getElementById('projectLogoPath') as HTMLInputElement;
    if (ele) {
      ele.value = '';
    }
    this.clearImg(this.fileKey)
  }

  uploadFile(file: File) {
    this.isProcessing = true;
    //console.log("fileKey", this.fileKey);
    if (this.fileKey == 'logo') {
      this.form.controls['LogoFile'].setValue(file);
      this.form.controls['projectLogoPath'].setValue(file);
      this.form.controls['FloorPlanPDF'].setValue(file);
      this.form.controls['FloorPlanImage'].setValue(file);
    }
    else {
      this.form.controls['HeroImageFile'].setValue(file);

    }
    this.isProcessing = false;
    this.dialogRef?.close();
  }
  openDialog() {
    this.dialogRef = this.dialog.open(this.imgCropperTemplate, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
  }



  add() {
    this.updateAddress();
    this.isProcessing = true;

    const data = Object.assign({}, this.form.value);
    delete data.randomPassword;
    delete data.confirmPassword;
    this._projectService.add(data).subscribe(() => {
      this.isProcessing = false;
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }, err => {
      this.snackbarWrapperService.open(JSON.stringify(err));
      this.isProcessing = false;
    });
  }

  updateAddress() {
    Object.keys(this.selectedAddress).forEach(key => {
      //this.form.controls[key].setValue(this.selectedAddress[key]);
    })
  }

  public handleAddressChange(address: Address, addressType: number = 0) {
    if (addressType == 1 && address?.address_components?.length) {
      [
        { prop: 'address', type: 'sublocality' },//address.name
        { prop: 'province', type: 'administrative_area_level_1' },
        { prop: 'city', type: 'administrative_area_level_2' },
        { prop: 'zipCode', type: "postal_code" },
        { prop: 'country', type: "country" },
      ].forEach(item => {
        let val;
        if (item.prop == "city") {
          val = address.address_components.find(ai => ai.types.includes("locality") && ai.types.includes("political"));
          val = val == undefined ? address.address_components.find(ai => ai.types.includes("administrative_area_level_3") && ai.types.includes("political")) : val;
        }
        else {
          val = address.address_components.find(ai => ai.types.includes(item.type));
        }
        if (val != null && val?.long_name.toLowerCase().indexOf('regional') > -1 && val?.short_name.toLowerCase().indexOf('regional') > -1) {
          val = address.address_components.find(ai => ai.types.includes('administrative_area_level_1'));
        }
        this.selectedAddress[item.prop] = val?.long_name ?? val?.short_name ?? '';
        if (item.prop === 'address') {
          this.selectedAddress[item.prop] = `${address.name} ${this.selectedAddress[item.prop] ? ',' : ''}${this.selectedAddress[item.prop]}`
        }
        this.form.controls[item.prop].setValue(this.selectedAddress[item.prop]);
      });
    }
    else if (addressType == 2 && address?.address_components?.length) {
      [
        { prop: 'address', type: 'sublocality' },//address.name
        { prop: 'province', type: 'administrative_area_level_1' },
        { prop: 'city', type: 'administrative_area_level_2' },
        { prop: 'postal', type: "postal_code" },
        { prop: 'country', type: "country" },
      ].forEach(item => {
        //let val = address.address_components.find(ai => ai.types.includes(item.type));
        let val;
        if (item.prop == "city") {
          val = address.address_components.find(ai => ai.types.includes("locality") && ai.types.includes("political"));
          val = val == undefined ? address.address_components.find(ai => ai.types.includes("administrative_area_level_3") && ai.types.includes("political")) : val;
        }
        else {
          val = address.address_components.find(ai => ai.types.includes(item.type));
        }
        if (val != null && val?.long_name.toLowerCase().indexOf('regional') > -1 && val?.short_name.toLowerCase().indexOf('regional') > -1) {
          val = address.address_components.find(ai => ai.types.includes('administrative_area_level_1'));
        }
        this.selectedAddress[item.prop] = val?.long_name ?? val?.short_name ?? '';
        if (item.prop === 'address') {
          this.selectedAddress[item.prop] = `${address.name} ${this.selectedAddress[item.prop] ? ',' : ''}${this.selectedAddress[item.prop]}`
        }
        //this.form.get('projectSalesOfficeDetails')?.value.get[item.prop].setValue(this.selectedAddress[item.prop]);
        this.form.get('projectSalesOfficeDetails')?.get(item.prop)?.setValue(this.selectedAddress[item.prop]);
      });
    }
  }
  validateDate(group: any) {
    let val1 = group.get('startDate');
    let val2 = group.get('completionDate');
    const invalid = val1 != "" && val2 != "" ? group.get('startDate').value > group.get('completionDate').value : null;
    if (invalid)
      val2.setErrors({ 'ng-invalid': true })
    else
      val2.setErrors(null);
    return null;
  }

  getBuilderForDropDown() {
    this._projectService.getBuilders().pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      if (res?.isSuccess)
        this.builders = res?.data;

      if (this.userDetail.role.toLowerCase() === 'builder') {
        this.isBuilder = true;
        let builderId = +this.userDetail?.builderId;

        this.builders.forEach(item => {
          if (item.value === builderId) {
            this.companyName = item.companyName;
            this.form?.get('builderid')?.patchValue(builderId.toString());
            return;
          }
        });


      }
    }, err => {
      console.log(err);
    });
  }
  getAmentiesForDropDown() {

    this._projectService.getAmenties().pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      if (res?.isSuccess) {
        this.amenties = res?.data;
        this.amenties?.forEach(a => a['disabled'] = false);
      }
    }, err => {
    });
  }

  manageWorkingDays(day: string) {
  }


  timeChanged(time, weekIndex, prop, index) {
    //this.weeks[weekIndex][prop] = time;
    let workingHours = (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).controls[index];
    workingHours["controls"].weeks.value[prop] = time.target.value;
    this.updateWorkingHoursInForm(index);
  }
  // addWeek() {
  //   this.weeks.push({
  //     days: [{ day: "Sunday", selected: false, short: "S"},
  //     { day: "Monday", selected: false, short: "M" },
  //     { day: "Tuesday", selected: false, short: "T" },
  //     { day: "Wednesday", selected: false, short: "W" },
  //     { day: "Thursday", selected: false, short: "T" },
  //     { day: "Friday", selected: false, short: "F" },
  //     { day: "Saturday", selected: false, short: "S" }],
  //     startTime: '6:00',
  //     endTime: '16:00', timeZone: this.currentTimeZone
  //   })
  // }

  addNewWorkingHour() {
    (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).push(this.newWorkingHours(0, '', '', '', '', 0, (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).controls.length + 1));
  }

  toggleDay(weekIndex, dayIndex, index, day) {
    let workingHours = (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).controls[index];
    console.log(workingHours);
    const selected = workingHours["controls"].weeks?.value.days[dayIndex].selected;
    //workingHours["controls"].weeks.forEach(w => w.days[dayIndex].selected = false);
    workingHours["controls"].weeks.value.days[dayIndex].selected = !selected;
    this.updateWorkingHoursInForm(index);
    if (workingHours["controls"].weeks.value.days[dayIndex].selected)
      this.selectedDays.push(day);
    else {
      this.selectedDays.splice(this.selectedDays?.indexOf(day), 1);
      workingHours["controls"].day.patchValue('');
    }
    console.log(this.selectedDays);
    this.updateDaysSelection(dayIndex, index, workingHours["controls"].weeks.value.days[dayIndex].selected);
    this.checkAllDaysSelected();
  }

  updateDaysSelection(dayIndex, index, isSelected) {
    for (let i = 0; i < (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).controls.length; i++) {
      if (i === index)
        continue;

      let workingHours = (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).controls[i];
      workingHours["controls"].weeks.value.days[dayIndex].alreadyChosen = isSelected;

    }
  }

  updateWorkingHoursInForm(index) {
    //(this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).clear();
    let workingHours = (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).controls[index];
    let days: Array<string> = workingHours["controls"].weeks.value.days.filter(d => d.selected).map(d => d.day);
    if (days.length && workingHours["controls"].weeks.value.startTime && workingHours["controls"].weeks.value.endTime) {
      workingHours["controls"].day.setValue(days.join(','));
      workingHours["controls"].startTime.setValue(workingHours["controls"].weeks.value.startTime);
      workingHours["controls"].endTime.setValue(workingHours["controls"].weeks.value.endTime);
      workingHours["controls"].timeZone.setValue(workingHours["controls"].weeks.value.timeZone);
    }
  }


  onDateChange(control: string) {
    if (control == 'startDate') {
      this.completeMinDate = new Date(this.form.controls[control].value);
    } else {
      this.startMaxDate = new Date(this.form.controls[control].value);
    }
  }

  checkProjectStatus(status) {
    if (status.target.value == '2') {
      this.startMinDate = new Date();
      this.completeMinDate = new Date();
    } else if (status.target.value == '5') {
      this.startMaxDate = new Date();
      this.startMinDate = undefined as any;
      this.completeMinDate = new Date();
      this.completeMaxDate = new Date();
    } else {
      this.startMinDate = new Date(this.mindate);
      this.completeMinDate = new Date(this.mindate);
    }
  }

  checkAllDaysSelected() {
    const selectedCount = new Set(this.selectedDays).size;
    if (selectedCount > 7)
      this.isAllDaysSelected = true;
    else
      this.isAllDaysSelected = false;
  }

  removeWorkingHour(name: string, index: number) {
    let workingHours = (this.form.get('projectSalesOfficeDetails.workingHours') as FormArray).controls[index];

    workingHours["controls"].weeks.value.days?.forEach(item => {
      if (item?.selected) {
        this.selectedDays.splice(this.selectedDays?.indexOf(item?.day), 1);
      }
    });

    (this.form.get(name) as FormArray).removeAt(index);
    this.reCheckContorlsSelectionDays();
  }
}

