import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FileUploadService } from 'src/app/modules/auth/services/file-upload.service';
import { BuilderService } from '../../services/builder.service';

export interface AddBuilderTab {
  title: string;
  name: string;
  buttons?: Array<{ label: string, classes: string, onClick: () => any }>;
}

@Component({
  selector: 'app-add-builder',
  templateUrl: './add-builder.component.html',
  styleUrls: ['./add-builder.component.scss']
})
export class AddBuilderComponent implements OnInit {

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
  base64Img!: string | null | undefined;
  fileName!: string;


  constructor(private builderService: BuilderService,
    private snackbarWrapperService: SnackbarWrapperService,
    private fileUploadService: FileUploadService,
    public dialog: MatDialog,
    private router: Router, private activatedRoute: ActivatedRoute) {
    const phoneRegx = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    const phoneRegx1 = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    const passwordRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    this.form = new FormGroup({
      companyName: new FormControl('', [Validators.required]),
      companyContact: new FormControl('', [Validators.required]),
      userRole: new FormControl('builderAdmin', [Validators.required]),
      companyLogoPath: new FormControl(''),


      // fullName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl('', [Validators.required]),

      address1: new FormControl('', [Validators.required]),
      address2: new FormControl(''),
      province: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),

      cellNumber: new FormControl('', [Validators.required]),


      // email: new FormControl('', [Validators.email, Validators.required]),


      // companyLicense: new FormControl('', [Validators.required]),

      username: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegx)]),
      randomPassword: new FormControl(false),
      // isActive: new FormControl(true, [Validators.required]),
    });

    Object.keys(this.selectedAddress).forEach(key => {
      this.form.controls[key].valueChanges.subscribe(val => {
        this.selectedAddress[key] = val;
      });
    });
    this.form.controls.randomPassword.valueChanges.subscribe(val => {
      if (val) {
        const rp = this.generatePassword(8);
        this.form.controls.password.setValue(rp);
        this.form.controls.confirmPassword.setValue(rp);
      } else {
        this.form.controls.password.setValue('');
        this.form.controls.confirmPassword.setValue('');
      }
    });
  }

  getPhoneNumberRegx = () => /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;

  ngOnInit(): void {
  }
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onFileChange(files: Array<File>) {
    if (files?.length) {
      this.fileChangeEvent({ target: { files } });
    }
  }
  fileChangeEvent(event: any): void {
    if (!event?.target?.files?.length) {
      return this.exitCropImage();
    }
    this.fileName = (event?.target?.files[0] as File).name;
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

  clearImg() {
    this.fileName = '';
    this.base64Img = null;
    this.form.controls.companyLogoPath.setValue(null);
    this.croppedImage = undefined as any;
  }

  imageCropped(event: ImageCroppedEvent) {
    const file = this.dataURLtoFile(event.base64, 'img.jpeg');
    this.base64Img = event.base64;
    this.croppedImage = file;
  }

  saveCropImage() {
    this.uploadFile(this.croppedImage);
  }



  exitCropImage() {
    this.dialogRef?.close();
    this.imageChangedEvent = null;
    const ele: HTMLInputElement = document.getElementById('companyLogoPath') as HTMLInputElement;
    if (ele) {
      ele.value = '';
    }
  }

  uploadFile(file: File) {
    this.form.controls.companyLogoPath.setValue(file);
    this.exitCropImage();
    // this.isProcessing = true;
    // this.fileUploadService.upload(file).subscribe(res => {
    //   if (res.url) {
    //     this.form.controls.companyLogoPath.setValue(res.url);
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
    let builderPhoneNo: any = {};
    let cellNumber = { ...data?.cellNumber, phoneType: 1 };
    // delete cellNumber.number;
    Object.keys(cellNumber).forEach(k => {
      builderPhoneNo[`BuilderPhoneNo[0].${k}`] = cellNumber[k];
    })

    let companyContact = { ...data?.companyContact, phoneType: 2 };
    // delete companyContact.number;
    Object.keys(companyContact).forEach(k => {
      builderPhoneNo[`BuilderPhoneNo[1].${k}`] = companyContact[k];
    })

    const payload: any = {
      FirstName: data?.firstName,
      LastName: data?.lastName,
      MiddleName: data.middleName,
      FullName: `${data?.firstName} ${data.middleName} ${data?.lastName}`,
      Address1: data?.address1,
      Address2: data?.address2,
      ZipCode: data?.zipCode,
      City: data?.city,
      Email: data?.username,
      ...builderPhoneNo,
      // CellNumber: data?.cellNumber,
      CompanyName: data?.companyName,
      // CompanyContact: data?.companyContact,
      // CellNumber: data?.cellNumber?.e164Number || data?.cellNumber,
      // CompanyContact: data?.companyContact?.e164Number || data?.companyContact,
      CompanyLicense: '',
      CompanyLogoPath: this.fileName,
      IsActive: true,
      Username: data?.username,
      Password: data?.password,
      LogoFile: data?.companyLogoPath,
      Province: data?.province,
      Country: data?.country
    }
    this.builderService.add(payload).subscribe((res: any) => {
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


  // handleError = (error: HttpErrorResponse) => {
  //   console.log('Handle on Component', error);
  //   debugger;
  //   // if (error.status === 401) {
  //   //   this.showError = true;
  //   //   this.error = error.message;
  //   //   return Observable.of(error.message);

  //   // }
  //   // this.showError = true;
  //   // this.error = error.message;
  //   return of(error.message);
  // };

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
        //const val = address.address_components.find(ai => ai.types.includes(item.type));
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
