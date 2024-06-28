import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-listing-agency',
  templateUrl: './listing-agency.component.html',
  styleUrls: ['./listing-agency.component.scss']
})
export class ListingAgencyComponent implements OnInit {
  form !: FormGroup;
  constructor(private fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.form = this.fb.group({
      ProjectExternalSalesTeamId: [0],
      ProjectId: [0],
      ProjectAccess: [0],
      ListingAgencyName: [''],
      listingBrokerageCommission: [0],
      BrokerEmails: this.fb.array([this.newProjectExternalSalesTeamEmail()])
    });
  }
  get projectExternalSalesTeamForm(): FormArray {
    return this.form.get('BrokerEmails') as FormArray;
  }
  newProjectExternalSalesTeamEmail() {
    return this.fb.group({
      id: 0,
      projectExternalSalesTeamId: 0,
      email: "",
    })
  }
  addProjectExternalSalesTeamEmail() {
    this.projectExternalSalesTeamForm.push(this.newProjectExternalSalesTeamEmail());
  }
  removeExternalSalesTeamEmail(empIndex: number) {
    this.projectExternalSalesTeamForm.removeAt(empIndex);
  }
}