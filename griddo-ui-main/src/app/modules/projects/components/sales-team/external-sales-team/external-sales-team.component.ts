import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-external-sales-team',
  templateUrl: './external-sales-team.component.html',
  styleUrls: ['./external-sales-team.component.scss']
})
export class ExternalSalesTeamComponent implements OnInit {
  form !: FormGroup;
  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm() {
    this.form = this.fb.group({
      projectBroker: this.fb.array([this.newProjectExternalSalesTeam()])
    });
  }
  newProjectExternalSalesTeam() {
    return this.fb.group({
      ProjectBrokerId: 0,
      ProjectId: 0,
      ProjectAccess: "",
      ProjectBrokerDetails: this.fb.array([this.newProjectBrokerDetails()])
    })
  }
  newProjectBrokerDetails() {
    return this.fb.group({
      BrokerDetailId: 0,
      ProjectBrokerId: 0,
      BrokerEmail: "",
      BrokerCommission: 0.0
    })
  }
}