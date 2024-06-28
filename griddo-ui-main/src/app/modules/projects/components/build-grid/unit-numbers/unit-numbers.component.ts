import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarWrapperService } from 'src/app/modules/snackbar-wrapper/snackbar-wrapper.service';

@Component({
  selector: 'app-unit-numbers',
  templateUrl: './unit-numbers.component.html',
  styleUrls: ['./unit-numbers.component.scss']
})
export class UnitNumbersComponent implements OnInit {


  @Input() form!: FormGroup;
  @Output() formEmitter = new EventEmitter<FormGroup>();
  @Output() stepperChange = new EventEmitter<any>();
  @Output() onSaveData = new EventEmitter<boolean>();

  @Input() stacks!: Array<{ name: string, selected: boolean, alreadySelected: boolean }>;

  towers: Array<{ [key: string]: any, blocks: Array<any> }> = [];
  @Input() selectedTowerIndex;
  selectedTower;
  @Input() selectedBlockIndex;
  selectedBlock;


  constructor(

    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarWrapperService: SnackbarWrapperService
  ) {

  }

  ngOnInit(): void {
    this.form?.value?.projectTower?.forEach((t, ti) => {
      let tower: any = { title: t.towerName, value: ti, blocks: [] };
      t?.projectBlocks?.forEach((b, bi) => {
        let block: any = { title: b?.stackName, value: bi, count: '', floors: [] };
        if (b.startingFloor && b.toFloor && b.numberUnitsPerFloor) {
          for (let floorIndex = b.startingFloor; floorIndex <= b.toFloor; floorIndex++) {
            let floor: any = { number: floorIndex, selected: false, alreadySelected: false, units: [] };
            // let stackNumber = 1;
            b?.projectUnitPricings?.forEach((up, upi) => {
              up?.projectUnitFlats?.forEach((upF, upFi) => {
                const flatNo = `${floorIndex}0${(floor?.units?.length || 0) + 1}`.toLowerCase();
                if (upF?.flatNo?.toString()?.toLowerCase() === flatNo) {
                  floor.units.push({
                    ...upF,
                    unitSelected: upF?.isSkip ?? false,
                    towerIndex: ti,
                    blockIndex: bi,
                    unitPriceIndex: upi,
                    faltIndex: upFi
                  })
                }
                // ++stackNumber
              })
            });
            block.floors.push(floor);
          }
        }
        block.count = `${block?.floors?.length} floors X ${b.numberUnitsPerFloor} units | ${block?.floors?.length * b.numberUnitsPerFloor} units | ${b.startingFloor} - ${b.toFloor} floors`
        tower.blocks.push(block);
      });
      this.towers.push(tower);
    });

    this.selectedTowerIndex = this.selectedTowerIndex ?? 0;
    this.onTowerChange(true);
  }

  configStacks(init = false) {
    const unitsLen: Array<number> = [];
    this.selectedBlock?.floors?.forEach(f => unitsLen.push(f?.units?.length || 0));
    const maxNumber = Math.max(...unitsLen);
    if (unitsLen?.length) {
      this.stacks = Array.from(Array(maxNumber), (_, index) => {
        let n = index + 1;
        // if (n < 10) {
        //   return `0${n}`
        // }
        return { name: `${n}`, selected: false, alreadySelected: false };
      });
    }
    this.checkSelectedStack(init);
  }

  checkSelectedStack(init = false) {
    const skipStackOptions = this.skipOptions.filter(so => so.type === 'stack');
    skipStackOptions?.forEach(so => so.checked = false);
    const stacks: { [name: string]: Array<any> } = {};

    this.selectedBlock?.floors?.forEach(f => {
      f?.units
        ?.forEach((u, unitIndex) => {
          const _unitIndex = ++unitIndex;
          if (skipStackOptions.find(sso => _unitIndex.toString().toLowerCase()[sso.f]([sso.val.toString().toLowerCase()]))) {
            if (stacks[_unitIndex]) {
              stacks[_unitIndex].push(u)
            } else {
              stacks[_unitIndex] = [u];
            }
          }
        })
    });
    this.stacks
      // ?.filter((s, i) => skipStackOptions.find(sso => s.name.toString().toLowerCase()[sso.f]([sso.val.toString().toLowerCase()])))
      ?.forEach((s, i) => {
        s.selected = false;
        s.alreadySelected = false;
        if (stacks[s.name] && skipStackOptions.find(sso => s.name.toString().toLowerCase()[sso.f]([sso.val.toString().toLowerCase()]))) {
          s.selected = stacks[s.name].filter(si => si.unitSelected).length === stacks[s.name].length;
          if (init) {
            s.alreadySelected = s.selected;
          }
          if (s.selected) {
            skipStackOptions.forEach(sso => {
              if (!sso.checked && s.name.toString().toLowerCase()[sso.f]([sso.val.toString().toLowerCase()])) {
                sso.checked = true
              }
            })
          }
        }
      })
  }

  nextBlock() {
    if (this.selectedBlockIndex < this.selectedTower?.blocks?.length - 1) {
      ++this.selectedBlockIndex;
      this.onChangeBlock();
    }
  }

  onTowerChange(init = false) {
    if (this.towers[this.selectedTowerIndex]) {
      this.selectedTower = this.towers[this.selectedTowerIndex];
      this.selectedBlockIndex = init ? this.selectedBlockIndex : null;
      this.selectedBlock = null;
      if (this.selectedTower?.blocks?.length) {
        if (init) {
          this.selectedBlockIndex = this.selectedBlockIndex ?? 0;
        } else {
          this.selectedBlockIndex = 0;
        }
        this.onChangeBlock(init);
      }
    }
  }

  onChangeBlock(init = false) {
    if (this.selectedTower?.blocks[this.selectedBlockIndex]) {
      this.selectedBlock = this.selectedTower?.blocks[this.selectedBlockIndex];
      this.configStacks(init);
      this.checkSelectedFloor(init);
    }
  }

  checkSelectedFloor(init = false) {
    const skipFloorOptions = this.skipOptions.filter(so => so.type === 'floor');
    skipFloorOptions?.forEach(so => so.checked = false);
    this.selectedBlock?.floors
      // ?.filter(f => skipFloorOptions.some(so => f.number.toString().toLowerCase()[so.f]([so.val.toString().toLowerCase()])))
      ?.forEach(f => {
        f.selected = false;
        f.alreadySelected = false;
        if (skipFloorOptions.some(so => f.number.toString().toLowerCase()[so.f]([so.val.toString().toLowerCase()]))) {
          f.selected = f?.units?.filter(si => si.unitSelected)?.length === f?.units?.length;
          if (init) {
            f.alreadySelected = f.selected;
          }
          if (f.selected) {
            skipFloorOptions.forEach(so => {
              if (!so.checked && f.number.toString().toLowerCase()[so.f]([so.val.toString().toLowerCase()])) {
                so.checked = true;
              }
            })
          }
        }
      })
  }

  backToGrid() {
    this.stepperChange.emit();
  }

  onSave() {
    this.selectedBlock?.floors?.forEach(f => {
      f?.units?.forEach(u => {
        this.form.get(['projectTower', u.towerIndex, 'projectBlocks', u.blockIndex, 'projectUnitPricings', u.unitPriceIndex, 'projectUnitFlats', u.faltIndex, 'isSkip'])?.setValue(u.unitSelected, { emitEvent: false });
      })
    })
    this.stepperChange.emit();
    this.formEmitter.emit(this.form);
    // this.onSaveData.emit(true);
  }


  // skipTypes: Array<{ title: string, val: string }> = [
  //   { title: 'Floor', val: 'floor' },
  //   { title: 'Stack', val: 'stack' },
  // ]
  // startsWith
  skipOptions: Array<{ title: string, f: string, val: string, type: 'stack' | 'floor', checked: boolean }> = [
    { title: 'Skip starts with 13', f: 'startsWith', val: '13', type: 'floor', checked: false },
    { title: 'Skip ends with 13', f: 'endsWith', val: '13', type: 'stack', checked: false },
    { title: 'Skip starts with 4s', f: 'startsWith', val: '4', type: 'floor', checked: false },
    { title: 'Skip ends with 4s', f: 'endsWith', val: '4', type: 'stack', checked: false }
  ]

  updateSkipOptionInUnits(event) {
    console.log(event);
    this.selectedBlock?.floors?.forEach(f => {
      f.selected = false;
      f?.units?.forEach(u => {
        u.unitSelected = false;
        u.isSkip = false;
      })
    });
    this.stacks?.forEach(s => s.selected = false);

    const checkedOptions = this.skipOptions?.filter(i => i.checked);
    const floorOptions = checkedOptions?.filter(i => i.type === 'floor');
    const stackOptions = checkedOptions?.filter(i => i.type === 'stack');
    const floors = this.selectedBlock?.floors?.filter(f => floorOptions?.find(i => f.number?.toString()[i.f](i.val)));

    floors?.forEach(f => {
      // f.selected = false;
      f?.units?.forEach(u => u.unitSelected = true)
    });

    this.selectedBlock?.floors?.forEach(f => {
      f?.units?.forEach((u, unitIndex) => {
        if (stackOptions.find(i => (unitIndex + 1)?.toString()[i.f](i.val))) {
          u.unitSelected = true;
        }
      })
    });
    this.checkSelectedStack();
    this.checkSelectedFloor();
  }

  // selectedSkipType = "floor";

  _old_updateSkipOptionInUnits() {
    const checkedOptions = this.skipOptions.filter(i => i.checked);

    this.selectedBlock?.floors?.forEach(f => {
      f?.units?.forEach(u => {
        // const allConditions: Array<boolean> = checkedOptions.map(i => u?.flatNo?.toString()[i.f](i.val)).filter(i => i);
        u.unitSelected = checkedOptions?.length && checkedOptions.map(i => u?.flatNo?.toString()[i.f](i.val)).filter(i => i)?.length === checkedOptions?.length;
        // this.form.get(['projectTower', u.towerIndex, 'projectBlocks', u.blockIndex, 'projectUnitPricings', u.unitPriceIndex, 'projectUnitFlats', u.faltIndex, 'unitSelected'])?.setValue(u.unitSelected, { emitEvent: false });
      })
    })

    // if (this.selectedSkipType === 'floor' && checkedOptions?.length) {
    //   const floors = this.selectedBlock?.floors?.filter(f => {
    //     const allConditions: Array<boolean> = checkedOptions.map(i => f.number?.toString()[i.f](i.val)).filter(i => i);
    //     return allConditions.length === checkedOptions.length;
    //     // checkedOptions.find(i => f.number?.toString()[i.f](i.val))
    //   });
    //   floors?.forEach(f => {
    //     f?.units?.forEach(u => {
    //       u.unitSelected = true;
    //       this.form.get(['projectTower', u.towerIndex, 'projectBlocks', u.blockIndex, 'projectUnitPricings', u.unitPriceIndex, 'projectUnitFlats', u.faltIndex, 'unitSelected'])?.setValue(true, { emitEvent: false });
    //     })
    //   })
    // } else if (this.selectedSkipType === 'stack' && checkedOptions?.length) {
    //   this.selectedBlock?.floors?.forEach(f => {
    //     f?.units?.forEach((u, unitIndex) => {
    //       const allConditions: Array<boolean> = checkedOptions.map(i => (unitIndex + 1)?.toString()[i.f](i.val)).filter(i => i);
    //       if (allConditions.length === checkedOptions.length) {
    //         // if (checkedOptions.find(i => (unitIndex + 1)?.toString()[i.f](i.val))) {
    //         u.unitSelected = true;
    //         this.form.get(['projectTower', u.towerIndex, 'projectBlocks', u.blockIndex, 'projectUnitPricings', u.unitPriceIndex, 'projectUnitFlats', u.faltIndex, 'unitSelected'])?.setValue(true, { emitEvent: false });
    //       }
    //     })
    //   })
    // }
  }

}