import { Options } from '@angular-slider/ngx-slider';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CONSTANT } from 'src/app/constants';
import { ProjectsService } from 'src/app/modules/projects/services/projects.service';
import { SearchBarService } from 'src/app/modules/sidebar/search-bar.service';
import { TwoDModelComponent } from '../two-d-model/two-d-model.component';
import { PD } from './pd';
import { ProjectBlock, ProjectRes, ProjectTower, ProjectUnitFlat } from './project-res.model';

declare var $: any;


interface DropDownItem {
  // placeholder: string,
  value: string,
  id: string,
  name: string,
  sliderOptions?: {
    option: Options,
    value: number,
    highValue?: number
  },
  options?: Array<{ title: string, value: string, bgColor?: string }>,
  popover?: boolean,
  multiple?: boolean,
  // onFilter: (val) => any,
  formControl: FormControl
}

@Component({
  selector: 'app-sales-grid',
  templateUrl: './sales-grid.component.html',
  styleUrls: ['./sales-grid.component.scss']
})
export class SalesGridComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('setupSalesGridModal')

  setupSalesGridModal!: TemplateRef<any>;
  showBlockTitle: boolean = false;
  selectedIndex!: number;
  subscription: Subscription = new Subscription()

  towers!: Array<ProjectTower>;
  // tower!: ProjectTower;
  selectedTower!: ProjectTower;
  selectedTowerIndex!: any;
  isProgressing: boolean = true;
  agents: Array<{ imagePath: string, text: string, value: number }> = [];
  agent: {
    control: FormControl,
    options: Array<{ imagePath: string, text: string, value: number }>
  } = {
      control: new FormControl(),
      options: []
    }
  dropdowns: Array<DropDownItem> = [
    {
      id: 'availability',
      name: 'Filter By Status',
      value: '',
      multiple: true,
      options: [
        { title: 'All', value: 'clear' }
      ],
      formControl: new FormControl('')
    },
    {
      id: 'allbeds',
      name: "All Beds",
      popover: true,
      value: '',
      sliderOptions: {
        value: 0,
        highValue: 0,
        option: {
          floor: 0,
          ceil: 0
        }
      },
      formControl: new FormControl(0)
    },
    {
      id: 'anyprice',
      name: "Any Price",
      value: '',
      popover: true,
      sliderOptions: {
        value: 0,
        highValue: 0,
        option: {
          floor: 0,
          ceil: 0
        }
      },
      formControl: new FormControl()
    },
    // {
    //   id: 'mortgageletter',
    //   name: 'Mortgage Letter',
    //   value: '',
    //   options: [
    //     { title: 'Received', value: 'received' },
    //     { title: 'Outstanding', value: 'outstanding' }
    //   ],
    //   formControl: new FormControl()
    // },
    // {
    //   id: 'reconciliation',
    //   name: 'Reconciliation',
    //   value: '',
    //   options: [
    //     { title: 'Outstanding Deposit', value: '' },
    //     { title: 'Outstanding Commission Invoice', value: 'Overriding Price' },
    //     { title: 'Overriding Price', value: 'Overriding Price' }
    //   ],
    //   formControl: new FormControl()
    // },
    {
      id: 'agent',
      name: 'Agent',
      value: '',
      multiple: true,
      options: [
        { title: 'All', value: 'clear' }
      ],
      formControl: new FormControl()
    }
  ]

  filtered_dropdowns: Array<DropDownItem> = [];
  more_dropdowns: Array<DropDownItem> = [];

  indicators!: Array<{ bgColor: string, title: string, value: string, }>
  stacks!: Array<string>;
  projectId!: string;

  section: 'sales-grid' | 'steup-sales-grid' | 'steup-sales-grid-pricing' | 'steup-sales-grid-units-skips' = 'sales-grid';

  type: 'grid' | 'table' | '2d' = 'grid';


  selectedUnits: Array<ProjectUnitFlat> = [];
  flatNumberAlreadyexist!: boolean
  showMoreFilters: boolean = false;
  maxFilterItem!: number;
  AllDropval: any = [];
  maxxNumber: any;
  AgentDropval: any = [];

  projects: any = [];

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth >= 1700) {
      this.maxFilterItem = 6;
    } else if (window.innerWidth >= 1500) {
      this.maxFilterItem = 6;
    } else if (window.innerWidth >= 1300) {
      this.maxFilterItem = 2;
    } else if (window.innerWidth >= 1000) {
      this.maxFilterItem = 1;
    }

    this.filtered_dropdowns = this.dropdowns.filter((item, index) => (index + 1) <= this.maxFilterItem)
    this.more_dropdowns = this.dropdowns.filter((item, index) => (index + 1) > this.maxFilterItem)
  }

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectsService: ProjectsService,
    private snackbarWrapperService: SnackbarWrapperService,
    private searchBarService: SearchBarService,

  ) {
    this.onResize();
    this.fetchAgents();
    // this.dropdowns?.forEach(d => {
    //   if (d?.formControl?.valueChanges) {
    //     this.subscription.add(d.formControl.valueChanges.subscribe(val => this.onFilter(d.formControl)))
    //   }
    // })
    this.fetchProject();
    this.subscription.add(this.agent.control.valueChanges.subscribe((val: string | number) => {
      if (typeof val === 'string') {
        this.agent.options = this.agents?.filter(a => a?.text?.toLowerCase()?.includes(((val || '') as string).toLowerCase()));
      }
    }));


  }
  arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  onFilter = (item?: any, e?: any, value?: any) => {
    // debugger
    // console.log('dd', e._selected);
    // console.log('value', item.formControl.value)
    if (item?.id == 'availability' || item?.id == 'agent') {
      let values = item.options.map(x => x.value)
      const result = values.filter(y => y != 'clear');
      let isEqual = this.arrayEquals(item.formControl.value, result)
      if (value == 'clear' && e._selected) {
        item.formControl.patchValue(values)
      } else if (value == 'clear' && !e._selected) {
        item.formControl.patchValue([])
      } else if (isEqual) {
        item.formControl.patchValue(values);
      } else {
        const arr = item.formControl.value.filter(y => y != 'clear');
        item.formControl.patchValue(arr);
      }
    }
    // console.log("data", item);
    // console.log('length', item.options)

    // let isEqual = this.arrayEquals(values, val)
    // console.log(this.arrayEquals(values, val));
    // console.log('dd', val);
    // console.log("data", item);

    // fromControl.patchValue(['clear', 'Off Market', 'Sold(10 days)', 'Worksheet submitted', 'Available', 'Allocated', 'Sold-firm'])
    // debugger;
    this.AllDropval = [];
    const filters: { [key: string]: { val: any, visibilityHidden?: boolean } } = {};

    this.dropdowns.filter(d => d?.formControl?.value).forEach(d => {
      if (d?.formControl?.value && Array.isArray(d?.formControl?.value) && (d?.formControl?.value as Array<string>).includes('clear')) {
        if (d?.formControl?.value?.length) {
          // d.formControl.setValue(null, { emitEvent: false });
          filters[d.id] = { val: d?.formControl?.value, visibilityHidden: false };
          // this.AllDropval = [];
          // console.log(this.dropdowns[0].options);
          // this.dropdowns[0].options?.forEach((value, index) => {
          //   this.AllDropval.push(value.value);
          // });
          // filters[this.dropdowns[0].id] = { val: this.AllDropval, visibilityHidden: false };
          // console.log("chaitan**1", this.AllDropval);
          // console.log("chaitan1", filters);
        }
      } else if (d?.formControl?.value && d?.formControl?.value == 'clear') {
        // d.formControl.setValue(null, { emitEvent: false });
        // console.log("chaitan$2", filters);
        // console.log("chaitan2");
        filters[d.id] = { val: d?.formControl?.value, visibilityHidden: false };
      }
      // else if (d?.formControl?.value && d?.formControl?.value == 'agentclear') {
      //   this.AgentDropval = [];
      //   console.log(this.dropdowns);
      //   this.dropdowns[3].options?.forEach((value, index) => {
      //     this.AgentDropval.push(value.value);
      //   });
      //   filters[this.dropdowns[3].id] = { val: this.AgentDropval, visibilityHidden: false };
      // }
      else {
        filters[d.id] = { val: d?.formControl?.value, visibilityHidden: false };
        // console.log("chaitan@3", d?.formControl?.value);
        // console.log("chaitan3", filters);
      }
    });
    this.selectedTower?.projectBlocks?.forEach(block => block?.projectFloorDetails?.forEach(floor => floor?.projectUnitFlats?.forEach(flat => {
      this.selectedUnits = [];
      flat.selected = false;
      flat.visibilityHidden = false;
      // console.log(filters?.availability?.val)
      if (Object.keys(filters).length) {
        if (filters?.availability?.val && Array.isArray(filters?.availability?.val)) {
          if (filters?.availability?.val.length) {
            filters.availability.visibilityHidden = !filters?.availability?.val.map(i => i.toLowerCase()).includes(flat?.flatStatus?.toLowerCase())
          }
        } else if (filters?.availability?.val) {
          filters.availability.visibilityHidden = flat?.flatStatus?.toLowerCase() !== filters.availability?.val?.toLowerCase()
        }
        // console.log('fhhh', filters.availability.visibilityHidden)
        if (filters?.anyprice) {
          // highValue: 145 pointerType: 0 value: 55
          filters.anyprice.visibilityHidden = !(flat.price >= filters?.anyprice?.val?.value && flat.price <= filters?.anyprice?.val?.highValue);
          // console.log("filters.anyprice.visibilityHidden", filters.anyprice.visibilityHidden);
        }
        if (filters?.allbeds) {
          // highValue: 145 pointerType: 0 value: 55

          filters.allbeds.visibilityHidden = !(flat.noOfBedroom >= filters?.allbeds?.val?.value && flat.noOfBedroom <= filters?.allbeds?.val?.highValue);
          // console.log("filters.allbeds.visibilityHidden", filters.allbeds.visibilityHidden);
        }

        //  if (filters?.agent?.val.length) {
        //   //  filters.agent.visibilityHidden = !filters?.agent?.val
        //  filters.agent.visibilityHidden = !(flat.assignAgentId >= filters?.agent?.val?.value && flat.assignAgentId <= filters?.agent?.val);

        //    console.log("filters.agent.visibilityHidden", filters.agent);
        //  }
        // console.log('fiter', flat)
        if (filters?.agent?.val && Array.isArray(filters?.agent?.val)) {
          //  debugger
          if (filters?.agent?.val.length) {
            // debugger
            // console.log('flat?.assignAgentId', flat?.assignAgentId)
            filters.agent.visibilityHidden = !filters?.agent?.val.map(i => Number(i)).includes(flat?.assignAgentId)
          }
        } else if (filters?.agent?.val) {
          //  debugger
          // console.log('flat?.assignAgentId', flat?.assignAgentId)
          filters.agent.visibilityHidden = flat?.assignAgentId !== Number(filters.agent?.val)
        }
        // console.log(filters.agent.visibilityHidden)
        flat.visibilityHidden = !!Object.keys(filters).filter(key => filters[key].visibilityHidden).length
        // console.log(flat.visibilityHidden)
      }

    })));
  }





  ngOnInit() {
    // this.enableSearchBar();
  }

  resetSelectedUnits() {
    this.selectedUnits = [];
  }

  onSelectAgent(event, action: 'assign' | 'revoke'): any {

    this.agent.control.setValue('');
    if (!this.selectedUnits?.length) {
      // return this.snackbarWrapperService.open(action === 'assign' ? 'Please select units' : 'Please select a unit');
      return this.snackbarWrapperService.open('Please select units');
    }
    if (event?.option?.value && action === 'assign') {
      this.isProgressing = true;
      const agentId = event?.option?.value;
      this.projectsService.assignedAgentToFlat({ flatIds: this.selectedUnits.map(u => u.flatId), agentId }).subscribe((res) => {
        this.resetSelectedUnits();
        this.isProgressing = false;
        if (res.isSuccess) {
          this.fetchProject(true)
        } else {
          this.snackbarWrapperService.open(res.message);
        }
      }, err => { this.isProgressing = false; this.resetSelectedUnits(); this.snackbarWrapperService.open(JSON.stringify(err)) })
    } else if (action === 'revoke') {
      const assignAgentIds = this.selectedUnits.filter(u => u.assignAgentId);
      if (!assignAgentIds?.length) {
        return this.snackbarWrapperService.open(`Selected Units doesn't has any agent assigned!`);
      }

      const groupsByAgentId: { [key: string]: Array<ProjectUnitFlat> } = assignAgentIds.reduce((accumulator, currentValue) => {
        accumulator[currentValue.assignAgentId] = [...accumulator[currentValue.assignAgentId] || [], currentValue];
        return accumulator;
      }, {});
      this.isProgressing = true;
      Promise.all(Object.keys(groupsByAgentId).map(key => this.projectsService.revokeAgentFromFlat({
        flatIds: groupsByAgentId[key].map(unit => unit.flatId),
        agentId: parseInt(key)
      }).toPromise())).then(res => {
        this.resetSelectedUnits();
        this.isProgressing = false;
        // if (res.isSuccess) {
        this.fetchProject(true);
        // } else {
        //   this.snackbarWrapperService.open(res.message);
        // }
      }).catch(err => {
        this.resetSelectedUnits(); this.isProgressing = false; this.snackbarWrapperService.open(JSON.stringify(err))
      })
      // this.projectsService.revokeAgentFromFlat({ flatIds: this.selectedUnits.map(u => u.flatId), agentId: this.selectedUnits[0]?.assignAgentId }).subscribe((res) => {
      //   this.resetSelectedUnits();
      //   this.isProgressing = false;
      //   if (res.isSuccess) {
      //     this.fetchProject(true);
      //   } else {
      //     this.snackbarWrapperService.open(res.message);
      //   }
      // }, err => { this.resetSelectedUnits(); this.isProgressing = false; this.snackbarWrapperService.open(JSON.stringify(err)) })
    }
  }

  openRevokeConfirmation(revokeAgentsTemplate: TemplateRef<any>): any {
    if (!this.selectedUnits?.length) {
      return this.snackbarWrapperService.open('Please select a unit');
    }
    let selectedUnits = this.selectedUnits.filter(u => !u.assignAgentId);
    selectedUnits?.forEach(u => this.toggleUnitSelection(u));
    if (!this.selectedUnits?.length) {
      return this.snackbarWrapperService.open('Please select a unit with assigned agent');
    }
    const dialogRef = this.dialog.open(revokeAgentsTemplate, {
      width: '30rem',
      maxWidth: '99vw',
      minWidth: '300px',
      disableClose: true
    });
    const sub = dialogRef.afterClosed().subscribe(val => {
      if (val) {
        try {
          this.onSelectAgent({}, 'revoke');
        } catch (e) { }
      }
      sub?.unsubscribe();
    })
  }

  ngOnDestroy() {
    // this.enableSearchBar(false);
    this.subscription?.unsubscribe()
  }

  fetchProject(refresh = false) {
    this.resetSelectedUnits();
    const projectId = CONSTANT.find_params_in_activated_route('projectId', this.activatedRoute.snapshot);
    if (projectId) {
      this.projectId = projectId;
      this.isProgressing = true;
      this.projectsService.getProjectDetailBYProjectIdStepper(projectId, refresh).subscribe(res => {
        // console.log(res)
        if (!res?.isSuccess) {
          this.isProgressing = false;
          this.snackbarWrapperService.open(res?.message || 'something went wrong ! Please try again');
        }
        if (res?.isSuccess) {
          this.init(res)
        }
      }, err => {
        if (err?.error?.error) {
          this.snackbarWrapperService.open(JSON.stringify(err?.error?.error));
        } else if (err.message || err?.data?.message) {
          this.snackbarWrapperService.open(JSON.stringify(err.message || err?.data?.message));
        } else {
          this.snackbarWrapperService.open(JSON.stringify(err));
        }
        this.isProgressing = false;
      });
    } else {
      this.isProgressing = false;
    }
  }



  init(res: any) {

    const projectRes: ProjectRes = res;
    // const projectRes: ProjectRes = PD;
    if (projectRes?.data?.projectGridColors?.length) {
      this.indicators = projectRes?.data?.projectGridColors.map(c => ({
        bgColor: c?.colorCode,
        title: c?.colorTitle,
        value: c?.colorCodeStatus ?? c?.colorCode,
      }))
    }
    // console.log("--------", this.indicators);
    if (this.indicators?.length) {
      this.dropdowns.some(i => {
        if (i.id === 'availability') {
          i.options = [...(i.options || []), ...this.indicators.map(indicator => ({ title: indicator.title, value: indicator.title, bgColor: indicator?.bgColor, }))];
          return;
        }
      })
    }

    this.towers = projectRes?.data?.projectTower;
    // this.towers = [...this.towers,...projectRes?.data?.projectTower];
    // this.towers = [...this.towers,...projectRes?.data?.projectTower];
    // this.towers = [...this.towers,...projectRes?.data?.projectTower];
    if (this.towers?.length) {
      this.towers?.forEach(tower => {
        tower?.projectBlocks?.sort((a, b) => { return b.blockNo - a.blockNo });
        tower?.projectBlocks?.forEach(block => {
          block['count'] = `${block?.projectFloorDetails?.length} X ${block?.numberUnitsPerFloor} units | ${block?.projectFloorDetails?.length * block?.numberUnitsPerFloor} units`;
          block?.projectFloorDetails?.sort((a, b) => { return b.floorNo - a.floorNo });
          block?.projectFloorDetails?.forEach(floor => {
            floor?.projectUnitFlats?.sort((a, b) => { return a.flatNo - b.flatNo });
            floor?.projectUnitFlats?.forEach(flat => {
              let agentName = this.agents.find(x => x.value == flat.assignAgentId)?.text
              const indicator = this.indicators?.find(i => i?.title?.toLowerCase() === flat?.flatStatus?.toLowerCase());
              flat['selected'] = false;
              flat['floorId'] = floor.floorId;
              flat['floorNo'] = floor.floorNo;
              flat['visibilityHidden'] = false;
              flat['agentName'] = agentName;
              flat['bgColor'] = indicator?.bgColor || (this.indicators.length ? this.indicators[0].bgColor : '')
            })
          })
        })
      })
      this.selectedTowerIndex = 0;
      this.selectedTower = this.towers[0];
      // console.log(this.selectedTower.towerId);

    }
    this.configStacks();
    this.isProgressing = false;
  }

  configStacks() {
    const unitsLen: Array<number> = [];
    this.selectedTower?.projectBlocks?.forEach(pb => pb?.projectFloorDetails?.forEach(f => unitsLen.push(f?.projectUnitFlats?.length || 0)));
    if (unitsLen?.length) {
      const maxNumber = Math.max(...unitsLen);
      this.stacks = Array.from(Array(maxNumber), (_, index) => {
        let n = index + 1;
        if (n < 10) {
          return `0${n}`
        }
        return `${n}`;
      });
    }
    this.configNoOfBedsFilter();
    this.configPricesFilter();
  }

  configNoOfBedsFilter() {
    let beds: Array<number> = [];
    this.selectedTower?.projectBlocks?.
      forEach(pb => pb?.projectFloorDetails?.
        forEach(f => f?.projectUnitFlats?.
          forEach(unit => beds.push(unit.noOfBedroom))));
    beds = [...new Set(beds)];
    if (beds?.length) {
      const maxNumber = Math.max(...beds);
      this.dropdowns.some(i => {
        if (i.id === 'allbeds' && i.sliderOptions?.option?.hasOwnProperty('ceil')) {
          i.sliderOptions.option.ceil = maxNumber || 0;
          return;
        }
      })
    }
  }

  configPricesFilter() {
    let prices: Array<number> = [];
    this.selectedTower?.projectBlocks?.
      forEach(pb => pb?.projectFloorDetails?.
        forEach(f => f?.projectUnitFlats?.
          forEach(unit => prices.push(unit.price || 0))));
    prices = [...new Set(prices)];
    if (prices?.length) {
      this.maxxNumber = Math.max(...prices);

      this.dropdowns.some(i => {
        if (i.id === 'anyprice' && i.sliderOptions?.option?.hasOwnProperty('ceil')) {
          i.sliderOptions.option.ceil = this.maxxNumber;
          i.sliderOptions.highValue = this.maxxNumber;
          return;
        }
      })
    }
  }

  onSelectTower(index) {
    this.selectedTowerIndex = index;
    this.resetSelectedUnits();
    this.selectedTower = this.towers[this.selectedTowerIndex || 0];
    this.configStacks();
  }

  unitDetails(unit: ProjectUnitFlat) {
    this.projectsService.towerId=this.selectedTower.towerId;
    // console.log("unit",unit)
    if (this.selectedTower?.projectBlocks?.find(pb => pb?.projectFloorDetails?.find(f => f?.projectUnitFlats?.find(u => u?.selected)))) {
      unit['selected'] = !unit.selected;
    } else {
      // let a={unit:unit.flatId,towerId:this.selectedTower.towerId}

      this.router.navigate(['unit', unit.flatId,'towerId',this.selectedTower.towerId], { relativeTo: this.activatedRoute })
    }
  }



  ngAfterViewInit() {
    // this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.setupSalesGridModal, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
    const sub = dialogRef.afterClosed().subscribe(val => {
      this.section = val as any;
      sub?.unsubscribe();
    })
  }

  updateSection(section: string) {
    this.section = section as any;
  }

  userChangeEnd = (e: { highValue: number, pointerType: number, value: number } | any, item) => {
    // console.log('djj', item?.sliderOptions)
    if (item?.sliderOptions) {
      item.sliderOptions = {
        value: e?.value || 0,
        highValue: e?.highValue || 0,
        option: item?.sliderOptions.option
        // option: {
        //   floor: 0,
        //   ceil: this.maxxNumber
        // }
      }
    }
    this.dropdowns.some(d => {
      if (item.id === d.id && d?.formControl?.setValue) {
        d.formControl.setValue(e);
      }
    })
    this.onFilter();
  }

  toggleUnitSelection(unit: ProjectUnitFlat) {
    unit.selected = !unit.selected;
    if (unit.selected) {
      if (!this.selectedUnits.find(u => u.flatId === unit.flatId)) {
        this.selectedUnits.push(unit);
      }
    } else {
      const unitIndex: number = this.selectedUnits.findIndex(u => u.flatId === unit.flatId);
      if (unitIndex !== -1) {
        this.selectedUnits.splice(unitIndex, 1);
      }
    }
  }

  changeStatus(change: MatSelectChange): any {
    const status = change.value;
    if (!this.selectedUnits?.length) {
      change.source.value = null;
      return this.snackbarWrapperService.open('Please select units');
    }
    this.isProgressing = true;
    change.source.value = null;
    this.projectsService.updateFlatActionStatus({ flatIds: this.selectedUnits.map(u => u.flatId), status }).subscribe((res) => {
      this.resetSelectedUnits();
      if (res.isSuccess) {
        this.fetchProject(true)
      } else {
        this.snackbarWrapperService.open(res.message);
      }
    }, err => { this.resetSelectedUnits(); this.snackbarWrapperService.open(JSON.stringify(err)) })
  }

  mergeFlats(): any {
    if (!this.selectedUnits?.length) {
      return this.snackbarWrapperService.open('Please select units');
    }
    const groups = this.selectedUnits.reduce((accumulator, currentValue) => {
      accumulator[currentValue.floorId] = [...accumulator[currentValue.floorId] || [], currentValue];
      return accumulator;
    }, {});

    if (Object.keys(groups).length > 1) {
      return this.snackbarWrapperService.open('Units can be merged of same floor');
    }
    this.isProgressing = true;
    this.projectsService.mergeFlat({ flatIds: this.selectedUnits.map(u => u.flatId), status: true }).subscribe((res) => {
      this.resetSelectedUnits();
      if (res.isSuccess) {
        this.fetchProject(true)
      } else {
        this.snackbarWrapperService.open(res.message);
      }
    }, err => { this.resetSelectedUnits(); this.snackbarWrapperService.open(JSON.stringify(err)) })
  }

  getNewFlatNumberForSplit(addNewFlatNoForSplitFlatTemplate: TemplateRef<any>): any {
    if (!this.selectedUnits?.length) {
      return this.snackbarWrapperService.open('Please select a unit');
    }
    if (this.selectedUnits?.length > 1) {
      return this.snackbarWrapperService.open('Please select a single unit');
    }
    const dialogRef = this.dialog.open(addNewFlatNoForSplitFlatTemplate, {
      width: '40rem',
      maxWidth: '99vw',
      disableClose: true
    });
    const sub = dialogRef.afterClosed().subscribe(val => {
      if (val) {
        try {
          let flatNo = parseInt(val);
          this.splitFlats(this.selectedUnits[0].flatId, flatNo)
        } catch (e) { }
      }
      sub?.unsubscribe();
    })
  }

  checkFaltNumber(val) {
    this.flatNumberAlreadyexist = this.selectedTower?.projectBlocks?.some(block => block?.projectFloorDetails?.some(floor => floor?.projectUnitFlats?.some(flat => flat?.flatNo == val)))
  }

  splitFlats(flatId: number, flatno: number) {
    // if (!this.selectedUnits?.length) {
    //   return this.snackbarWrapperService.open('Please select units');
    // }
    // const groups = this.selectedUnits.reduce((accumulator, currentValue) => {
    //   accumulator[currentValue.floorId] = [...accumulator[currentValue.floorId] || [], currentValue];
    //   return accumulator;
    // }, {});

    // if (Object.keys(groups).length > 1) {
    //   return this.snackbarWrapperService.open('Units can be splitted of same floor');
    // }
    this.isProgressing = true;
    this.projectsService.splitFlat({ flatId, flatno }).subscribe((res) => {
      this.resetSelectedUnits();
      if (res.isSuccess) {
        this.fetchProject(true)
      } else {
        this.snackbarWrapperService.open(res.message);
      }
    }, err => { this.resetSelectedUnits(); this.snackbarWrapperService.open(JSON.stringify(err)) })
  }





  fetchAgents() {
    this.projectsService.getAgentForDropDown().subscribe(res => {
      this.agents = res?.data ?? [];
      this.agent.options = this.agents;
      if (this.agents.length) {
        this.dropdowns.some(i => {
          if (i.id === 'agent') {
            i.options = [...(i.options || []), ...this.agents.map(a => ({ title: a.text, value: `${a.value}` }))];
            return;
          }
        })
      }

    });
  }

  open2DModel() {
    const dialogRef = this.dialog.open(TwoDModelComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }
}
