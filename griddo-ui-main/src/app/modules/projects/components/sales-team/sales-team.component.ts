import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BuilderService } from 'src/app/modules/builder/services/builder.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-sales-team',
  templateUrl: './sales-team.component.html',
  styleUrls: ['./sales-team.component.scss']
})
export class SalesTeamComponent implements OnInit, OnDestroy {
  @Output() formEmitter = new EventEmitter<any>();

  form: FormGroup;
  defultImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK1UhUMG9MTojpNTLV0XoDh-3cWX2XxTcPng&usqp=CAU';

  subscription: Subscription;

  selectedProjectSalesAgencies: Array<any> = [];



  searchBuildercontrol: FormControl = new FormControl();
  searchAgencycontrol: FormControl = new FormControl();
  searchAgentcontrol: FormControl = new FormControl();
  builders: Array<any> = [];
  agents: Array<any> = [];
  agency: Array<any> = [];
  filteredAgents: Array<any> = [];
  agentList: Array<any> = [];

  constructor(private _projectService: ProjectsService, builderService: BuilderService, private fb: FormBuilder) {
    this.form = this.fb.group({
      projectInternalSalesTeamId: 0,
      projectId: 0,
      projectSalesAgencies: this.fb.array([]),
      assignedBuilderToProject: this.fb.array([]),
      projectBuilderStaff: this.fb.array([])
    });

    this.subscription = this.searchBuildercontrol.valueChanges.pipe(distinctUntilChanged(), debounceTime(500)).subscribe(val => {
      if (val) {
        builderService.search(val).toPromise().then(res => this.builders = res?.data ?? []);
      }
    });
    this.subscription.add(this.searchAgencycontrol.valueChanges.pipe().subscribe(val => {
      if (val) {
        this.filteredAgents = this.agency.filter((item) => {
          return (item.text
            .toString()
            .toLowerCase()
            .includes(val?.toString().toLowerCase()))
        });
      } else {
        this.filteredAgents = this.agency;
      }
    }));

    this.subscription.add(this.searchAgentcontrol.valueChanges.pipe().subscribe(val => {
      if (val) {
        this.agentList = this.agents.filter((item) => {
          return (item.text
            .toString()
            .toLowerCase()
            .includes(val?.toString().toLowerCase()))
        });
      } else {
        this.agentList = this.agents;
      }
    }));
    // this.subscription.add(this.form.valueChanges.subscribe());

  }

  getSelectedAgencyName(agencyId): string {
    let name = 'N/A';
    if (agencyId && this.agency?.length) {
      const agent = this.agency.find(a => a.value == agencyId);
      name = agent?.text || agencyId
    }
    return name;
  }


  ngOnInit() {
    this.getAgencyForDropDown();
    //this.getAgentsForDropDown();
  }

  getAgencyForDropDown() {
    this._projectService.getAgencyForDropDown().subscribe(res => {
      if (res?.isSuccess)
        this.agency = res?.data;
      this.filteredAgents = this.agency;
      // console.log("res builders=>",res);
    }, err => {
    });
  }

  getAgentsForDropDown(builderId) {
    debugger;
    this._projectService.getInternalAgentForDropDown(builderId).subscribe(res => {
      if (res?.isSuccess)
        this.agents = res?.data;
      this.agentList = this.agents;
      // console.log("res builders=>",res);
    }, err => {
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  get projectSalesAgencies(): FormArray {
    return this.form.get('projectSalesAgencies') as FormArray;
  }
  get assignedBuilderToProject(): FormArray {
    return this.form.get('assignedBuilderToProject') as FormArray;
  }
  get projectBuilderStaff(): FormArray {
    return this.form.get('projectBuilderStaff') as FormArray;
  }
  onError(event: any) {
    event.target.src = this.defultImg;
  }

  newProjectSalesAgencies(agencyName = '', agencyId = 0, projectSalesAgencyId = 0, projectInternalSalesTeamId = 0, brokerageCommissionType = '%', brokerageCommission = ''): FormGroup {
    return this.fb.group
      ({
        projectSalesAgencyId: projectSalesAgencyId,
        projectInternalSalesTeamId: projectInternalSalesTeamId,
        agencyName: agencyName,
        agencyId: agencyId,
        brokerageCommissionType: brokerageCommissionType,
        brokerageCommission: brokerageCommission
      })
  }

  newProjectSalesAgents(agentName = '', agentId = 0, projectBuilderStaffId = 0, projectInternalSalesTeamId = 0): FormGroup {
    return this.fb.group
      ({
        projectBuilderStaffId: projectBuilderStaffId,
        projectInternalSalesTeamId: projectInternalSalesTeamId,
        agentName: agentName,
        agentId: agentId
      })
  }

  addProjectSalesAgencies() {
    this.projectSalesAgencies?.push(this.newProjectSalesAgencies())
  }

  addProjectSalesAgents() {
    this.projectBuilderStaff?.push(this.newProjectSalesAgents())
  }

  addAssignedBuilderToProject() {
    if (!this.searchBuildercontrol?.value?.value) {
      return this.searchBuildercontrol.reset();
    }

    if (this.assignedBuilderToProject.length && this.assignedBuilderToProject.value?.find(i => i.builderid === this.searchBuildercontrol?.value?.value)) {
      return this.searchBuildercontrol.reset();
    }
    this.assignedBuilderToProject?.push(this.newBuilderToProject(0, this.searchBuildercontrol.value?.value, this.searchBuildercontrol.value?.text, this.searchBuildercontrol.value?.companyLogoPath, 0))
    this.searchBuildercontrol.reset();
  }

  addAgencyToProject() {
    if (!this.searchAgencycontrol?.value?.value) {
      return this.searchAgencycontrol.reset();
    }

    if (this.projectSalesAgencies.length && this.projectSalesAgencies.value?.find(i => i.agencyId == this.searchBuildercontrol?.value?.value)) {
      return this.searchAgencycontrol.reset();
    }
    this.projectSalesAgencies?.push(this.newProjectSalesAgencies(this.searchAgencycontrol.value?.text, this.searchAgencycontrol.value?.value))
    this.searchAgencycontrol.reset();
    this.form.markAllAsTouched();
  }

  addAgentToProject() {
    if (!this.searchAgentcontrol?.value?.value) {
      return this.searchAgentcontrol.reset();
    }

    if (this.projectBuilderStaff.length && this.projectBuilderStaff.value?.find(i => i.agentId == this.searchBuildercontrol?.value?.value)) {
      return this.searchAgentcontrol.reset();
    }
    this.projectBuilderStaff?.push(this.newProjectSalesAgents(this.searchAgentcontrol.value?.text, this.searchAgentcontrol.value?.value))
    this.searchAgentcontrol.reset();
  }

  rmProjectSalesAgencies(index) {
    this.projectSalesAgencies.removeAt(index)
  }

  rmProjectSalesAgents(index) {
    this.projectBuilderStaff.removeAt(index)
  }

  rmAssignedBuilderToProject(index) {
    this.assignedBuilderToProject.removeAt(index)
  }

  newBuilderToProject(id = 0, builderId = 0, name = '', img = '', projectInternalSalesTeamId = 0): FormGroup {
    return this.fb.group({
      builderAssignedId: id,
      builderid: builderId,
      name: name,
      img: img,
      projectInternalSalesTeamId: projectInternalSalesTeamId,
    })
  }
}
