import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants';

@Component({
  selector: 'app-agent-card',
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss']
})
export class AgentCardComponent implements OnInit {

  @Input() agent: any;
  userDetail = CONSTANT.getUser();

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.agent) {
      this.agent['location'] = [this.agent?.city, this.agent?.province, this.agent?.zipcode, this.agent?.country].filter(i => i).join(', ')
    }
  }
  navigatetoAgent(id) {
    if (this.userDetail.superadmin) {
      this.router.navigate(['griddo-master/agents/', id]);
    } else if (this.userDetail.builder) {
      this.router.navigate(['builder-admin/agents/', id]);
    } else if (this.userDetail.agency) {
      this.router.navigate(['agency-admin/agents/', id]);
    } else {
      this.router.navigate(['griddo-master/agents/', id]);
    }
  }
}
