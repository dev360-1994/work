import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { BuilderService } from '../../services/builder.service';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {

  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  form!: FormGroup;
  selectedAddress: any = {
    address1: '',
    province: '',
    city: '',
    zipCode: '',
    country: ''
  }
  builder: any;
  onErrorImg = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK1UhUMG9MTojpNTLV0XoDh-3cWX2XxTcPng&usqp=CAU`;

  dialogRef!: MatDialogRef<any>;
  @ViewChild('deleteTemplate')
  deleteTemplate!: TemplateRef<any>;
  edit: any = {
    personalDetails: false,
    accountDetails: false
  }
  isProgressing: boolean = false;
  isEverLogin = false;
  @ViewChild('imgCropperTemplate') imgCropperTemplate!: TemplateRef<any>;
  selectedFieldForFileUpload!: string;
  base64Img_photo!: string | null | undefined;
  base64Img_businessCard!: string | null | undefined;
  photo_fileName!: string;
  businessCard_fileName!: string;
  aspectRatio: number = (1 / 1);
  imageChangedEvent: any;
  croppedImage!: File;
  tranform: ImageTransform = {};
  scale = 1;
  isProcessing!: boolean;

  onError(event: any) {
    event.target.src = this.onErrorImg;
  }

  cellNumber!: any; companyContact!: any;

  constructor(private activatedRoute: ActivatedRoute,
    private builderService: BuilderService,
    public dialog: MatDialog,
    private snackbarWrapperService: SnackbarWrapperService,
    private router: Router) {

    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl('', [Validators.required]),
      address1: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      companyContact: new FormControl('', [Validators.required]),
      cellNumber: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.email, Validators.required]),
      photo: new FormControl()
      // isActive: new FormControl(true, [Validators.required]),
    });

    Object.keys(this.selectedAddress).forEach(key => {
      this.form.controls[key].valueChanges.subscribe(val => {
        this.selectedAddress[key] = val;
      });
    })

    this.activatedRoute.params.subscribe(params => {
      if (params?.builderId) {
        this.getBuilder(params?.builderId);
      }
    })
  }

  getBuilder(id: any) {
    this.isProgressing = true;
    this.builderService.builder(id).subscribe(res => {
      this.builder = res?.data;

      let lastActivated = new Date(this.builder?.lastActiveDate);
      if (lastActivated.getFullYear() > 2000) this.isEverLogin = true;

      // const fullNames: Array<string> = (this.builder?.fullName || '').split(' '),
      //   firstName = fullNames?.length ? fullNames[0] : '';
      // fullNames.splice(0, 1);
      // const lastName = fullNames?.length ? fullNames.join(' ') : '';
      this.cellNumber = this.builder?.builderPhoneNo?.find((i: any) => i.phoneType == 1);
      this.companyContact = this.builder?.builderPhoneNo?.find((i: any) => i.phoneType == 2);

      this.form.controls.address1.setValue(this.builder.address1);
      this.form.controls.cellNumber.setValue(this.cellNumber || '');
      this.form.controls.city.setValue(this.builder.city);
      this.form.controls.companyContact.setValue(this.companyContact || '');
      this.form.controls.companyName.setValue(this.builder.companyName);
      this.form.controls.country.setValue(this.builder.country);
      // this.form.controls.email.setValue(this.builder.username);
      this.form.controls.username.setValue(this.builder.username);
      this.form.controls.province.setValue(this.builder.province);
      // this.form.controls.fullName.setValue(this.builder.fullName);
      this.form.controls.firstName.setValue(this.builder.firstName || '');
      this.form.controls.middleName.setValue(this.builder?.middleName || '');
      this.form.controls.lastName.setValue(this.builder.lastName || '');
      this.form.controls.zipCode.setValue(this.builder.zipCode);
      this.form.disable();
      this.isProgressing = false;
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

  openDialog() {
    this.dialogRef = this.dialog.open(this.deleteTemplate, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
    let sub = this.dialogRef.afterClosed().subscribe(val => {
      if (val) {
        this.deleteBuilder();
      }
      sub.unsubscribe();
    })
  }

  deleteBuilder() {
    if (this.builder?.builderId) {
      this.builderService.remove(this.builder.builderId).subscribe(res => {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }, err => { });
    }
  }


  ngOnInit(): void {
  }

  toggleStatus(event: any) {
    this.builder.isActive = event?.checked;
    // this.update('personalDetails');
  }

  update(sectionId: string) {
    Object.keys(this.edit).forEach(k => this.edit[k] = false);

    const data = Object.assign({}, this.form.value);
    let builderPhoneNo: any = {};
    let cellNumber = { ...this.cellNumber, ...data?.cellNumber, phoneType: 1 };
    Object.keys(cellNumber).forEach(k => {
      builderPhoneNo[`BuilderPhoneNo[0].${k}`] = cellNumber[k];
    })

    let companyContact = { ...this.companyContact, ...data?.companyContact, phoneType: 2 };
    Object.keys(companyContact).forEach(k => {
      builderPhoneNo[`BuilderPhoneNo[1].${k}`] = companyContact[k];
    })
    const payload: any = {
      FirstName: data?.firstName,
      LastName: data?.lastName,
      MiddleName: data.middleName,
      FullNAME: `${data.firstName} ${data.middleName} ${data.lastName}`,
      Address1: data?.address1,
      Address2: data?.address2,
      ZipCode: data?.zipCode,
      Province: data?.province,
      Country: data?.country,
      City: data?.city,
      CompanyLicense: '',
      // CompanyName: this.builder?.companyName,
      CompanyName: data?.companyName,
      // CellNumber: data?.cellNumber,
      // CompanyContact: this.builder?.companyContact,
      // CellNumber: data?.cellNumber?.e164Number || data?.cellNumber,
      // CompanyContact: data?.companyContact?.e164Number || data?.companyContact,
      ...builderPhoneNo,
      IsActive: this.builder.isActive,
      Username: this.builder.username || 'yuop@gmai.ci',
      Email: this.builder.username || 'yuop@gmai.ci',
      CompanyLogoPath: this.builder.companyLogoPath,
      UserId: this.builder.userId,
      LogoFile: data.photo,
    }
    this.form.disable();
    this.isProgressing = true;
    this.builderService.update(payload, this.builder.builderId).subscribe(
      (res) => {
        this.isProgressing = false;
        if (!res?.isSuccess) {
          this.snackbarWrapperService.open(res?.message || 'something went wrong ! Please try again');
        } else {
          this.getBuilder(this.builder.builderId);
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
    // this.form.controls.email.disable();
    this.form.markAllAsTouched();
  }

  updateAddress() {
    Object.keys(this.selectedAddress).forEach(key => {
      this.form.controls[key].setValue(this.selectedAddress[key]);
    })
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
  addAgent() {
    localStorage.setItem("builderId", this.builder.builderId);
    this.router.navigate(['griddo-master/agents/add']);
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

  clearImg(fieldName: string) {
    if (fieldName === 'photo') {
      this.photo_fileName = '';
      this.base64Img_photo = null;
      this.form.controls[fieldName].setValue(null);
      this.croppedImage = undefined as any;
    }
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

}
