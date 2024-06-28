import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AgentService } from '../../services/agent.service';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { User } from 'src/app/models/user.model';
import { CONSTANT } from 'src/app/constants';
import { ResModel } from 'src/app/models/res.model';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {

  form: FormGroup;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  selectedAddress: any = {
    address1: '',
    province: '',
    city: '',
    zipCode: '',
    country: ''
  }
  agent: any;
  agencyId: number = 0;
  builderId: number = 0;
  onErrorImg = `/assets/imgs/no-image.jpg`;

  dialogRef!: MatDialogRef<any>;
  @ViewChild('deleteTemplate')
  deleteTemplate!: TemplateRef<any>;

  isEverLogin = false;

  @ViewChild('imgCropperTemplate') imgCropperTemplate!: TemplateRef<any>;
  @ViewChild('assignProjectToAgentTemplate') assignProjectToAgentTemplate!: TemplateRef<any>;
  user!: User

  selectedFieldForFileUpload!: string;
  base64Img_photo!: string | null | undefined;
  base64Img_businessCard!: string | null | undefined;
  photo_fileName!: string;
  businessCard_fileName!: string;
  aspectRatio: number = (1 / 1);
  imageChangedEvent: any;
  isProgressing: boolean = false;
  croppedImage!: File;
  tranform: ImageTransform = {};
  scale = 1;
  isProcessing!: boolean;

  onError(event: any) {
    event.target.src = this.onErrorImg;
  }

  edit: any = {
    personalDetails: false,
    accountDetails: false
  }

  projects: Array<{ text: string, value: number, selected?: boolean }> = [];
  enabledAssignProjectBtn: boolean = false;


  constructor(private activatedRoute: ActivatedRoute,
    private agentService: AgentService,
    private projectsService: ProjectsService,
    public dialog: MatDialog,
    private snackbarWrapperService: SnackbarWrapperService,
    private router: Router) {
    this.user = CONSTANT.getUser();

    this.enabledAssignProjectBtn = ['agency', 'builder'].includes(this.user?.role?.toLowerCase())

    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl('', [Validators.required]),
      brokerName: new FormControl('', [Validators.required]),

      address1: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),


      // email: new FormControl('', [Validators.email, Validators.required]),
      cellNumbers: new FormArray([]),


      realEstateBoardLicenseNumbers: new FormArray([new FormControl('', [Validators.required])]),
      brokerageCellNumbers: new FormArray([new FormControl('', [Validators.required])]),

      // companyLogoPath: new FormControl(),
      businessCard: new FormControl(),
      photo: new FormControl(),

      username: new FormControl('', [Validators.email, Validators.required]),
      // password: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
      // confirmPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
      // randomPassword: new FormControl(false),
      // isActive: new FormControl(true, [Validators.required]),
    });
    Object.keys(this.selectedAddress).forEach(key => {
      this.form.controls[key].valueChanges.subscribe(val => {
        this.selectedAddress[key] = val;
      });
    })
    this.activatedRoute.params.subscribe(params => {
      if (params?.agentId) {
        this.getAgent(params?.agentId)
      }
    })
  }

  getProjects() {
    this.isProgressing = true;
    let promise!: Promise<ResModel<Array<{ text: string, value: number }>>>;
    switch (this.user?.role?.toLowerCase()) {
      case 'agency':
        promise = this.projectsService.getProjectByAgencyForDropDown(this.user.id).toPromise()
        break;
      case 'builder':
        promise = this.projectsService.getProjectByBuilderForDropDown(this.user.id).toPromise()
        break;
    }

    promise?.then((res): any => {
      this.isProgressing = false;
      if (!res.isSuccess) {
        return this.snackbarWrapperService.open(res?.message || 'Something went wrong!');
      }
      this.projects = res?.data || [];

    })?.catch(err => {
      this.isProgressing = false;
      if (err?.error?.error) {
        this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
      } else if (err.message || err?.data?.message) {
        this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
      } else {
        this.snackbarWrapperService.open(JSON.stringify(err));
      }
    })

  }

  getAgent(id: any) {
    this.isProgressing = true;
    this.agentService.agent(id).subscribe(res => {
      this.isProgressing = false;
      this.agent = res?.data;

      let lastActivated = new Date(this.agent?.lastActiveDate);
      if (lastActivated.getFullYear() > 2000) this.isEverLogin = true;

      // const fullNames: Array<string> = (this.agent?.fullNAME || '').split(' '),
      //   firstName = fullNames?.length ? fullNames[0] : '';
      // fullNames.splice(0, 1);
      // const lastName = fullNames?.length ? fullNames.join(' ') : '';
      this.form.controls.address1.setValue(this.agent.realEstateBrokerAddress);
      this.form.controls.city.setValue(this.agent.city);
      this.form.controls.country.setValue(this.agent.country);
      this.form.controls.brokerName.setValue(this.agent.brokerName);
      this.form.controls.province.setValue(this.agent.province);
      // this.form.controls.fullName.setValue(this.agent.fullNAME);
      this.form.controls.firstName.setValue(this.agent.firstName || '');
      this.form.controls.middleName.setValue(this.agent?.middleName || '');
      this.form.controls.lastName.setValue(this.agent.lastName || '');
      this.form.controls.zipCode.setValue(this.agent.zipcode);
      this.form.controls.username.setValue(this.agent.username);
      (this.form.controls.cellNumbers as FormArray).clear();
      if (this.agent?.cellNo?.length) {
        (this.agent?.cellNo as Array<any>).forEach(i => {
          this.addField('cellNumbers', i);
        })
      } else {
        this.addField('cellNumbers');
      }

      (this.form.controls.realEstateBoardLicenseNumbers as FormArray).clear();
      if (this.agent?.realstateLicenceNo?.length) {
        (this.agent?.realstateLicenceNo as Array<any>).forEach(i => {
          this.addField('realEstateBoardLicenseNumbers', i.licenceNo);
        })
      } else {
        this.addField('realEstateBoardLicenseNumbers');
      }

      (this.form.controls.brokerageCellNumbers as FormArray).clear();
      if (this.agent?.brokerageCellNumber?.length) {
        (this.agent?.brokerageCellNumber as Array<any>).forEach(i => {
          this.addField('brokerageCellNumbers', i);
        })
      } else {
        this.addField('brokerageCellNumbers');
      }
      this.form.disable();

    }, err => {
      this.isProgressing = false;
      if (err?.error?.error) {
        this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
      } else if (err.message || err?.data?.message) {
        this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
      } else {
        this.snackbarWrapperService.open(JSON.stringify(err));
      }

    });
  }

  get cellNumbers(): FormArray {
    return this.form.get('cellNumbers') as FormArray;
  }
  get brokerageCellNumbers(): FormArray {
    return this.form.get('brokerageCellNumbers') as FormArray;
  }

  get realEstateBoardLicenseNumbers(): FormArray {
    return this.form.get('realEstateBoardLicenseNumbers') as FormArray;
  }

  addField(name: string, val?: any) {
    const validators = [Validators.required];
    if (['cellNumbers', 'brokerageCellNumbers'].includes(name)) {
      // validators.push(Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/))
    }
    (this.form.get(name) as FormArray).push(new FormControl(val ?? '', validators))
  }

  // isNameDuplicate(key: string): ValidatorFn {
  //   return (c: AbstractControl): { [key: string]: boolean } | null => {
  //     const items = (this.form.get(key) as FormArray).value;
  //     console.log(items);
  //     const names = items.map((item: any) => item.trim());
  //     const hasDuplicate = names.some((name: any, index: any) => {
  //       return names.indexOf(name, index + 1) != -1
  //     });

  //     if (hasDuplicate) {
  //       console.log(hasDuplicate);
  //       return { duplicate: true };
  //     }
  //     return null;
  //   }
  // }

  removeField(name: string, index: number) {
    (this.form.get(name) as FormArray).removeAt(index);
  }


  ngOnInit(): void {

    if ((localStorage.getItem("agencyId"))) {
      this.builderId = 0;
      this.agencyId = +(localStorage.getItem("agencyId") ?? 0)
    }
    if ((localStorage.getItem("builderId"))) {
      this.agencyId = 0;
      this.builderId = +(localStorage.getItem("builderId") ?? 0)
    }
  }


  toggleStatus(event: any) {
    this.agent.isActive = event?.checked;
    // this.update('personalDetails');
  }

  update(sectionId: string) {
    Object.keys(this.edit).forEach(k => this.edit[k] = false);

    const data = Object.assign({}, this.form.value);
    const CellNo: any = {};
    const cellNumbers = [...new Set(data?.cellNumbers || [])];
    cellNumbers?.forEach((item: any, index: any) => {
      Object.keys(item).forEach(k => CellNo[`CellNo[${index}].${k}`] = item[k])
      // CellNo[`CellNo[${index}].CellNo`] = item;
    });

    const BrokerageCellNumber: any = {};
    const brokerageCellNumbers = [...new Set(data?.brokerageCellNumbers || [])];
    brokerageCellNumbers?.forEach((item: any, index: any) => {
      Object.keys(item).forEach(k => BrokerageCellNumber[`BrokerageCellNumber[${index}].${k}`] = item[k]);
      // BrokerageCellNumber[`BrokerageCellNumber[${index}].CellNo`] = item;
    });

    const RealstateLicenceNo: any = {};
    const realEstateBoardLicenseNumbers = [...new Set(data?.realEstateBoardLicenseNumbers || [])];
    realEstateBoardLicenseNumbers?.forEach((item: any, index: any) => {
      RealstateLicenceNo[`RealstateLicenceNo[${index}].LicenceNo`] = item;
    });

    const payload: any = {
      FirstName: data.firstName,
      LastName: data.lastName,
      MiddleName: data.middleName,
      FullNAME: `${data.firstName} ${data.middleName} ${data.lastName}`,
      Email: this.agent?.username,
      LoginEmailAddress: this.agent?.username,
      CompanyLicense: this.agent?.companyLicense,
      IsActive: this.agent.isActive,
      BrokerName: data.brokerName,
      RealEstateBrokerAddress: data.address1,
      City: data.city,
      province: data.province,
      Country: data.country,
      Zipcode: data.zipCode,
      ...CellNo,
      ...BrokerageCellNumber,
      ...RealstateLicenceNo,
      // CellNo: JSON.stringify(data?.cellNumbers?.map((i: string) => ({ cellNo: i?.toString() }))),
      // BrokerageCellNumber: this.agent?.brokerageCellNumber?.map((i: string) => ({ cellNo: i?.toString() })),
      // RealstateLicenceNo: this.agent?.realstateLicenceNo?.map((i: string) => ({ licenceNo: i })),
      Username: this.agent?.username,
      // Password: data.password,
      BusinessCardFile: data.businessCard,
      PhotoFile: data.photo,
      Photo: this.agent?.photo,
      BusinessCard: this.agent?.businessCard,
      UserId: this.agent.userId
    }
    this.form.disable();
    this.isProgressing = true;
    this.agentService.update(payload, this.agent.agentId).subscribe(
      (res) => {
        this.isProgressing = false;
        if (!res?.isSuccess) {
          this.snackbarWrapperService.open(res?.message || 'something went wrong ! Please try again');
        } else {
          this.getAgent(this.agent.agentId);
          // window.location.reload();
          // this.router.navigate(['../', this.builder.builderId], { relativeTo: this.activatedRoute })
        }
      },
      err => {
        this.isProgressing = false;
        if (err?.error?.error) {
          this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
        } else if (err.message || err?.data?.message) {
          this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
        } else {
          this.snackbarWrapperService.open(JSON.stringify(err));
        }
      }
    );
  }


  editSection(sectionId: string) {
    Object.keys(this.edit).forEach(k => this.edit[k] = false);
    this.edit[sectionId] = true;
    this.form.enable();
    this.form.controls.username.disable();
  }

  updateAddress() {
    Object.keys(this.selectedAddress).forEach(key => {
      this.form.controls[key].setValue(this.selectedAddress[key]);
    })
  }

  openDialog() {
    this.dialogRef = this.dialog.open(this.deleteTemplate, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
    let sub = this.dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.deleteAgent();
      }
      sub.unsubscribe();
    })
  }

  openAssignProjectToAgentTemplate() {
    this.getProjects();
    this.dialogRef = this.dialog.open(this.assignProjectToAgentTemplate, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
    let sub = this.dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.deleteAgent();
      }
      sub.unsubscribe();
    })
  }

  selectProject(project) {
    project['selected'] = !project['selected'];
  }

  assignProject(): any {
    let selectedProjects = this.projects.filter(p => p?.selected);
    if (!selectedProjects.length) {
      return this.snackbarWrapperService.open('Please select project to assign');
    }
  }

  deleteAgent() {
    if (this.agent?.agentId) {
      this.agentService.delete(this.agent.agentId, this.agencyId, this.builderId).subscribe(res => {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }, err => { })
    }
  }

  public handleAddressChange(address: Address) {
    if (address?.address_components?.length) {
      [
        { prop: 'address1', type: 'sublocality' },//address.name
        { prop: 'province', type: 'administrative_area_level_1' },
        { prop: 'city', type: 'administrative_area_level_2' },
        { prop: 'zipCode', type: "postal_code" },
        { prop: 'country', type: "country" }
      ].forEach(item => {
        const val = address.address_components.find(ai => ai.types.includes(item.type));
        this.selectedAddress[item.prop] = val?.long_name ?? val?.short_name ?? '';
        if (item.prop === 'address1') {
          this.selectedAddress[item.prop] = `${address.name} ${this.selectedAddress[item.prop] ? ',' : ''}${this.selectedAddress[item.prop]}`
        }

        this.form.controls[item.prop].setValue(this.selectedAddress[item.prop]);
      });
    }
  }


  onFileChange(files: Array<File>, fieldName: string) {
    if (files?.length) {
      this.fileChangeEvent({ target: { files } }, fieldName);
    }
  }

  fileChangeEvent(event: any, fieldName: string): void {
    if (!event?.target?.files?.length) {
      return this.exitCropImage();
    }
    this.selectedFieldForFileUpload = fieldName;
    if (this.selectedFieldForFileUpload === 'photo') {
      this.aspectRatio = (1 / 1);
      this.photo_fileName = (event?.target?.files[0] as File).name;
    } else if (this.selectedFieldForFileUpload === 'businessCard') {
      this.aspectRatio = (16 / 9);
      this.businessCard_fileName = (event?.target?.files[0] as File).name;
    }
    this.imageChangedEvent = event;
    this.openImageDialog()
  }

  exitCropImage() {
    this.dialogRef?.close();
    this.imageChangedEvent = null;
    this.selectedFieldForFileUpload = '';
    this.resetInput('photo');
    //this.resetInput('businessCard');
  }

  resetInput(id: string) {
    const ele: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
    if (ele) {
      ele.value = '';
    }
  }

  openImageDialog() {
    this.dialogRef = this.dialog.open(this.imgCropperTemplate, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
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
    if (this.selectedFieldForFileUpload === 'photo') {
      this.base64Img_photo = event.base64;
    } else if (this.selectedFieldForFileUpload === 'businessCard') {
      this.base64Img_businessCard = event.base64;
    }

    this.croppedImage = file;
  }

  saveCropImage() {
    this.uploadFile(this.croppedImage);
  }

  uploadFile(file: File) {
    this.form.controls[this.selectedFieldForFileUpload].setValue(file);
    this.exitCropImage();
  }


  clearImg(fieldName: string) {
    if (fieldName === 'photo') {
      this.photo_fileName = '';
      this.base64Img_photo = null;
      this.form.controls[fieldName].setValue(null);
      this.croppedImage = undefined as any;
    } else if (fieldName === 'businessCard') {
      this.businessCard_fileName = '';
      this.base64Img_businessCard = null;
      this.form.controls[fieldName].setValue(null);
      this.croppedImage = undefined as any;
    }
  }

}
