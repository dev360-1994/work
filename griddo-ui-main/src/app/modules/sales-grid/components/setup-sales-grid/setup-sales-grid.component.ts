import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectBlock } from '../sales-grid/project-res.model';




@Component({
  selector: 'app-setup-sales-grid',
  templateUrl: './setup-sales-grid.component.html',
  styleUrls: ['./setup-sales-grid.component.scss']
})
export class SetupSalesGridComponent implements OnInit {


  @Input() blocks!: Array<ProjectBlock>;
  @Input() selectedBlock!: ProjectBlock;
  @Input() stacks!: Array<string>;
  @Output() updateSection: EventEmitter<string> = new EventEmitter();
  @Output() selectedIndex: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
