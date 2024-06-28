import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateValidator } from 'src/app/shared/date.validator';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { WorksheetService } from '../../worksheet.service';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { Util } from 'src/app/shared/common.utils';

@Component({
  selector: 'app-add-purchaser-modal',
  templateUrl: './add-purchaser-modal.component.html',
  styleUrls: ['./add-purchaser-modal.component.scss']
})
export class AddPurchaserModalComponent implements OnInit {

  projectId = 0;
  form: FormGroup;
  isProgressing = false;
  CountryISO = CountryISO;
  purchaserDetail: any;

  constructor(public dialogRef: MatDialogRef<AddPurchaserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public purchaser: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private worksheetService: WorksheetService,
    private snackbarWrapperService: SnackbarWrapperService) {
    this.form = this.fb.group({
      fullName: new FormControl(null, [Validators.required]),
      docID: new FormControl("", [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      driverLicenseNumber: new FormControl(null, [Validators.required]),
      occupation: new FormControl(null, [Validators.required]),
      emailID: new FormControl(null, [Validators.required, Validators.email]),
      address: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      province: new FormControl(null, [Validators.required]),
      employer: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      zipCode: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      phoneNo: new FormControl('', [Validators.required]),
      governmentIDFile: new FormControl(null, [Validators.required]),
      otherDocFile: new FormControl(null),
      governmentID: new FormControl(null),
      otherDoc: new FormControl(null),
      expiryDate: new FormControl(null, [Validators.required, DateValidator.expiryDateVaidator]),
      projectWorkSheetId: new FormControl(),
      purchaserId: new FormControl(),
      phoneNoPurchaserPhoneId: new FormControl()
    });

    this.form.controls.dateOfBirth.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        let age = this.age(val);
        if (age < 18) {
          this.snackbarWrapperService.open('Age should be either 18 years or above 18 years');
          this.form.controls.dateOfBirth.setValue(null);
        } else {
          const date = Util.GetISODate(val);
          this.form.controls.dateOfBirth.setValue(date);
        }
      }
    })

    this.form.controls.expiryDate.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        const date = Util.GetISODate(val);
        this.form.controls.expiryDate.setValue(date);
      }
    });

    this.purchaserDetail = purchaser;
    if (purchaser != null) {
      if (purchaser.isUpdate) {
        this.form.controls.fullName.setValue(purchaser.fullName);
        this.form.controls.emailID.setValue(purchaser.emailID);
        this.form.controls.zipCode.setValue(purchaser.zipCode);
        this.form.controls.dateOfBirth.setValue(purchaser.dateOfBirth);
        this.form.controls.occupation.setValue(purchaser.occupation);
        this.form.controls.address.setValue(purchaser.address);
        this.form.controls.city.setValue(purchaser.city);
        this.form.controls.province.setValue(purchaser.province);
        this.form.controls.country.setValue(purchaser.country);
        this.form.controls.expiryDate.setValue(purchaser.expiryDate);
        this.form.controls.governmentID.setValue(purchaser.governmentID);
        this.form.controls.otherDoc.setValue(purchaser.otherDoc);
        this.form.controls.phoneNo.setValue(purchaser.phoneNo);
        this.form.controls.driverLicenseNumber.setValue(purchaser.driverLicenseNumber);
        this.form.controls.purchaserId.setValue(purchaser.purchaserId);
        this.form.controls.phoneNoPurchaserPhoneId.setValue(purchaser.phoneNoPurchaserPhoneId);
        this.form.controls.docID.setValue(purchaser.docID);
        this.form.controls.employer.setValue(purchaser.employer);

      }
      this.form.controls.projectWorkSheetId.setValue(purchaser.projectWorkSheetId);

    }
  }


  age(date) {
    var dob = new Date(date);
    //calculate month difference from current date in time
    var month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format
    var age_dt = new Date(month_diff);

    //extract year from date    
    var year = age_dt.getUTCFullYear();

    //now calculate the age of the user
    var age = Math.abs(year - 1970);

    //display the calculated age
    return age
  }
  ngOnInit(): void {
  }

  public handleAddressChange(address: Address) {
    // if (address?.address_components?.length && this.projectWorkSheetPurchasers?.controls && this.projectWorkSheetPurchasers?.controls[index]) {
    //   [
    //     { prop: 'address', type: 'sublocality' },//address.name
    //     { prop: 'province', type: 'administrative_area_level_1' },
    //     { prop: 'city', type: 'administrative_area_level_2' },
    //     { prop: 'zipCode', type: "postal_code" },
    //     { prop: 'country', type: "country" }
    //   ].forEach(item => {
    //     const val = address.address_components.find(ai => ai.types.includes(item.type));
    //     let value = val?.long_name ?? val?.short_name ?? '';
    //     if (item.prop === 'address') {
    //       value = `${address.name} ${value ? ',' : ''}${value}`;
    //     }
    //     (this.projectWorkSheetPurchasers?.controls[index] as FormGroup).controls[item.prop].setValue(value);
    //   });
    // }

  }

  addPurhcaser() {

    this.checkForm();
    if (this.form.valid) {
      this.isProgressing = true;
      const data = Object.assign({}, this.form.value);

      const payload = {
        projectWorkSheetPurchaser: data
      }


      const formData = this.getFormData(payload);

      this.worksheetService.addPurchaser(formData).subscribe(res => {
        this.snackbarWrapperService.open("Purchaser added successfully");
        this.dialogRef.close(true);
      }, err => {
        this.snackbarWrapperService.open("Error while adding purchaser");
      });
    }
  }

  updatePurchaser() {
    this.checkForm();
    if (this.form.valid) {
      this.isProgressing = true;
      const data = Object.assign({}, this.form.value);

      if (data !== undefined) {
        data.phoneNo.PurchaserPhoneId = this.form.controls.phoneNoPurchaserPhoneId.value;
      }

      const payload = {
        projectWorkSheetPurchaser: data,
        isUpdate: true
      }
      const formData = this.getFormData(payload);
      this.worksheetService.updatePurchaser(formData).subscribe(res => {
        this.snackbarWrapperService.open("Purchaser updated successfully");
        this.dialogRef.close(true);
      }, err => {
        this.snackbarWrapperService.open("Error while updating purchaser");
      });
    }
  }

  getFormData(payload: any) {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === "object") {
        Object.keys(payload[key]).forEach(key1 => {
          if (typeof payload[key][key1] === "object" && (payload[key][key1] instanceof File)) {
            formData.append(key + `[${key1}]`, payload[key][key1]);
          }
          else if (typeof payload[key][key1] === "object") {
            for (var key2 in payload[key][key1]) {
              formData.append(key + `[${key1}][${key2}]`, payload[key][key1][key2]);
            }
          }
          else {
            formData.append(key + `[${key1}]`, payload[key][key1])
          }
        });
      } else {
        formData.append(key, payload[key])
      }
    });

    return formData;
  }

  checkForm() {

    if (this.purchaserDetail.governmentID)
      this.form.controls.governmentIDFile.setErrors(null);

    Object.keys(this.form.controls).forEach(field => {
      const control: any = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  onGovernmentFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form?.get("governmentIDFile")?.patchValue(file);
    }
  }

  onPictureFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form?.get("otherDocFile")?.patchValue(file);
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}



