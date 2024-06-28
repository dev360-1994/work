import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-worksheet-buyer-rules',
  templateUrl: './worksheet-buyer-rules.component.html',
  styleUrls: ['./worksheet-buyer-rules.component.scss']
})
export class WorksheetBuyerRulesComponent implements OnInit {
  projectWorkSheetAndBuyer!: FormGroup;
  @Output() formEmitter = new EventEmitter<FormGroup>();
  constructor(private fb: FormBuilder) {
    this.initForm();
    this.projectWorkSheetAndBuyer.valueChanges.subscribe(val => this.formEmitter.emit(this.projectWorkSheetAndBuyer));
  }

  ngOnInit(): void {
  }
  // "projectWorkSheetAndBuyer": {
  //   "projectWorkSheetAndBuyerId": 0,
  //   "projectId": 0,
  //   "numberofChoicesWorksheet": 0,
  //   "unitOfMeasurement": "string",
  //   "coolingOffDays": 0,
  //   "numberofPurchasersAllowedPerBuyer": 0,
  //   "numberOfBuyersPerWorksheet": 0
  // },
  initForm() {
    // const phoneRegx = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);
    this.projectWorkSheetAndBuyer = this.fb.group({
      projectWorkSheetAndBuyerId: [0],
      ProjectId: [0],
      numberofChoicesWorksheet: ['1', Validators.required],
      unitOfMeasurement: ['ft', Validators.required],
      coolingOffDays: [0, Validators.required],
      numberofPurchasersAllowedPerBuyer: [0],
      numberOfBuyersPerWorksheet: [0, Validators.required],
    });
  }
  setunitOfMeasurement(event) {
    if (event.checked)
    this.projectWorkSheetAndBuyer.get('unitOfMeasurement')?.patchValue('mt');
    else
    this.projectWorkSheetAndBuyer.get('unitOfMeasurement')?.patchValue('ft');

  }
}
