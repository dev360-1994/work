import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { FileUploadService } from 'src/app/modules/auth/services/file-upload.service';
import { AgencyService } from '../../services/agency.service';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.scss']
})
export class AddAgencyComponent implements OnInit {

  form!: FormGroup;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  isProcessing!: boolean;
  visibility: boolean = false;
  selectedAddress: any = {
    address1: '',
    province: '',
    city: '',
    zipCode: '',
    country: ''
  }

  dialogRef!: MatDialogRef<any>;

  @ViewChild('imgCropperTemplate')
  imgCropperTemplate!: TemplateRef<any>;
  imageChangedEvent: any;
  tranform: ImageTransform = {};
  croppedImage!: File;
  scale = 1;
  selectedFieldForFileUpload!: string;
  base64Img_photo!: string | null | undefined;
  base64Img_businessCard!: string | null | undefined;
  photo_fileName!: string;
  businessCard_fileName!: string;
  aspectRatio: number = (1 / 1);


  constructor(private agencyService: AgencyService,
    private router: Router,
    private fileUploadService: FileUploadService,
    public dialog: MatDialog,
    private snackbarWrapperService: SnackbarWrapperService,
    private activatedRoute: ActivatedRoute) {
    const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    this.form = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [Validators.required]),
      brokerageName: new FormControl('', []),

      address1: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),


      // email: new FormControl('', [Validators.email, Validators.required]),
      cellNumbers: new FormArray([]),

      realEstateBoardLicenseNumbers: new FormArray([new FormControl('', [Validators.required])]),
      brokerageCellNumbers: new FormArray([]),

      photo: new FormControl(),
      businessCard: new FormControl(),
      username: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
      randomPassword: new FormControl(false),
      // isActive: new FormControl(true, [Validators.required]),
    });
    this.addField('cellNumbers');
    this.addField('brokerageCellNumbers');
    Object.keys(this.selectedAddress).forEach(key => {
      this.form.controls[key].valueChanges.subscribe(val => {
        this.selectedAddress[key] = val;
      });
    })
    this.form.controls.randomPassword.valueChanges.subscribe(val => {
      if (val) {
        const rp = this.generatePassword(8);
        this.form.controls.password.setValue(rp);
        this.form.controls.confirmPassword.setValue(rp);
        // this.form.controls.password.disable();
        // this.form.controls.confirmPassword.disable();
      } else {
        this.form.controls.password.setValue('');
        this.form.controls.confirmPassword.setValue('');
        // this.form.controls.password.enable();
        // this.form.controls.confirmPassword.enable();
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

  ngOnInit(): void {
  }



  addField(name: string) {
    const validators = [Validators.required];
    if (['cellNumbers', 'brokerageCellNumbers'].includes(name)) {
      // validators.push(Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/))
    }
    if(name === 'brokerageCellNumbers') (this.form.get(name) as FormArray).push(new FormControl(''))
    else (this.form.get(name) as FormArray).push(new FormControl('', validators))
     
  }
  removeField(name: string, index: number) {
    (this.form.get(name) as FormArray).removeAt(index);
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
    this.openDialog()
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

  resetInput(id: string) {
    const ele: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
    if (ele) {
      ele.value = '';
    }
  }

  exitCropImage() {
    this.dialogRef?.close();
    this.imageChangedEvent = null;
    this.selectedFieldForFileUpload = '';
    this.resetInput('photo');
    this.resetInput('businessCard');
  }

  uploadFile(file: File) {
    this.form.controls[this.selectedFieldForFileUpload].setValue(file);
    this.exitCropImage();
    // this.isProcessing = true;
    // this.fileUploadService.upload(file).subscribe(res => {
    //   if (res.url && this.selectedFieldForFileUpload && this.form.controls[this.selectedFieldForFileUpload]) {
    //     this.form.controls[this.selectedFieldForFileUpload].setValue(res.url);
    //   }
    //   this.exitCropImage();
    //   this.isProcessing = false;
    // }, err => {
    //   this.snackbarWrapperService.open(JSON.stringify(err));
    //   this.exitCropImage();
    //   this.isProcessing = false;
    // });
  }

  openDialog() {
    this.dialogRef = this.dialog.open(this.imgCropperTemplate, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
  }

  generatePassword(passwordLength: number) {
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var specialChars = "!@#$%^&*";
    var allChars = numberChars + upperChars + lowerChars + specialChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray[3] = specialChars;
    randPasswordArray = randPasswordArray.fill(allChars, 4);
    return this.shuffleArray(randPasswordArray.map((x) => { return x[Math.floor(Math.random() * x.length)] })).join('');
  }

  shuffleArray(array: Array<any>) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  add():any {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return this.snackbarWrapperService.open('Please fill all required fields');;
    }
    if (this.form?.value?.password !== this.form?.value?.confirmPassword) {
      return this.snackbarWrapperService.open('Password & Confirm Password should match!');
    }
    this.updateAddress();
    this.isProcessing = true;
    const data = Object.assign({}, this.form.value);
    delete data.randomPassword;

    const CellNo: any = {};
    const cellNumbers = [...new Set(data?.cellNumbers || [])];
    cellNumbers?.forEach((item: any, index: any) => {
      Object.keys(item).forEach(k => CellNo[`CellNo[${index}].${k}`] = item[k])
      // CellNo[`CellNo[${index}].CellNo`] = item;
    });

    const POCCellNumber: any = {};
    const brokerageCellNumbers = [...new Set(data?.brokerageCellNumbers || [])];
    brokerageCellNumbers?.forEach((item: any, index: any) => {
      if(item !== null)
        Object.keys(item).forEach(k => POCCellNumber[`POCCellNumber[${index}].${k}`] = item[k]);
      // BrokerageCellNumber[`BrokerageCellNumber[${index}].CellNo`] = item;
    });

    const RealstateLicenceNo: any = {};
    const realEstateBoardLicenseNumbers = [...new Set(data?.realEstateBoardLicenseNumbers || [])];
    realEstateBoardLicenseNumbers?.forEach((item: any, index: any) => {
      RealstateLicenceNo[`RealstateLicenceNo[${index}].LicenceNo`] = item;
    });

    const payload: any = {
      agencyName:data.fullNAME,
      fullName: data.fullName,
      emailAddress: data.emailAddress,
      Email: data.username,
      LoginEmailAddress: data.username,
      CompanyLicense: 'companyLicense',
      IsActive: true,
      POCName: data.brokerageName,
      RealEstateBrokerAddress: data.address1,
      City: data.city,
      province: data.province,
      Country: data.country,
      Zipcode: data.zipCode,
      ...CellNo,
      ...POCCellNumber,
      ...RealstateLicenceNo,
      // CellNo: JSON.stringify(data?.cellNumbers?.map((i: string) => ({ cellNo: i?.toString() }))),
      // BrokerageCellNumber: data?.brokerageCellNumbers?.map((i: string) => ({ cellNo: i?.toString() })),
      // RealstateLicenceNo: data?.realEstateBoardLicenseNumbers?.map((i: string) => ({ licenceNo: i })),
      Username: data.username,
      Password: data.password,
      BusinessCardFile: data.businessCard,
      PhotoFile: data.photo,
      Photo: this.photo_fileName,
      BusinessCard: this.businessCard_fileName
    }
    this.agencyService.add(payload).subscribe((res) => {

      this.isProcessing = false;
      if (!res?.isSuccess) {
        this.snackbarWrapperService.open(res?.message || 'something went wrong ! Please try again');
      }
      if (res?.isSuccess) {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
    }, err => {
      if (err?.error?.error) {
        this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
      } else if (err.message || err?.data?.message) {
        this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
      } else {
        this.snackbarWrapperService.open(JSON.stringify(err));
      }
      this.isProcessing = false;
    });
  }

  updateAddress() {
    Object.keys(this.selectedAddress).forEach(key => {
      //this.form.controls[key].setValue(this.selectedAddress[key]);
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
       // const val = address.address_components.find(ai => ai.types.includes(item.type));
       let val;
        if(item.prop == "city"){
          val = address.address_components.find(ai => ai.types.includes("locality") && ai.types.includes("political"));
          val = val == undefined ? address.address_components.find(ai => ai.types.includes("administrative_area_level_3") && ai.types.includes("political")):val;
        }
        else {
        val = address.address_components.find(ai => ai.types.includes(item.type));
        }
        this.selectedAddress[item.prop] = val?.long_name ?? val?.short_name ?? '';
        if (item.prop === 'address1') {
          this.selectedAddress[item.prop] = `${address.name} ${this.selectedAddress[item.prop] ? ',' : ''}${this.selectedAddress[item.prop]}`
        }

        this.form.controls[item.prop].setValue(this.selectedAddress[item.prop]);
      });
    }
  }

}
