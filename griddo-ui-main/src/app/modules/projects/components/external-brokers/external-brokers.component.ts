import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-external-brokers',
  templateUrl: './external-brokers.component.html',
  styleUrls: ['./external-brokers.component.scss']
})
export class ExternalBrokersComponent implements OnInit, OnChanges {

  @Output() formEmitter: EventEmitter<FormGroup> = new EventEmitter();
  @Input() commisionform!: any;
  form !: FormGroup;
  agents: Array<any> = [];
  filteredAgents: Array<any> = [];
  commisionStructureValues: Array<{ label: string, commisionType: string, commisionValue: string }> = [];
  savedAgentIds: number[] = [];


  searchBrokercontrol: FormControl = new FormControl();
  subscription!: Subscription;


  constructor(private _projectService: ProjectsService, private fb: FormBuilder) {
    this.form = this.fb.group({
      projectExternalSalesTeams: this.fb.array([])
    });

    this.subscription = this.searchBrokercontrol.valueChanges.pipe().subscribe(val => {
      if (val) {
        this.filteredAgents = this.agents?.filter((item) => {
          return item.isSelected == false;
        }).filter((item) => {
          return (item.text
            .toString()
            .toLowerCase()
            .includes(val?.toString().toLowerCase()))
        });
      }
      else {
        this.filteredAgents = this.agents?.filter((item) => {
          return item.isSelected == false;
        });;
      }
    });
  }

  ngOnInit() {
    this.getAgentsForDropDown();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['commisionform']) {
      //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      //Add '${implements OnChanges}' to the class.
      this.commisionStructureValues = [];
      this.commisionform?.projectCommisions?.projectCommisionStructure?.forEach(x => {
        let label: any
        let currsign: any

        switch (x?.commisionType) {

          case 1:
            label = `${x.commisionValue} ${'%'}`;
            currsign = '%';
            break;
          case 2:
            label = ` ${'$'} ${x.commisionValue}`
            currsign = '%';
            break;
          case 3:
            label = `${x.commisionValue} ${'%'}`;
            currsign = '%';

            break;
          case "1":
            label = `${x.commisionValue} ${'%'}`;
            currsign = '%';
            break;
          case "2":
            label = ` ${'$'} ${x.commisionValue}`
            currsign = '%';
            break;
          case "3":
            label = `${x.commisionValue} ${'%'}`;
            currsign = '%';

            break;
          default:
            console.log("No such day exists!");
            break;
        }
        this.commisionStructureValues.push({ commisionValue: (x.commisionValue).toString(), commisionType: currsign, label: label })
      })

    }
  }

  getAgentsForDropDown() {
    this._projectService.getExternalAgentForDropDown().subscribe(res => {
      if (res?.isSuccess)
        this.agents = res?.data?.map(item => {
          item.isSelected = this.savedAgentIds.includes(item.value) ? true : false;
          return item;
        });
      this.filteredAgents = this.agents?.filter((item) => {
        return item.isSelected == false;
      });
    }, err => {
    });
  }

  get projectExternalSalesTeams(): FormArray {
    return this.form.get('projectExternalSalesTeams') as FormArray;
  }

  newProjectExternalSalesTeams(id = 0, projectId = 0, isProjectAccess = false, brokerGroupName = '', brokerCommissionType = '%', brokerCommission = ''): FormGroup {

    let broker = this.fb.group({
      projectExternalSalesTeamId: id,
      projectId: projectId,
      isProjectAccess: isProjectAccess,
      brokerGroupName: brokerGroupName || '',
      brokerCommissionType: brokerCommissionType,
      brokerCommission: brokerCommission,
      projectExternalTeamBroker: this.fb.array([])
    });
    broker.get('brokerCommission')?.valueChanges.subscribe(res => {
      console.log(res);
      if (this.commisionStructureValues) {
        let val = this.commisionStructureValues.find(x => x.commisionValue == res)
        broker.get('brokerCommissionType')?.setValue(val?.commisionType || '%');
      }
    })
    return broker;
  }

  rmProjectExternalSalesTeams(index) {
    this.projectExternalSalesTeams.removeAt(index)
  }
  ddlchange(data) {
  }
  projectExternalTeamBroker(index: number) {
    return this.form.get(['projectExternalSalesTeams', index, 'projectExternalTeamBroker']) as FormArray;
  }

  newProjectExternalTeamBroker(id = 0, projectExternalSalesTeamId = 0, fullName = '', agentId = 0) {
    if (this.filteredAgents.length > 0) {
      this.recreateAgentList(agentId, true);
    } else {
      this.savedAgentIds.push(agentId);
    }
    return this.fb.group({
      externalTeamBrokerId: id,
      projectExternalSalesTeamId: projectExternalSalesTeamId,
      fullName: fullName,
      agentId: agentId
    })
  }

  addBrokerToProject(index: number) {
    if (!this.searchBrokercontrol?.value?.value) {
      return this.searchBrokercontrol.reset();
    }
    this.recreateAgentList(this.searchBrokercontrol?.value?.value, true);
    if (this.projectExternalTeamBroker(index).length && this.projectExternalTeamBroker(index).value?.find(i => i.builderid === this.searchBrokercontrol?.value?.value)) {
      return this.searchBrokercontrol.reset();
    }
    this.projectExternalTeamBroker(index)?.push(this.newProjectExternalTeamBroker(0, 0, this.searchBrokercontrol.value?.text, this.searchBrokercontrol.value?.value))
    this.searchBrokercontrol.reset();
  }

  addProjectExternalTeamBroker(index: number) {
    this.projectExternalTeamBroker(index).push(this.newProjectExternalTeamBroker());
  }

  addProjectExternalSalesTeams() {
    this.projectExternalSalesTeams?.push(this.newProjectExternalSalesTeams());
  }
  rmProjectExternalTeamBroker(pIndex, index) {
    let agentId = this.projectExternalTeamBroker(pIndex).value[index]?.agentId;
    this.recreateAgentList(agentId, false);
    this.projectExternalTeamBroker(pIndex).removeAt(index);
  }

  recreateAgentList(agentId: number, isSelected: boolean) {
    this.agents.map((item) => {
      if (item.value === agentId) item.isSelected = isSelected;
    });
    this.filteredAgents = this.agents.filter((item) => {
      return item.isSelected == false;
    });
  }

}