import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { CONSTANT } from 'src/app/constants';
import { User } from 'src/app/models/user.model';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { WorksheetService } from '../../worksheet.service';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { DateValidator } from 'src/app/shared/date.validator';
import { ProjectModel } from 'src/app/enums/allEnum.enum';
import { Util } from 'src/app/shared/common.utils';

@Component({
  selector: 'app-edit-worksheet',
  templateUrl: './edit-worksheet.component.html',
  styleUrls: ['./edit-worksheet.component.scss']
})

export class EditWorksheetComponent implements OnInit {

  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  form: FormGroup;
  user: User;
  isProcessing!: boolean;
  projects!: Array<any>;
  units: any;
  buyerInfo: any = [];
  modelInfo: any = [];
  worksheetNo: any;
  isUpdate = false;
  isNewFieldAdded = true;
  public projectModelEnum = ProjectModel;
  numberOfPurchaser = 0;
  numberofChoices = 0;
  coolingOffDays = 0;
  projectUnitName: any[] = [];

  constructor(
    private projectsService: ProjectsService,
    private snackbarWrapperService: SnackbarWrapperService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private worksheetService: WorksheetService, public dialog: MatDialog,
  ) {

    var d = new Date(), month = '' + (d.getMonth() + 1), day = '' + d.getDate()

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    this.worksheetNo = day + month + Math.floor(100000 + Math.random() * 900000);
    this.user = CONSTANT.getUser();
    this.fetchProjects();
    this.form = new FormGroup({
      projectWorkSheetNo: new FormControl(this.worksheetNo),
      projectId: new FormControl(null, [Validators.required]),
      isParking: new FormControl(false),
      locker: new FormControl(false),
      storage: new FormControl(false),
      notes: new FormControl(""),
      model: new FormControl(null),
      floor: new FormControl(null, [Validators.required]),
      projectWorkSheetPurchaserChoise: new FormArray([]),
      projectWorkSheetPurchasers: new FormArray([]),
    });
    //this.add_projectWorkSheetPurchaserChoise();
    this.add_projectWorkSheetPurchasers();

    this.form.controls['projectId'].valueChanges.subscribe(val => this.unitDetailsBYProject(val));

  }

  get projectWorkSheetPurchasers(): FormArray {
    return this.form.get('projectWorkSheetPurchasers') as FormArray;
  }

  get projectWorkSheetPurchaserChoise(): FormArray {
    return this.form.get('projectWorkSheetPurchaserChoise') as FormArray;
  }

  add_projectWorkSheetPurchaserChoise() {

    this.projectWorkSheetPurchaserChoise.push(new FormGroup({
      model: new FormControl(null, [Validators.required]),
      floor: new FormControl(null, [Validators.required]),
    }))
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

  add_projectWorkSheetPurchasers() {
    const form = new FormGroup({
      fullName: new FormControl(null, [Validators.required]),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      model: new FormControl(''),
      docID: new FormControl(0, [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      driverLicenseNumber: new FormControl(null, [Validators.required]),
      occupation: new FormControl(null, [Validators.required]),
      emailID: new FormControl(null, [Validators.required, Validators.email]),
      address: new FormControl(null, [Validators.required]),
      employer: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      province: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      zipCode: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
      phoneNo: new FormControl('', [Validators.required]),
      governmentIDFile: new FormControl(null, [Validators.required]),
      otherDocFile: new FormControl(null),
      governmentID: new FormControl(null),
      otherDoc: new FormControl(null),
      saved: new FormControl(false),
      new: new FormControl(true),
      expiryDate: new FormControl(null, [Validators.required, DateValidator.expiryDateVaidator])
    });

    this.projectWorkSheetPurchasers.push(form);
    form.controls.dateOfBirth.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        let age = this.age(val);
        if (age < 18) {
          this.snackbarWrapperService.open('Age should be either 18 years or above 18 years');
          form.controls.dateOfBirth.setValue(null);
        } else {
          const date = Util.GetISODate(val);
          form.controls.dateOfBirth.setValue(date);
        }
      }
    });

    form.controls.expiryDate.valueChanges.subscribe(val => {
      if (val?.toISOString) {
        const date = Util.GetISODate(val);
        form.controls.expiryDate.setValue(date);
      }
    });
  }

  removeField(index: number) {
    this.projectWorkSheetPurchasers.removeAt(index);
  }

  fetchProjects(): any {
    this.isProcessing = true;
    let sub;
    if (this.user.role === 'Agent') {
      sub = this.projectsService.getProjectByAdminAgentForDropDown(this.user.id);
    } else if (this.user.role === 'Builder') {
      sub = this.projectsService.getProjectByBuilderForDropDown(this.user.id);
    }

    if (!sub?.subscribe) {
      return this.isProcessing = false;
    }

    sub.subscribe(res => {
      this.projects = res?.data || [];
      if (this.projects.length) {
        const projectId = CONSTANT.find_params_in_activated_route('projectId', this.activatedRoute.snapshot);
        if (projectId) {
          const project = this.projects.find(p => p.value == projectId);
          if (project) {
            this.form.get('projectId')?.setValue(project.value);
            this.form.get('projectId')?.disable();
            this.onProjectSelected(projectId);
          }
        }
      }
      this.isProcessing = false;
    }, err => {
      this.isProcessing = false;
    })
  }

  public handleAddressChange(address: Address, index: number) {
    if (address?.address_components?.length && this.projectWorkSheetPurchasers?.controls && this.projectWorkSheetPurchasers?.controls[index]) {
      [
        { prop: 'address', type: 'sublocality' },//address.name
        { prop: 'province', type: 'administrative_area_level_1' },
        { prop: 'city', type: 'administrative_area_level_2' },
        { prop: 'zipCode', type: "postal_code" },
        { prop: 'country', type: "country" }
      ].forEach(item => {
        const val = address.address_components.find(ai => ai.types.includes(item.type));
        let value = val?.long_name ?? val?.short_name ?? '';
        if (item.prop === 'address') {
          value = `${address.name} ${value ? ',' : ''}${value}`;
        }
        (this.projectWorkSheetPurchasers?.controls[index] as FormGroup).controls[item.prop].setValue(value);
      });
    }
  }

  unitDetailsBYProject(projectId: any) {
    this.projectsService.getUnitBYProject(parseInt(projectId)).subscribe(res => this.units = res?.data?.length ? res?.data[0] : {});
  }

  onGovernmentFileChange(event, index) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.projectWorkSheetPurchasers.at(index)?.get("governmentIDFile")?.patchValue(file);
    }
  }

  onPictureFileChange(event, index) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.projectWorkSheetPurchasers.at(index)?.get("otherDocFile")?.patchValue(file);
    }
  }

  save() {
    if (this.form.valid) {
      this.isProcessing = true;
      const data = Object.assign({}, this.form.getRawValue());
      const payload = {
        projectWorkSheetNo: data.projectWorkSheetNo,
        projectId: data.projectId,
        isParking: data.isParking,
        locker: data.locker,
        storage: data.storage,
        model: data.model,
        notes: data.notes,
        projectWorkSheetPurchaserChoise: this.modelInfo,
        projectWorkSheetPurchasers: data?.projectWorkSheetPurchasers?.map((i: any) => ({
          ...i,
          fullName: `${i?.fullName}`,
          //phoneNo: { i.cellNumber }
        })),
        builderId: this.user.builderId
      }

      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key]) {
          if (Array.isArray(payload[key])) {
            if (payload[key].length > 0) {
              payload[key].forEach(function (value: any, index: number) {
                if (value?.email != "" || value?.item != "") {
                  for (var key2 in payload[key][index]) {
                    if (typeof payload[key][index][key2] === "object" && (payload[key][index][key2] instanceof File)) {
                      formData.append(key2 + `[${index}]`, value[key2]);
                    }
                    else if (typeof payload[key][index][key2] === "object") {
                      for (var key3 in payload[key][index][key2]) {
                        formData.append(key + `[${index}][${key2}][${key3}]`, value[key2][key3]);
                      }
                    }
                    else {
                      formData.append(key + `[${index}][${key2}]`, value[key2])
                    }
                  }
                }
              });
            }
            else {
              formData.append(key, payload[key])
            }
          }
          else {
            formData.append(key, payload[key])
          }
        }
      });

      this.worksheetService.add(formData).subscribe((res) => {
        this.isProcessing = false;
        if (!res?.isSuccess) {
          this.snackbarWrapperService.open(res?.message || 'something went wrong ! Please try again');
        }
        if (res?.isSuccess) {
          this.snackbarWrapperService.open('Worksheet added successfully.');
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
    else {
      this.snackbarWrapperService.open("Please fill all Fields.");
    }
  }



  ngOnInit(): void {
  }

  saveModel() {
    if (this.form.controls.floor.valid
      && this.form.controls.model.valid
      && this.form.controls.model.value !== null
      && this.form.controls.floor.value !== "null"
    ) {
      if (this.modelInfo.length >= this.numberofChoices) {
        this.snackbarWrapperService.open("Your choice for workseet is limited");
      } else {
        const data = Object.assign({}, this.form.getRawValue());
        this.modelInfo.push({ model: data.model, floor: data.floor });
      }
    } else {
      this.form.controls.model.markAsTouched();
      this.form.controls.floor.markAsTouched();
      this.form.controls.floor.value == "null" ? this.form.controls.floor.setErrors({ 'incorrect': true }) : "";
      this.form.controls.model.value == null ? this.form.controls.model.setErrors({ 'incorrect': true }) : "";
    }
  }

  deleteModelInfo(index) {
    this.modelInfo.splice(index, 1);
  }

  isSaved: boolean = false;

  saveBuyerInfo() {
    for (let i = 0; i < this.form.controls.projectWorkSheetPurchasers["controls"].length; i++) {
      if (this.form.controls.projectWorkSheetPurchasers["controls"][i].invalid) {
        // this.form.controls.projectWorkSheetPurchasers["controls"][0].controls.markAsTouched();
        Object.keys(this.form.controls.projectWorkSheetPurchasers["controls"][i].controls).forEach(field => { // {1}
          const control = this.form.controls.projectWorkSheetPurchasers["controls"][i].get(field);            // {2}
          control.markAsTouched({ onlySelf: true });       // {3}
        });
        this.isSaved = false;
        //this.form.get('surname').markAsTouched();
      } else {
        this.isSaved = true;
      }
    }

    if (this.isSaved) {
      this.isUpdate = false;
      const data = Object.assign({}, this.form.getRawValue());
      this.buyerInfo = data.projectWorkSheetPurchasers;
      this.isNewFieldAdded = false;
      // this.projectWorkSheetPurchasers.at(this.projectWorkSheetPurchasers.length - 1)?.get('saved')?.setValue(true); 
      //this.add_projectWorkSheetPurchasers();
      // this.projectWorkSheetPurchasers.at(this.projectWorkSheetPurchasers.length - 1)?.setErrors(null);
    }
  }

  deleteByuerInfo(index) {
    this.buyerInfo.splice(index, 1);
    this.projectWorkSheetPurchasers.removeAt(index);
    if (this.form.controls.projectWorkSheetPurchasers["controls"].length > 0 && this.form.valid)
      this.isSaved = true;
    else
      this.isSaved = false;

    if (!this.isNewFieldAdded) {
      this.add_projectWorkSheetPurchasers();
      this.isNewFieldAdded = true;
    }
  }

  editByuerInfo(index) {
    this.isUpdate = true;
    if (this.isNewFieldAdded)
      this.projectWorkSheetPurchasers.removeAt(this.projectWorkSheetPurchasers.length - 1);
    this.projectWorkSheetPurchasers.at(index)?.get('saved')?.setValue(false);
  }

  createNewBuyerForm() {
    if (this.projectWorkSheetPurchasers.length >= this.numberOfPurchaser) {
      this.snackbarWrapperService.open("Your add purchaser for workseet is limited");

    } else
      if (!this.isNewFieldAdded) {
        this.isNewFieldAdded = true;
        this.add_projectWorkSheetPurchasers();
        this.projectWorkSheetPurchasers.at(this.projectWorkSheetPurchasers.length - 2)?.get('saved')?.setValue(true);
      }
  }

  onProjectSelected(value) {
    this.projectUnitName = [];

    let projectData = this.projects.find(x => x.value == value);

    if (projectData) {
      projectData?.projectDetail?.projectTower?.forEach(tower => {
        if (tower?.projectTowerUnitTypes?.length) {
          tower.projectTowerUnitTypes = tower.projectTowerUnitTypes.filter(f => f.isSelected);
        }
        tower?.projectBlocks?.sort((a, b) => { return b.blockNo - a.blockNo });
        tower?.projectBlocks?.forEach(block => {
          block?.projectFloorDetails?.forEach(floor => {
            floor?.projectUnitFlats?.forEach(flat => {
              if (flat?.unitName && !this.projectUnitName.some(item => item == flat?.unitName))
                this.projectUnitName.push(flat.unitName);
            })
          })
        })
      })
      if (this.projectUnitName.length == 0) this.snackbarWrapperService.open('Project setup is in progress.');

      this.form.controls.model.setValue(null);
      this.numberOfPurchaser = projectData.worksheetSettings?.numberOfBuyersPerWorksheet;
      this.numberofChoices = projectData.worksheetSettings?.numberofChoicesWorksheet;
    }
  }

}

