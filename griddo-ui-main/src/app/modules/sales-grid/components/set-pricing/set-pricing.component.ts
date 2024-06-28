import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProjectBlock } from '../sales-grid/project-res.model';

@Component({
  selector: 'app-set-pricing',
  templateUrl: './set-pricing.component.html',
  styleUrls: ['./set-pricing.component.scss']
})
export class SetPricingComponent implements OnInit {



  @Input() blocks!: Array<ProjectBlock>;
  @Input() selectedBlock!: ProjectBlock
  @Input() selectedIndex = 0;
  @Input() stacks!: Array<string>;
  @Output() updateSection: EventEmitter<string> = new EventEmitter();


  constructor() { }

  ngOnInit() {
    this.onChangeBlock();
  }

  onChangeBlock() {
    this.selectedBlock = this.blocks[this.selectedIndex || 0];
    const unitsLen: Array<number> = [];
    this.selectedBlock?.projectFloorDetails?.forEach(f => unitsLen.push(f?.projectUnitFlats?.length || 0));
    const maxNumber = Math.max(...unitsLen);
    this.stacks = Array.from(Array(maxNumber), (_, index) => {
      let n = index + 1;
      if (n < 10) {
        return `0${n}`
      }
      return `${n}`;
    });
  }

  onFileChange(e: any) { }
  fileChangeEvent(e: any) { }

}
