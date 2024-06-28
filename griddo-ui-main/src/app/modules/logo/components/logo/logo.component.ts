import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  @Input() whiteLogo: boolean = false;
  logoURL: '/assets/imgs/white-logo.png' | '/assets/imgs/black-logo.png' = "/assets/imgs/white-logo.png";

  constructor() { }

  ngOnInit(): void {
    this.logoURL = this.whiteLogo ? '/assets/imgs/white-logo.png' : '/assets/imgs/black-logo.png';
  }

}
