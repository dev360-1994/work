import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/common/components/confirm-modal/confirm-modal.component';
import { ProgressModalComponent } from 'src/app/common/components/progress-modal/progress-modal.component';
import { IskipUnits } from 'src/app/models/project.model';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ProjectModel } from '../../models/project-res.model';
import { ProjectsService } from '../../services/projects.service';
import { AddProjectComponent } from '../add-project/add-project.component';
import { BuildGridComponent } from '../build-grid/build-grid.component';
import { UnitPricingDetailComponent } from '../build-grid/unit-pricing-detail/unit-pricing-detail.component';
import { CommissionsComponent } from '../commissions/commissions.component';
import { DepositComponent } from '../deposit/deposit.component';
import { DocumentTemplateComponent } from '../document-template/document-template.component';
import { ExternalBrokersComponent } from '../external-brokers/external-brokers.component';
import { LevelDetailComponent } from '../level-detail/level-detail.component';
import { MarketingAssetsComponent } from '../marketing-assets/marketing-assets.component';
import { SalesTeamComponent } from '../sales-team/sales-team.component';
import { WorksheetBuyerRulesComponent } from '../worksheet-buyer-rules/worksheet-buyer-rules.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class StepperComponent implements OnInit, AfterViewInit, OnDestroy {
  levelDetailForm!: FormGroup;
  depositForm!: FormGroup;
  commissionForm!: FormGroup;
  projectForm!: FormGroup;
  buildGridForm!: FormGroup;
  projectDocumentForm!: FormGroup;
  worksheetBuyersForm!: FormGroup;
  salesTeamForm!: FormGroup;
  marketingAssetsForm!: FormGroup;
  externalBrokerForm!: FormGroup;
  selectedIndex!: number;
  isProcessing = false;
  projectId: string | number | null = '';

  title: string = 'Add a new Project';
  projectDetail: any;
  isFromStep = false;
  isFirstStep = false;
  progressDialogObj!: MatDialogRef<any>;

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(AddProjectComponent, { static: true }) addPojectComponent!: AddProjectComponent;
  @ViewChild(DepositComponent, { static: true }) depositComponent!: DepositComponent;
  @ViewChild(LevelDetailComponent) levelDetailComponent!: LevelDetailComponent;
  @ViewChild(BuildGridComponent, { static: true }) buildGridComponent!: BuildGridComponent;
  @ViewChild(WorksheetBuyerRulesComponent, { static: true }) WorksheetBuyerRulesComponent!: WorksheetBuyerRulesComponent;
  @ViewChild(SalesTeamComponent, { static: true }) SalesTeamComponent!: SalesTeamComponent;
  @ViewChild(DocumentTemplateComponent, { static: true }) documentTemplateComponent!: DocumentTemplateComponent;
  @ViewChild(MarketingAssetsComponent, { static: true }) marketingAssetsComponent!: MarketingAssetsComponent;
  @ViewChild(ExternalBrokersComponent, { static: true }) externalBrokersComponent !: ExternalBrokersComponent;
  @ViewChild(UnitPricingDetailComponent, { static: true }) unitPricingDetailComponent !: UnitPricingDetailComponent;
  @ViewChild(CommissionsComponent, { static: true }) commissionsComponent !: CommissionsComponent;

  constructor(private projectService: ProjectsService,
    private snackbarWrapperService: SnackbarWrapperService, private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.activatedRoute?.snapshot?.queryParams?.tab >= 1) {
      this.selectedIndex = this.activatedRoute?.snapshot?.queryParams?.tab - 1;
    }
  }

  ngUnsubscribe$: Subject<void> = new Subject<void>();
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  getSkipUnits() {
    this.isProcessing = true;
    this.projectService.getSkipMaster().pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res) => {
      this.isProcessing = false;
      if (res.isSuccess) {
        if (res?.data) {
          this.buildGridComponent.skipOptions = []
          res?.data?.forEach(element => {
            let data: IskipUnits = {
              id: 0,
              projectId: 0,
              checked: false,
              skipId: element.skipId,
              skiptext: element.skiptext,
              f: element.startFrom ? 'startsWith' : 'endsWith',
              startFrom: element.startFrom
              , endFrom: element.endFrom
              , number: element.number,
              has: element.has,
              type: element.startFrom ? 'floor' : 'stack'
            }
            this.buildGridComponent.skipOptions.push(data);
          });
          //          console.log("data res for project details=>", res);
        }
      }
    }, error => {
      console.log(error);
    }, () => this.isProcessing = false);
  }

  backButton(stepper: MatStepper) {
    stepper.previous();
  }

  convertCamelCaseTextToTitleCaseText(text: string): string {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult
  }

  checkValidation = (f: FormGroup): string => {
    const invalid: Array<string> = [];
    const controls = f.controls;
    if (f['length']) {
      const errs: Array<string> = [];
      for (const i in f.controls) {
        const err = this.checkValidation(f.controls[i] as FormGroup);
        const indexForUI = parseInt(i) + 1;
        errs.push(`${indexForUI} - ${err}`);
      }
      invalid.push(`${errs.join(', ')}`);
    } else {
      for (const name in controls) {
        if (controls[name].invalid) {
          if (controls[name]['controls']) {
            if (controls[name]['length']) {
              const errs: Array<string> = [];
              for (const i in controls[name]['controls']) {
                const err = this.checkValidation(controls[name]['controls'][i] as FormGroup);
                const indexForUI = parseInt(i) + 1;
                errs.push(`${indexForUI} - ${err}`);
              }
              invalid.push(`${this.convertCamelCaseTextToTitleCaseText(name)} - ${errs.join(', ')}`);
            } else {
              const err = this.checkValidation(controls[name] as FormGroup);
              invalid.push(`${this.convertCamelCaseTextToTitleCaseText(name)} - ${err}`);
            }
          } else {
            invalid.push(this.convertCamelCaseTextToTitleCaseText(name));
          }
        }
      }
    }

    return invalid.join(', ');
  }

  ngAfterViewInit() {
    this.projectForm = this.addPojectComponent.form;
    // this.depositForm = this.depositComponent.form;
    this.buildGridForm = this.buildGridComponent.form;
    this.worksheetBuyersForm = this.WorksheetBuyerRulesComponent.projectWorkSheetAndBuyer;
    this.salesTeamForm = this.SalesTeamComponent.form;
    this.externalBrokerForm = this.externalBrokersComponent.form;
    this.projectDocumentForm = this.documentTemplateComponent.form;
    this.marketingAssetsForm = this.marketingAssetsComponent.form;
    // this.commissionForm = this.commissionsComponent?.form;

    this.getSkipUnits();

    this.projectId = this.activatedRoute.snapshot.paramMap.get('projectId')
    if (this.projectId) {
      this.title = ``;
      this.getProjectDetailsByProjectId(this.projectId);
    }
  }

  confirmDialog() {
    if (!this.projectForm.valid) {
      let value = this.checkValidation(this.projectForm);
      this.snackbarWrapperService.open(`${value} Fields are invalid in add Project Form`);
      return
    } else {

      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        width: '90vw',
        maxWidth: '35vw',
        disableClose: true,
        data: { heading: "Save Project", content: "Do you want to save the project?" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.save();
        }
      });
    }
  }

  progressDialog() {
    this.progressDialogObj = this.dialog.open(ProgressModalComponent, {
      width: '90vw',
      maxWidth: '24vw',
      //disableClose: true,
      data: { heading: "", content: "Project is being saved" }
    });
    this.progressDialogObj.afterClosed().subscribe(result => {
      if (result === true) {
        //this.save();
      }
    });
  }
  getEditedTabNo(){
    debugger;
    let arr:Array<{id:number}>=[];
    if(this.projectForm?.touched)
    {
      arr.push({id:1});
    }
    if(this.buildGridForm?.touched)
    {
      arr.push({id:2});
    }
    if(this.depositForm?.touched)
    {
      arr.push({id:3});
    }
    if(this.commissionForm?.touched)
    {
      arr.push({id:4});
    }
    if(this.worksheetBuyersForm?.touched)
    {
      arr.push({id:5});
    }
    if(this.salesTeamForm?.touched)
    {
      arr.push({id:6});
    }
    if(this.externalBrokerForm?.touched)
    {
      arr.push({id:7});
    }
    if(this.projectDocumentForm?.touched)
    {
      arr.push({id:8});
    }
    if(this.marketingAssetsForm?.touched)
    {
      arr.push({id:9});
    }
    return arr;
  }
  save() {

    // this.projectForm.get('completionDate')?.patchValue(this.projectForm.get('completionDate')?.value ? new DatePipe('en-US').transform(this.projectForm.get('completionDate')?.value, 'yyyy-MM-dd') : '');
    // this.projectForm.get('startDate')?.patchValue(this.projectForm.get('startDate')?.value ? new DatePipe('en-US').transform(this.projectForm.get('startDate')?.value, 'yyyy-MM-dd') : '');
   let tabValues = this.getEditedTabNo().map(x=>x.id).join(",");
    let projectForm = Object.assign({}, this.projectForm?.value);
    let phoneDetail = projectForm?.projectSalesOfficeDetails?.phoneNumber;
    if (this.projectId && phoneDetail) {
      projectForm.projectSalesOfficeDetails.phoneNumber["projectSalePhoneId"] = this.projectDetail?.projectSalesOfficeDetails?.phoneNumber?.projectSalePhoneId || 0;
    }

    this.isProcessing = true;
    let generalSetting = {
      ProjectGeneralSettingId: this.buildGridForm.get('projectGeneralSettingId')?.value,
      NumberofTowers: this.buildGridForm.get('numberofTowers')?.value,
      NumberofFloors: 0,
      NumberofUniqueBlocks: 0,
      TotalUnits: 0,
      SameCeilingHeight: false,
      CeilingHeight: '',
      SkipFloor: 0,
      SkipUnit: 0,
      ProjectId: 0,
      projectSkipType: this.buildGridComponent.skipOptions.filter(x => x.checked)
    }

    let depositFormVal = Object.assign({}, this.depositForm?.value);
    if (depositFormVal?.depositStructure?.length) {
      depositFormVal?.depositStructure?.forEach(val => {
        if (val?.depositType) {
          val.depositType = parseInt(val.depositType)
        }
        if (val?.amoutType) {
          val.amoutType = parseInt(val.amoutType)
        }
        if (val && val.hasOwnProperty('saved')) {
          delete val.saved
        }
        if (val && val.hasOwnProperty('new')) {
          delete val.new
        }
        val?.projectDepositStructureDetails?.forEach((item) => {
          if (item?.typeOfDeposit) {
            item.typeOfDeposit = parseInt(item.typeOfDeposit)
          }
        })
      })
    }

    let commissionForm = Object.assign({}, this.commissionsComponent.form?.value);
    if (commissionForm?.projectCommisions?.projectCommisionStructure?.length) {
      commissionForm?.projectCommisions?.projectCommisionStructure?.forEach(val => {
        if (val?.commisionType) {
          //val.depositType = parseInt(val.commisionType);
          val.commisionType = parseInt(val.commisionType);
        }
        if (val && val.hasOwnProperty('saved')) {
          delete val.saved
        }
        if (val && val.hasOwnProperty('new')) {
          delete val.new
        }
        val?.projectCommisionStructureDetails?.forEach((item) => {
          if (item?.typeOfDeposit) {
            item.typeOfDeposit = parseInt(item.typeOfDeposit ?? 0)
            item.installmentType = parseInt(item.installmentType ?? 0)
          }
        })
      })
    }
    if (commissionForm?.projectCommisions?.projectCommisionBonus?.length) {
      commissionForm?.projectCommisions?.projectCommisionBonus?.forEach(val => {
        val.installmentType = parseInt(val.installmentType);
        val.bonusValue = parseInt(val.bonusValue ?? 0);
        val.bonusType = val.bonusType;
        if (val && val.hasOwnProperty('saved')) {
          delete val.saved
        }
        if (val && val.hasOwnProperty('new')) {
          delete val.new
        }
      })
    }
     
    const payLoad = {
      editedTabNo:tabValues!=''?tabValues:"0",
      ...projectForm,
      ProjectId: this.projectId ? this.projectId : 0,
      projectTower: this.buildGridForm.get("projectTower")?.value,
      //projectTower: this.setDataForDemo(),
      projectTax: this.buildGridForm.get("projectTax")?.value.filter(x => x.checked),
      generalSetting: generalSetting,
      projectGridColors: this.buildGridForm.get("projectGridColors")?.value,
      ...(depositFormVal || {}),
      projectInternalSalesTeam: this.salesTeamForm.value,
      ...(commissionForm || {}),
      ProjectExternalSalesTeam: this.externalBrokerForm.get("projectExternalSalesTeams")?.value,
      projectWorkSheetAndBuyer: { ...this.worksheetBuyersForm.value },
      projectMarketingAssets: (this.marketingAssetsForm.get('projectMarketingAssets') as FormArray).value
      , ...this.projectDocumentForm.value,
    }
    console.log("payLoad", payLoad);
    this.seedFormData(payLoad).then(x => {
      console.log("infoReurn");
      this.progressDialog();
      this.projectService.add(x, this.projectId ? true : false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res) => {
        this.isProcessing = false;
        this.progressDialogObj?.close();
        if (res.isSuccess) {
          // if (this.isFromStep) {
          //   this.stepper.next();
          //   if (this.isFirstStep && this.projectId == null)
          //     this.projectId = res?.project?.projectId;
          //   this.isFromStep = false;
          //   this.getProjectDetailsByProjectId(this.projectId);
          // }
          // else {
          localStorage.removeItem("buildGrid");
          this.router.navigateByUrl('/griddo-master/projects');
          // }
        }
        else {
          this.snackbarWrapperService.open(res?.message || 'something went wrong ! Please try again');
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
    });
  }

  outPut(event: FormGroup, options: number = 0) {
    switch (options) {
      case 1:
        this.projectForm = event;
        break;
      case 2:
        this.buildGridForm = event;
        break;
      case 3:
        this.depositForm = event;
        break;
      case 4:
        this.worksheetBuyersForm = event;
        break;
      case 5:
        this.salesTeamForm = event;
        break;
      case 6:
        this.externalBrokerForm = event;
        break;
      case 7:
        this.projectDocumentForm = event;
        break;
      case 8:
        this.marketingAssetsForm = event;
        break;
      case 9:
        this.commissionForm = event;
        break;
    }
  }

  stepSelectionChange(event) {
    if (event?.selectedIndex == 5) {
      if (this.projectForm?.value?.builderid)
        this.SalesTeamComponent.getAgentsForDropDown(parseInt(this.projectForm?.value?.builderid));
    }
  }

  nextStep(selectedIndex?: number): any {
    let form!: FormGroup;
    let formName!: string;
    this.isFromStep = true;
    this.isFirstStep = false;
    //this.addPojectComponent.form?.get('selectedTab')?.setValue(selectedIndex);
    switch (this.stepper.selectedIndex) {
      case 0:
        this.projectForm?.markAsDirty();
        form = this.projectForm;
        formName = 'Project Details';
        this.isFirstStep = true;
        if (this.projectForm?.value?.builderid)
          this.SalesTeamComponent.getAgentsForDropDown(parseInt(this.projectForm?.value?.builderid));
        //this.save();
        break;
      case 1:
        this.buildGridForm?.markAsDirty();
        console.log(this.buildGridForm);
        form = this.buildGridForm;
        formName = 'Build Grid';
        //this.save();
        break;
      case 2:
        this.depositForm?.markAsPristine();
        form = this.depositForm;
        // this.depositComponent.buildGridVal = this.buildGridComponent?.form?.value;
        formName = 'Deposits';
        // this.save();
        break;
      case 3:
        this.commissionForm?.markAsPristine();
        form = this.commissionForm;
        this.commissionsComponent.buildGridVal = this.buildGridComponent?.form?.value;
        formName = 'Commissions';
        break;
      case 4:
        this.worksheetBuyersForm?.markAsPristine();
        form = this.worksheetBuyersForm;
        formName = 'Worksheet And Buyer Rules';
        break;
      case 5:
        this.salesTeamForm?.markAsPristine();
        form = this.salesTeamForm;
        formName = 'Internal Sales Team';
        break;
      case 6:
        this.externalBrokerForm?.markAsPristine();
        form = this.externalBrokerForm;
        formName = 'External Brokers';
        break;
      case 7:
        this.projectDocumentForm?.markAsPristine();
        form = this.projectDocumentForm;
        formName = 'Document Template';
        break;
      case 8:
        this.marketingAssetsForm?.markAsPristine();
        form = this.marketingAssetsForm;
        formName = 'Marketing Assets';
        //  this.save();
        break;
    };

    if (form?.value?.projectDocument?.length && formName == 'Document Template') {
      const doc = (form?.value?.projectDocument as Array<any>).find(d => d.documentFile || d.documentFilePath);
      if (!doc) {
        return this.snackbarWrapperService.open(`Please upload at-least one Document Template`);
      }
    }

    // value.projectDocument[0].documentFile
    // value.projectDocument[0].documentFilePath

    if (form?.value?.projectCommisions?.projectCommisionStructure?.length && formName == 'Commissions') {
      const key = ['paymentOnPurchase', 'paymentOnPurchasePricenetofTax', 'paymentOnParking', 'paymentOnLocker', 'paymentOnTaxHST', 'extras']
        .find(k => form?.value?.projectCommisions[k]);
      if (!key) {
        return this.snackbarWrapperService.open(`Please select at-least one Commission payable`);
      }
    }

    if (form?.invalid && formName == 'Project Details') {
      let value = this.checkValidation(this.projectForm);

      return this.snackbarWrapperService.open(`Please check mandatory fields ${value} in ${formName}`);
    }

    if (form?.value && formName == 'Project Details') {
      // if ((!form.value?.LogoFile && !this.projectId) || (this.projectId && !form.value?.LogoFile && !form.value?.logo)) {
      //   return this.snackbarWrapperService.open(`Please select the logo Image`);
      // }
      // if ((!form.value?.HeroImageFile && !this.projectId) || (this.projectId && !form.value?.HeroImageFile && !form.value?.heroImage)) {
      //   return this.snackbarWrapperService.open(`Please select the Hero Image`);
      // }
    }
    if (this.buildGridForm?.invalid && formName == 'Build Grid') {
      let value = this.checkValidation(this.buildGridForm);
      return this.snackbarWrapperService.open(`Please check mandatory fields ${value}  in ${formName}`);
    }

    this.stepper.next();
    // this.save();
  }


  component!: { section: 'unit-pricing' | 'unit-numbers', blockIndex: number, towerIndex: number };
  stepChange(event: { section: 'unit-pricing' | 'unit-numbers', blockIndex: number, towerIndex: number }) {
    this.component = event;
  }

  saveUnitPricing(event) {
    // if (event)
    //  this.save();
  }
  getProjectDetailsByProjectId(projectId, isRefresh = false) {
    this.isProcessing = true;
    this.projectService.getProjectDetailBYProjectIdStepper(parseInt(projectId), isRefresh).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res: any) => {
      this.isProcessing = false;
      if (res.isSuccess) {
        console.log("data res for project details=>", res);
        if (res?.data) {
          this.projectDetail = res?.data;
          // add project Binding start here 
          this.title = `${res?.data?.projectName}`;
          this.fillUpData(res).then(res => {
            //console.log(res);
          });
        }
      }
    }, err => {
      this.isProcessing = false;
      this.snackbarWrapperService.open(JSON.stringify(err));
    });
  }
  fromJsonDate(jDate): string {
    const bDate: Date = new Date(jDate);
    return bDate.toISOString().substring(0, 10);  //Ignore time
  }
  fillUpData(res) {
    return new Promise((resolve, reject) => {
      this.addPojectComponent.isEdit = true;
      this.projectForm?.patchValue({
        projectId: res?.data?.projectId || 0,
        isActive: true,
        projectName: res?.data?.projectName || '',
        projectLogoPath: res?.data?.projectLogoPath ?? '',
        projectModel: res?.data?.projectModel || '1',
        projectType: res?.data?.projectType,
        address: res?.data?.address,
        city: res?.data?.city,
        province: res?.data?.province || '',
        country: res?.data?.country,
        zipCode: res?.data?.zipCode,
        email: res?.data?.email,
        phoneNumber: res?.data?.phoneNumber,
        workingHour: res?.data?.workingHour,
        logo: res?.data?.logo,
        heroImage: res?.data?.heroImage || '',
        buildingHeight: res?.data?.buildingHeight,
        buildingHeightUnit: 'mt',
        buildingDescription: res?.data?.buildingDescription,
        websiteUrl: res?.data?.websiteUrl,
        miniSiteURL: res?.data?.miniSiteURL,
        projectStatus: res?.data?.projectStatus || '1',
        LogoFile: '',
        HeroImageFile: '',
        FloorPlanImage: '',
        FloorPlanPDF: '',
        currentIncentive: res?.data?.currentIncentive ?? ''
      },{emitEvent:false})
      this.projectForm?.get('projectSalesOfficeDetails')?.patchValue(res?.data?.projectSalesOfficeDetails,{emitEvent:false})
      this.projectForm?.get('builderid')?.patchValue(res?.data?.builderid.toString(),{emitEvent:false});
      this.projectForm?.get('createdBy')?.patchValue(res?.data?.createdBy.toString(),{emitEvent:false});
      this.projectForm?.get('createdDate')?.patchValue(res?.data?.createdDate.toString(),{emitEvent:false});

      this.addPojectComponent.checkProjectStatus({ target: { value: this.projectForm?.get('projectStatus')?.value } });

      this.projectForm?.get('startDate')?.patchValue(res?.data?.startDate,{emitEvent:false});
      this.addPojectComponent.form?.get('startDate')?.patchValue(res?.data?.startDate,{emitEvent:false});
      this.addPojectComponent.projectBase64Img = res?.data?.logo;
      this.addPojectComponent.projectHeroBase64Img = res?.data?.heroImage
      this.projectForm?.get('completionDate')?.patchValue(res?.data?.completionDate,{emitEvent:false});
      this.addPojectComponent.form?.get('completionDate')?.patchValue(res?.data?.completionDate,{emitEvent:false});
      this.addPojectComponent.form?.get('projectSalesOfficeDetails')?.patchValue(res?.data?.projectSalesOfficeDetails,{emitEvent:false});


      if (res?.data?.projectSalesOfficeDetails?.workingHours?.length)
        this.addPojectComponent.workingHours?.clear();
      res?.data?.projectSalesOfficeDetails?.workingHours?.forEach(element => {
        this.addPojectComponent.workingHours?.push(this.addPojectComponent?.newWorkingHours(element.id, element.day, element.startTime, element.endTime, element.timeZone, element.projectSalesOfficeDetailId, element.order),{emitEvent:false});
      });
      this.addPojectComponent.reCheckContorlsSelectionDays();
      if (res?.data?.architects?.length)
        this.addPojectComponent.architects?.clear();
      res?.data?.architects?.forEach(element => {
        this.addPojectComponent.architects?.push(this.addPojectComponent?.newArchitec(element.architectId, element.projectId, element?.email ?? ''),{emitEvent:false});
      });
      if (res?.data?.landscaping?.length)
        this.addPojectComponent.landscaping?.clear();
      res?.data?.landscaping.forEach(element => {
        this.addPojectComponent.landscaping?.push(this.addPojectComponent?.newLandscaping(element.landscapingId, element.projectId, element?.email ?? ''),{emitEvent:false});
      });
      if (res?.data?.interiorDesigners?.length)
        this.addPojectComponent?.interiorDesigners?.clear();
      res?.data?.interiorDesigners?.forEach(element => {
        this.addPojectComponent?.interiorDesigners?.push(this.addPojectComponent?.newInteriorDesigner(element.interiorDesignerId, element?.email ?? '', element.projectId), { emitEvent: false });
      });
      if (res?.data?.marketingCompany?.length)
        this.addPojectComponent?.marketingCompany?.clear();
      res?.data?.marketingCompany?.forEach(element => {
        this.addPojectComponent?.marketingCompany?.push(this.addPojectComponent?.newMarketingCompany(element.marketingCompanyId, element.email ?? '', element.projectId,), { emitEvent: false });
      });
      if (res?.data?.addAgency?.length)
        (this.addPojectComponent?.form.get('addAgency') as FormArray)?.clear();
      res?.data?.addAgency?.forEach(element => {
        if (element.email)
          (this.addPojectComponent.form.get('addAgency') as FormArray)?.push(this.addPojectComponent?.newAddAgency(element.addAgencyId, element?.email ?? '', element.projectId), { emitEvent: false });
      });
      if (res?.data?.amenities?.length)
        this.addPojectComponent?.amenities?.clear();
      res?.data?.amenities?.forEach(element => {
        this.addPojectComponent?.amenities?.push(this.addPojectComponent?.newAmenity(element.amenitiesId, element?.amenityValue ?? 0, element.projectId), { emitEvent: false });
      });
      if (res?.data?.featuresAndFinishes?.length)
        this.addPojectComponent?.featuresAndFinishes?.clear();
      res?.data?.featuresAndFinishes?.forEach(element => {
        this.addPojectComponent?.featuresAndFinishes?.push(this.addPojectComponent?.newFeaturesAndFinish(element?.featuresAndFinishesId, element?.items ?? '', element?.projectId), { emitEvent: false });
      });
      // this.projectForm?.markAllAsTouched();
      // first tab binding finish
      // second tab binding start here 

      this.buildGridComponent?.form?.patchValue(res?.data?.generalSetting)
      if (res?.data?.generalSetting?.projectSkipType?.length)
        this.buildGridComponent?.getProjectSkipTypes?.clear()
      res?.data?.generalSetting?.projectSkipType?.forEach(skipType => {
        let index = this.buildGridComponent?.skipOptions?.findIndex(x => x.skipId == skipType.skipId)
        if (index >= 0) {
          this.buildGridComponent.skipOptions[index].id = skipType.id;
          this.buildGridComponent.skipOptions[index].checked = true;
          this.buildGridComponent.skipOptions[index].projectId = skipType.projectId ?? 0;

        }
      });
      if (res?.data?.projectGridColors?.length)
        this.buildGridComponent?.getProjectGridColors?.clear();
      res?.data?.projectGridColors?.forEach(element => {
        this.buildGridComponent?.getProjectGridColors?.push(this.buildGridComponent?.newProjectGridColors(element.id ?? 0, element.colorId ?? 0, element.colorTitle ?? '', element.colorCode ?? 0, element.projectId ?? 0), { emitEvent: false });
      });
      res?.data?.projectTax?.forEach((tax, taxIdx) => {
        if (this.buildGridComponent.getProjectTax == null || this.buildGridComponent.getProjectTax == undefined) {
          this.buildGridComponent.newProjectTax(0, false, 'GST', '', false, 0)
          this.buildGridComponent.newProjectTax(0, false, 'QST', '', false, 0)
          this.buildGridComponent.newProjectTax(0, false, 'PST', '', false, 0)
          this.buildGridComponent.newProjectTax(0, false, 'HST', '', false, 0)

        }
        if ((this.buildGridComponent.getProjectTax?.value.findIndex(x => x.taxType == tax.taxType)) > -1) {
          var index = this.buildGridComponent.getProjectTax?.value.findIndex(x => x.taxType == tax.taxType);
          this.buildGridComponent.getProjectTax?.at(index).get('id')?.patchValue(tax.id);
          this.buildGridComponent.getProjectTax?.at(index).get('checked')?.patchValue(true);
          this.buildGridComponent.getProjectTax?.at(index).get('value')?.patchValue(tax.value);
          this.buildGridComponent.getProjectTax?.at(index).get('value')?.enable();
          this.buildGridComponent.getProjectTax?.at(index).get('isCustomTax')?.patchValue(tax.isCustomTax);
        } else {
          this.buildGridComponent.getProjectTax?.push(this.buildGridComponent?.newProjectTax(
            tax.id, true, tax.taxType, tax.value, tax.isCustomTax
          ))
        }
      });
      if (res?.data?.projectTower?.length)
        this.buildGridComponent.towerList?.clear();
      res?.data?.projectTower?.forEach((element, towerindex) => {
        this.buildGridComponent?.towerList?.push(this.buildGridComponent?.newTowerList(element.towerId ?? 0, element?.numberofFloors ?? 0, element.totalUnits ?? 0, element.ceilingHeight ?? 0, element.numberofUniqueBlocks ?? 0, element.numberOfUnits ?? 0, element.sameCeilingHeight ?? 0, element.towerName ?? 0, element.projectId ?? 0, element.skipFloor ?? 0, element.skipUnit ?? 0, element.towerNo == 0 || element.towerNo == null ? (towerindex + 1) : element.towerNo), { emitEvent: false });

        element?.projectTowerUnitTypes?.forEach((unitType, unitTypeIdx) => {
          //this.buildGridComponent.projectTowerUnitTypesDetails(towerindex)?.push(this.buildGridComponent.newProjectTowerUnitTypes(unitType.id, unitType.unitType, true, unitType.towerId), { emitEvent: false })
          let unitTypeIndex = this.buildGridComponent.projectTowerUnitTypesDetails(towerindex)?.value.findIndex(x => x.unitType == unitType.unitType);
          if (unitTypeIndex > -1) {
            this.buildGridComponent.projectTowerUnitTypesDetails(towerindex)?.at(unitTypeIndex).get('unitTypeId')?.patchValue(unitType.unitTypeId ?? 0);
            this.buildGridComponent.projectTowerUnitTypesDetails(towerindex)?.at(unitTypeIndex).get('isSelected')?.patchValue(unitType.isSelected);
            this.buildGridComponent.projectTowerUnitTypesDetails(towerindex)?.at(unitTypeIndex).get('towerId')?.patchValue(unitType.towerId ?? 0);
          } else {
            this.buildGridComponent.projectTowerUnitTypesDetails(towerindex)?.push(this.buildGridComponent.newProjectTowerUnitTypes(unitType.unitTypeId, unitType.unitType, true, unitType.towerId), { emitEvent: false })
          }
          this.buildGridComponent.unitTypeArray = this.buildGridComponent.projectTowerUnitTypesDetails(towerindex).value;
        });

        if (element?.projectTowerParkings?.length)

          this.buildGridComponent.projectTowerParkingsDetails(towerindex)?.clear();
        element?.projectTowerParkings?.forEach((park, pi) => {

          this.buildGridComponent.projectTowerParkingsDetails(towerindex)?.push(this.buildGridComponent.newProjectTowerParkings(park.name ?? '', park.towerParkingId ?? 0, park.numberOfParkingSlots ?? 0, park.availableto ?? 0, park.unitSizeinSqft ?? 0, park.included ?? false, park.eligible ?? false, park.towerId ?? false, park.Price ?? 0, park.amount ?? 0, park.unitTypeOptions ?? ''), { emitEvent: false });
          let array = park.unitTypeOptions?.split(",");
          if (array?.length > 0)
            this.buildGridComponent.projectTowerParkingsDetails(towerindex).at(pi)?.get('unitTypeValues')?.patchValue(array);

        });
        if (element?.projectTowerLockers?.length)
          this.buildGridComponent.projectTowerLockersDetails(towerindex)?.clear();
        element?.projectTowerLockers?.forEach((park, pi) => {

          this.buildGridComponent.projectTowerLockersDetails(towerindex)?.push(this.buildGridComponent.newProjectTowerLockers(park.name, park.towerLockerId ?? 0, park.numberOfLockerSlots ?? 0, park.availableto ?? 0, park.unitSizeinSqft ?? 0, park.included ?? false, park.eligible ?? false, park.towerId ?? 0, park.Price ?? 0, park.amount ?? 0, park.unitTypeOptions ?? ''), { emitEvent: false });
          let array = park.unitTypeOptions?.split(",");
          if (array?.length > 0)
            this.buildGridComponent.projectTowerLockersDetails(towerindex).at(pi)?.get('unitTypeValues')?.patchValue(array);

        });
        if (element?.projectBlocks.length)
          this.buildGridComponent?.blockDetails(towerindex).clear();

        if (element?.projectBlocks.every(x => x.blockNo == null || x.blockNo == 0)) {
          element?.projectBlocks.forEach((x, bi) => {
            x.blockNo = bi + 1
          });
        }
        element?.projectBlocks.sort((a, b) => parseInt(b.blockNo) - parseInt(a.blockNo));

        element?.projectBlocks?.forEach((block, blockIndex) => {
          this.buildGridComponent?.blockDetails(towerindex)?.push(this.buildGridComponent?.newBlockDetails(block.blockId ?? 0, block.projectId ?? 0, block.isCustomBlock ?? false, block.towerNo ?? 0, block.stackName ?? '', block.blockName ?? '', block.numberUnitsPerFloor ?? 0, block.startingFloor ?? 0, block.toFloor ?? 0, block.ceilingHeight ?? 0, true, block.projectTowerTowerId ?? 0, block.towerId ?? 0, block.floorPremium ?? 0, block.blockNo), { emitEvent: false })
          if (block?.projectFloorDetails?.length)
            this.buildGridComponent?.projectFloorDetails(towerindex, blockIndex)?.clear();
          block?.projectFloorDetails.sort((a, b) => parseInt(b.floorNo) - parseInt(a.floorNo));
          block?.projectFloorDetails?.forEach((floor, floorIndex) => {
            this.buildGridComponent?.projectFloorDetails(towerindex, blockIndex)?.push(this.buildGridComponent.newProjectFloors(floor?.floorNo ?? 0, floor, floor.floorId,
              floor?.isFloorSelected ?? false, true)
              , { emitEvent: false });
            if (floor?.projectUnitFlats?.length)
              this.buildGridComponent?.projectUnitFlatsDetail(towerindex, blockIndex, floorIndex)?.clear();
            //floor?.projectUnitFlats.sort((a, b) => parseInt(b.flatNo) - parseInt(a.flatNo));
            floor?.projectUnitFlats?.forEach((flat, flatIndex) => {

              this.buildGridComponent?.projectUnitFlatsDetail(towerindex, blockIndex, floorIndex)?.push(this.buildGridComponent?.newProjectUnitFlats(flat.flatNo ?? 0, flat.flatStatus ?? 'available', flat.flatId ?? 0, flat.isSkip ?? 0, flat?.isSingleStackSelected ?? false, flat.isMultipleStackSelected ?? false, flat.unitNo ?? 0, flat.flatId ?? 0, flat.price ?? 0, flat.interiorSize ?? 0, flat.ceilingHeight ?? 0, flat.unitName ?? '', flat.balconySize ?? 0, flat.floorPremium ?? 0, flat.view ?? 0, flat.livingRoomSize ?? 0, flat.diningRoomSize ?? 0, flat.noOfBedroom ?? 0, flat.nOofBaths ?? 0, flat.terrance ?? 0, flat.noofBalcony ?? 0, flat.noofDen ?? 0, false, flat.unitTypeId ?? 0, flat.unitType || '', flat.assignAgentId ?? 0, flat.inActiveStatus ?? false, flat.projectFloorDetailsFloorId ?? 0))

              if (flat?.flatBedRooms?.length)
                this.buildGridComponent?.bedRoomsDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.clear()
              flat?.flatBedRooms?.forEach(bedroom => {
                this.buildGridComponent?.bedRoomsDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.push(this.buildGridComponent.newBedRoomsForFlat(bedroom.bedRoomsId ?? 0, bedroom.flatId ?? 0, bedroom.number ?? 0, bedroom.size ?? 0))
              }, { emitEvent: false });
              if (flat?.flatbathroomSizes?.length)
                this.buildGridComponent?.bathRoomsDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.clear();
              flat?.flatbathroomSizes?.forEach(bath => {
                this.buildGridComponent?.bathRoomsDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.push(this.buildGridComponent.newBathRoomSizesForFlat(bath.bathRoomsId ?? 0, bath.flatId ?? 0, bath.number ?? 0, bath.size ?? 0))
              }, { emitEvent: false });
              if (flat?.flatterraceSizes?.length)
                this.buildGridComponent?.terranceDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.clear();
              flat?.flatterraceSizes?.forEach(val => {
                this.buildGridComponent?.terranceDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.push(this.buildGridComponent.newTerraceSizesForFlat(val.terraceId ?? 0, val.flatId ?? 0, val.number ?? 0, val.size ?? 0))
              }, { emitEvent: false });
              if (flat?.flatbalconysizes?.length)
                this.buildGridComponent?.balconyDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.clear();
              flat?.flatbalconysizes?.forEach(val => {
                this.buildGridComponent?.balconyDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.push(this.buildGridComponent.newBalconySizesForFlat(val.balconyId ?? 0, val.flatId ?? 0, val.number ?? 0, val.size ?? 0))
              }, { emitEvent: false });
              if (flat?.flatdenSizes?.length)
                this.buildGridComponent?.denDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.clear();
              flat?.flatdenSizes?.forEach(val => {
                this.buildGridComponent?.denDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.push(this.buildGridComponent.newDenSizesForFlat(val.denSizeId ?? 0, val.flatId ?? 0, val.number ?? 0, val.size ?? 0))
              }, { emitEvent: false });
              if (flat?.flatProjectUnitAdditionalFeatures?.length)
                this.buildGridComponent?.projectUnitAdditionalFeaturesDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.clear();
              flat?.flatProjectUnitAdditionalFeatures?.forEach(val => {
                this.buildGridComponent?.projectUnitAdditionalFeaturesDetailForFlat(towerindex, blockIndex, floorIndex, flatIndex)?.push(this.buildGridComponent.newProjectUnitAdditionalFeaturesForFlat(val.name ?? '', val.additionalFeatureId ?? 0, val.flatId ?? 0, val.isIncluded ?? false, val.isEligible ?? false))
              }, { emitEvent: false });
            });
          });
        });

        this.buildGridComponent.isEditMode = true;
        this.buildGridComponent.isUnitValueEntered = element?.projectBlocks.length > 0 ? true : false;//true;
      });
      if (res?.data?.depositStructure.length)
        this.depositComponent.depositStructureItem?.clear();
      res?.data?.depositStructure?.forEach((depositStructure, depositStructureIndex) => {
        this.depositComponent.depositStructureItem?.push(this.depositComponent.newDepositStructure(depositStructure.projectDepositStructureId, depositStructure.depositName, depositStructure.depositType, depositStructure.totalDepositRequiredType, depositStructure.description, depositStructure.projectId, depositStructure.totalDepositRequired, true, false))
        if (depositStructure?.projectDepositStructureDetails?.length)
          this.depositComponent.depostDetails(depositStructureIndex)?.clear();
        depositStructure.projectDepositStructureDetails?.sort((a, b) => (a?.order || 0) - (b?.order || 0))?.forEach(depositDetail => {
          this.depositComponent.depostDetails(depositStructureIndex)?.push(this.depositComponent.newDepositDetails(depositDetail))
        });
        // const dollorValues = depositStructure.projectDepositStructureDetails.filter(pdsd => pdsd.typeOfDeposit == 2);
        // const balanceToValues = depositStructure.projectDepositStructureDetails.filter(pdsd => pdsd.typeOfDeposit == 3);
        // const percentageValues = depositStructure.projectDepositStructureDetails.filter(pdsd => pdsd.typeOfDeposit == 1);
        // dollorValues?.forEach(depositDetail => {
        //   this.depositComponent.depostDetails(depositStructureIndex)?.push(this.depositComponent.newDepositDetails(depositDetail))
        // });
        // balanceToValues?.forEach(depositDetail => {
        //   this.depositComponent.depostDetails(depositStructureIndex)?.push(this.depositComponent.newDepositDetails(depositDetail))
        // });
        // percentageValues?.forEach(depositDetail => {
        //   this.depositComponent.depostDetails(depositStructureIndex)?.push(this.depositComponent.newDepositDetails(depositDetail))
        // });
        this.depositComponent.checkTotalUnitPrice(depositStructureIndex);
      });
      this.WorksheetBuyerRulesComponent.projectWorkSheetAndBuyer.patchValue(res?.data?.projectWorkSheetAndBuyer)
      if (res?.data?.projectExternalSalesTeam?.length)
        this.externalBrokersComponent.projectExternalSalesTeams?.clear();
      res?.data?.projectExternalSalesTeam?.forEach((extenalSalesTeam, exteranlTeamIdx) => {
        this.externalBrokersComponent?.projectExternalSalesTeams?.push(this.externalBrokersComponent.newProjectExternalSalesTeams(extenalSalesTeam.projectExternalSalesTeamId, extenalSalesTeam.projectId, extenalSalesTeam.isProjectAccess || false, extenalSalesTeam.brokerGroupName || '', extenalSalesTeam?.brokerCommissionType || '%', extenalSalesTeam?.brokerCommission))
        if (extenalSalesTeam?.projectExternalTeamBroker?.length)
          this.externalBrokersComponent.projectExternalTeamBroker(exteranlTeamIdx)?.clear();
        extenalSalesTeam?.projectExternalTeamBroker?.forEach(extenalSalesTeamBroker => {
          this.externalBrokersComponent.projectExternalTeamBroker(exteranlTeamIdx)?.push(this.externalBrokersComponent.newProjectExternalTeamBroker(extenalSalesTeamBroker.externalTeamBrokerId, extenalSalesTeamBroker.projectExternalSalesTeamId, extenalSalesTeamBroker.fullName, extenalSalesTeamBroker.agentId));
        });

      });
      this.SalesTeamComponent.form.patchValue(res?.data?.projectInternalSalesTeam)
      if (res?.data?.projectInternalSalesTeam?.projectSalesAgencies && res?.data?.projectInternalSalesTeam?.projectSalesAgencies.length)
        this.SalesTeamComponent.projectSalesAgencies?.clear()
      res?.data?.projectInternalSalesTeam?.projectSalesAgencies?.forEach(agency => {
        this.SalesTeamComponent.projectSalesAgencies?.push(this.SalesTeamComponent.newProjectSalesAgencies(agency.agencyName, agency.agencyId, agency.projectSalesAgencyId, agency.projectInternalSalesTeamId, agency.brokerageCommissionType, agency.brokerageCommission))
      });
      if (res?.data?.projectInternalSalesTeam?.projectBuilderStaff && res?.data?.projectInternalSalesTeam?.projectBuilderStaff?.length)
        this.SalesTeamComponent.projectBuilderStaff?.clear()
      res?.data?.projectInternalSalesTeam?.projectBuilderStaff?.forEach(builder => {
        this.SalesTeamComponent.projectBuilderStaff?.push(this.SalesTeamComponent.newProjectSalesAgents(builder.agentName, builder.agentId, builder.ProjectBuilderStaffId, builder.ProjectInternalSalesTeamId))
      });

      //this.externalBrokersComponent.form.patchValue(res?.data?.projectExternalSalesTeam);
      if (res?.data?.projectDocument.length)
        this.documentTemplateComponent.projectDocuments?.clear()
      res?.data?.projectDocument.forEach(doc => {
        let randNo = this.documentTemplateComponent.generateRandomNDigits(5);
        switch (doc.documentType) {
          case 1:
            this.documentTemplateComponent.document1 = doc.documentFileName;
            break
          case 2:
            this.documentTemplateComponent.document2 = doc.documentFileName;
            break
          case 3:
            this.documentTemplateComponent.document3 = doc.documentFileName;
            break
          case 4:
            this.documentTemplateComponent.document4 = doc.documentFileName;
            break
          case 5:
            this.documentTemplateComponent.document5 = doc.documentFileName;
            break
          case 6:
            this.documentTemplateComponent.document6 = doc.documentFileName;
            break
        }
        this.documentTemplateComponent.projectDocuments?.push(this.documentTemplateComponent.newDocument(doc.documentId, doc.projectId, doc.documentType, doc.documentText, doc.file, doc.documentFilePath,
          doc.documentFileName, doc.createdBy, doc.createdDate))
      });
      if (res?.data?.projectMarketingAssets?.length)
        (this.marketingAssetsComponent?.form?.get('projectMarketingAssets') as FormArray).clear();
      res?.data?.projectMarketingAssets?.forEach(asset => {
        (this.marketingAssetsComponent?.form?.get('projectMarketingAssets') as FormArray).push(this.marketingAssetsComponent.newMarketingAssets(asset.projectAssestsId, asset.projectId, asset.makeItPublic, asset.assetsFile, asset.assetsFilePath, asset.folderName));
      });

      this.marketingAssetsComponent.ngOnInit();
      //binding commesion details
      if (res?.data?.projectCommisions) {
        this.commissionsComponent?.form?.get('projectCommisions')?.patchValue({
          projectCommisionId: res?.data?.projectCommisions?.projectCommisionId || 0,
          projectid: res?.data?.projectCommisions?.projectid || 0,
          paymentOnPurchase: res?.data?.projectCommisions?.paymentOnPurchase,
          paymentOnPurchasePricenetofTax: res?.data?.projectCommisions?.paymentOnPurchasePricenetofTax,
          paymentOnParking: res?.data?.projectCommisions?.paymentOnParking,
          paymentOnLocker: res?.data?.projectCommisions?.paymentOnLocker,
          paymentOnTaxHST: res?.data?.projectCommisions?.paymentOnTaxHST,
          extras: res?.data?.projectCommisions?.extras,
        });
        if (res?.data?.projectCommisions?.projectCommisionStructure?.length) {
          this.commissionsComponent.projectCommisionStructure.clear();
          res?.data?.projectCommisions?.projectCommisionStructure?.forEach((commstruct, idx) => {
            this.commissionsComponent.newProjectCommisionStructure(commstruct.projectCommisionStructureId, commstruct?.commisionName, commstruct.commisionValue, commstruct.commisionType, true, false);
            commstruct?.projectCommisionStructureDetails.forEach(cdetails => {
              this.commissionsComponent.newProjectCommisionStructureDetails(idx, cdetails.projectCommisionStructureDetailId,
                cdetails.unitType, cdetails.typeOfDeposit, cdetails.amount, cdetails.percentage, cdetails.time, cdetails.dueOn, cdetails.dollarValue,
                cdetails.balanceTo, cdetails.fixedDate, cdetails.datefromAggriment, cdetails.installmentType
              );
            })
          });
        }
        if (res?.data?.projectCommisions?.projectCommisionBonus?.length) {
          this.commissionsComponent.projectCommisionBonus.clear();
          res?.data?.projectCommisions?.projectCommisionBonus?.forEach((cbonus, bi) => {
            this.commissionsComponent.newProjectCommisionBonus(cbonus.projectCommisionBonusId, cbonus?.bonusType, cbonus.bonusValue, cbonus.time, cbonus.time, cbonus.datefromAggriment, cbonus.installmentType, cbonus.taxable, true, false);
          });
        }
      }
      resolve("completed");
    });
  }
  async seedFormData(project: ProjectModel) {
    const formData = new FormData();
    Object.keys(project).forEach(key => {
      if (project[key]) {
        if (Array.isArray(project[key])) {
          if (project[key].length > 0) {
            project[key].forEach(function (value: any, index: number) {
              if (value?.email != "" || value?.item != "") {
                for (var key2 in project[key][index]) {
                  if (Array.isArray(project[key][index][key2])) {
                    project[key][index][key2].forEach(function (value2: any, innerIndex: number) {
                      for (var key3 in project[key][index][key2][innerIndex]) {
                        if (Array.isArray(value2[key3])) {
                          project[key][index][key2][innerIndex][key3].forEach(function (value3: any, innerIndex2: number) {
                            for (var key4 in project[key][index][key2][innerIndex][key3][innerIndex2]) {
                              if (Array.isArray(value3[key4])) {
                                project[key][index][key2][innerIndex][key3][innerIndex2][key4].forEach(function (value4: any, innerIndex3: number) {
                                  for (var key5 in project[key][index][key2][innerIndex][key3][innerIndex2][key4][innerIndex3]) {

                                    if (Array.isArray(value4[key5])) {
                                      project[key][index][key2][innerIndex][key3][innerIndex2][key4][innerIndex3][key5].forEach(function (value5: any, innerIndex4: number) {
                                        for (var key6 in project[key][index][key2][innerIndex][key3][innerIndex2][key4][innerIndex3][key5][innerIndex4]) {

                                          if (Array.isArray(value5[key6])) {
                                            project[key][index][key2][innerIndex][key3][innerIndex2][key4][innerIndex3][key5][innerIndex4][key6].forEach(function (value6: any, innerIndex5: number) {
                                              for (var key7 in project[key][index][key2][innerIndex][key3][innerIndex2][key4][innerIndex3][key5][innerIndex4][key6][innerIndex5]) {
                                                formData.append(key + `[${index}][${key2}][${innerIndex}][${key3}][${innerIndex2}][${key4}][${innerIndex3}][${key5}][${innerIndex4}][${key6}][${innerIndex5}][${key7}]`, value6[key7])
                                              }
                                            });
                                          }
                                          else {
                                            formData.append(key + `[${index}][${key2}][${innerIndex}][${key3}][${innerIndex2}][${key4}][${innerIndex3}][${key5}][${innerIndex4}][${key6}]`, value5[key6])
                                          }
                                        }
                                      });

                                    } else {
                                      formData.append(key + `[${index}][${key2}][${innerIndex}][${key3}][${innerIndex2}][${key4}][${innerIndex3}][${key5}]`, value4[key5])
                                    }
                                  }
                                });
                              } else {
                                formData.append(key + `[${index}][${key2}][${innerIndex}][${key3}][${innerIndex2}][${key4}]`, value3[key4])
                              }
                            }
                          });
                        }
                        else {
                          formData.append(key + `[${index}][${key2}][${innerIndex}][${key3}]`, value2[key3])
                        }
                      }
                    });
                  }
                  else if ((project[key][index][key2] instanceof File)) {
                    formData.append(key + `[${index}][${key2}]`, value[key2])

                  }
                  else {
                    formData.append(key + `[${index}][${key2}]`, value[key2])
                  }
                }
              }
            });
          }
          else {
            formData.append(key, project[key])
          }
        }
        else if (typeof project[key] === "object" && !(project[key] instanceof File)) {
          for (var key2 in project[key]) {
            if (project[key][key2] instanceof File) {
              //changed to have file as binary
              formData.append(key2, project[key][key2])

            }
            else if (project[key][key2] instanceof Array) {
              project[key][key2].forEach(function (value2: any, innerIndex: number) {
                for (var key3 in project[key][key2][innerIndex]) {
                  if (project[key][key2][innerIndex][key3] instanceof Array) {
                    project[key][key2][innerIndex][key3].forEach(function (value3: any, newInnerIndex: number) {
                      for (var key4 in project[key][key2][innerIndex][key3][newInnerIndex]) {
                        formData.append(key + `[${key2}][${innerIndex}][${key3}][${newInnerIndex}][${key4}]`, value3[key4])
                      }
                    });
                  } else {
                    formData.append(key + `[${key2}][${innerIndex}][${key3}]`, value2[key3])
                  }
                }
              });
            }
            else if (typeof project[key][key2] === "object") {
              // project[key][key2].forEach(function (value: any, index: number) {
              //   formData.append(key + `[${key2}]`, value[key2]);
              // });
              if (project[key][key2] != null) {
                Object.keys(project[key][key2]).forEach(function (item) {
                  // console.log(item, project[key][key2][key]);
                  formData.append(key + `[${key2}][${item}]`, project[key][key2][item]);
                });
              }
            }
            else {
              formData.append(key + `[${key2}]`, project[key][key2])
            }
          }
        }
        else {
          formData.append(key, project[key]);
        }
      }
    });
    return formData;
  }

  setDataForDemo() {

    return [
      {
        "towerId": 414,
        "numberofFloors": 5,
        "totalUnits": 10,
        "ceilingHeight": "500",
        "numberofUniqueBlocks": 1,
        "numberOfUnits": 0,
        "sameCeilingHeight": true,
        "towerName": "tower",
        "skipFloor": 0,
        "skipUnit": 0,
        "projectId": 189,
        "projectBlocks": [
          // {
          //     "blockId": 292,
          //     "projectId": 0,
          //     "isCustomBlock": false,
          //     "towerNo": 0,
          //     "copiedFloors": [],
          //     "stackName": "QW",
          //     "blockName": "All Units",
          //     "numberUnitsPerFloor": 2,
          //     "startingFloor": 1,
          //     "toFloor": 5,
          //     "ceilingHeight": 0,
          //     "projectFloorDetails": [
          //         // {
          //         //     "floorId": 369,
          //         //     "floorNo": 5,
          //         //     "projectBlockBlockId": 0,
          //         //     "isFloorSelected": false,
          //         //     "projectUnitFlats": [
          //         //         {
          //         //             "assignAgentId": 3,
          //         //             "flatId": 7930,
          //         //             "flatNo": 501,
          //         //             "unitTypeId": 1,
          //         //             "flatStatus": "available",
          //         //             "isSkip": false,
          //         //             "isSingleStackSelected": false,
          //         //             "isMultipleStackSelected": true,
          //         //             "unitNo": 0,
          //         //             "price": 50000,
          //         //             "interiorSize": 200,
          //         //             "ceilingHeight": 0,
          //         //             "unitName": "vt",
          //         //             "balconySize": 0,
          //         //             "floorPremium": 2000,
          //         //             "view": 4,
          //         //             "livingRoomSize": 300,
          //         //             "diningRoomSize": 40,
          //         //             "noOfBedroom": 1,
          //         //             "flatBedRooms": [],
          //         //             "nOofBaths": 1,
          //         //             "flatbathroomSizes": [],
          //         //             "terrace": 0,
          //         //             "flatterraceSizes": [],
          //         //             "noofBalcony": 0,
          //         //             "flatbalconysizes": [],
          //         //             "noofDen": 0,
          //         //             "flatdenSizes": [],
          //         //             "inActiveStatus": 0,
          //         //             "projectFloorDetailsFloorId": 369,
          //         //             "flatProjectUnitAdditionalFeatures": [
          //         //                 {
          //         //                     "additionalFeatureId": 0,
          //         //                     "flatId": 0,
          //         //                     "name": "parking",
          //         //                     "isIncluded": false,
          //         //                     "isEligible": false
          //         //                 },
          //         //                 {
          //         //                     "additionalFeatureId": 0,
          //         //                     "flatId": 0,
          //         //                     "name": "locker",
          //         //                     "isIncluded": false,
          //         //                     "isEligible": false
          //         //                 }
          //         //             ],
          //         //             "floorPlanFile": "",
          //         //             "planScheduleFile": ""
          //         //         },
          //         //         {
          //         //             "assignAgentId": 0,
          //         //             "flatId": 7931,
          //         //             "flatNo": 502,
          //         //             "unitTypeId": 1,
          //         //             "flatStatus": "available",
          //         //             "isSkip": false,
          //         //             "isSingleStackSelected": false,
          //         //             "isMultipleStackSelected": true,
          //         //             "unitNo": 0,
          //         //             "price": 50000,
          //         //             "interiorSize": 200,
          //         //             "ceilingHeight": 0,
          //         //             "unitName": "vt",
          //         //             "balconySize": 0,
          //         //             "floorPremium": 2000,
          //         //             "view": 4,
          //         //             "livingRoomSize": 300,
          //         //             "diningRoomSize": 40,
          //         //             "noOfBedroom": 1,
          //         //             "flatBedRooms": [],
          //         //             "nOofBaths": 1,
          //         //             "flatbathroomSizes": [],
          //         //             "terrace": 0,
          //         //             "flatterraceSizes": [],
          //         //             "noofBalcony": 0,
          //         //             "flatbalconysizes": [],
          //         //             "noofDen": 0,
          //         //             "flatdenSizes": [],
          //         //             "inActiveStatus": 0,
          //         //             "projectFloorDetailsFloorId": 369,
          //         //             "flatProjectUnitAdditionalFeatures": [
          //         //                 {
          //         //                     "additionalFeatureId": 0,
          //         //                     "flatId": 0,
          //         //                     "name": "parking",
          //         //                     "isIncluded": false,
          //         //                     "isEligible": false
          //         //                 },
          //         //                 {
          //         //                     "additionalFeatureId": 0,
          //         //                     "flatId": 0,
          //         //                     "name": "locker",
          //         //                     "isIncluded": false,
          //         //                     "isEligible": false
          //         //                 }
          //         //             ],
          //         //             "floorPlanFile": "",
          //         //             "planScheduleFile": ""
          //         //         }
          //         //     ]
          //         // },
          //         // {
          //         //     "floorId": 368,
          //         //     "floorNo": 4,
          //         //     "projectBlockBlockId": 0,
          //         //     "isFloorSelected": false,
          //         //     "projectUnitFlats": [
          //         //         {
          //         //             "assignAgentId": 0,
          //         //             "flatId": 7928,
          //         //             "flatNo": 401,
          //         //             "unitTypeId": 1,
          //         //             "flatStatus": "available",
          //         //             "isSkip": false,
          //         //             "isSingleStackSelected": false,
          //         //             "isMultipleStackSelected": true,
          //         //             "unitNo": 0,
          //         //             "price": 50000,
          //         //             "interiorSize": 200,
          //         //             "ceilingHeight": 0,
          //         //             "unitName": "vt",
          //         //             "balconySize": 0,
          //         //             "floorPremium": 2000,
          //         //             "view": 4,
          //         //             "livingRoomSize": 300,
          //         //             "diningRoomSize": 40,
          //         //             "noOfBedroom": 1,
          //         //             "flatBedRooms": [],
          //         //             "nOofBaths": 1,
          //         //             "flatbathroomSizes": [],
          //         //             "terrace": 0,
          //         //             "flatterraceSizes": [],
          //         //             "noofBalcony": 0,
          //         //             "flatbalconysizes": [],
          //         //             "noofDen": 0,
          //         //             "flatdenSizes": [],
          //         //             "inActiveStatus": 0,
          //         //             "projectFloorDetailsFloorId": 368,
          //         //             "flatProjectUnitAdditionalFeatures": [
          //         //                 {
          //         //                     "additionalFeatureId": 0,
          //         //                     "flatId": 0,
          //         //                     "name": "parking",
          //         //                     "isIncluded": false,
          //         //                     "isEligible": false
          //         //                 },
          //         //                 {
          //         //                     "additionalFeatureId": 0,
          //         //                     "flatId": 0,
          //         //                     "name": "locker",
          //         //                     "isIncluded": false,
          //         //                     "isEligible": false
          //         //                 }
          //         //             ],
          //         //             "floorPlanFile": "",
          //         //             "planScheduleFile": ""
          //         //         }
          //         //     ]
          //         // },

          //     ],
          //     "projectTowerTowerId": 414
          // }
        ],
        "projectTowerParkings": [
          // {
          //     "towerParkingId": 298,
          //     "numberOfParkingSlots": 0,
          //     "name": "Parking",
          //     "availableto": "All Units",
          //     "unitSizeinSqft": "450",
          //     "included": true,
          //     "eligible": false,
          //     "towerId": 0,
          //     "price": false
          // }
        ],
        "projectTowerLockers": [
          {
            "towerLockerId": 296,
            "numberOfLockerSlots": 0,
            "name": "Locker",
            "availableto": "All Units",
            "unitSizeinSqft": "450",
            "included": true,
            "eligible": false,
            "towerId": 0,
            "price": 0
          }
        ],
        "projectTowerUnitTypes": [
          {
            "unitTypeId": 0,
            "unitType": "Studio",
            "checked": false,
            "towerId": 0
          },
          {
            "unitTypeId": 0,
            "unitType": "1B+D",
            "checked": false,
            "towerId": 0
          },
          {
            "unitTypeId": 0,
            "unitType": "2B",
            "checked": false,
            "towerId": 0
          },
          {
            "unitTypeId": 0,
            "unitType": "2B+D",
            "checked": false,
            "towerId": 0
          }
        ]
      }
    ]

  }
}
