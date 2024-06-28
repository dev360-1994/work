import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input() project: any;
  onErrorImg = "assets/imgs/no-image.jpg";

  constructor() { }

  ngOnInit(): void {
  }

  onError(event: any) {
    event.target.src = this.onErrorImg;
  }

}
