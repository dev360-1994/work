import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANT } from 'src/app/constants';

@Component({
  selector: 'app-agency-card',
  templateUrl: './agency-card.component.html',
  styleUrls: ['./agency-card.component.scss']
})
export class AgencyCardComponent implements OnInit {

  @Input() agency: any;
  isBuilder = CONSTANT.getUser()?.role == 'Builder' ? true : false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if(this.agency){
      this.agency['location'] = [this.agency?.city,this.agency?.province,this.agency?.zipcode,this.agency?.country].filter(i => i).join(', ')
    }
  }

  navigatetoAgency(id) {
    if (this.isBuilder) {
      this.router.navigate(['builder-admin/listing-agency/', id]);
    }
    else {
      this.router.navigate(['griddo-master/listing-agency/', id]);
    }
  }

}
