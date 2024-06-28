import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-builder-card',
  templateUrl: './builder-card.component.html',
  styleUrls: ['./builder-card.component.scss']
})
export class BuilderCardComponent implements OnInit {

  @Input() builder: any;
  @Input() type!: 'card-portrait' | 'card-landscape';
  // onErrorImg = `https://st3.depositphotos.com/5040187/19001/v/600/depositphotos_190011616-stock-illustration-logo-swoosh-ellipse-blue-letter.jpg`;
  onErrorImg = `assets/imgs/no-image.jpg`;

  constructor() { }

  ngOnInit(): void {
  }

  onError(event: any) {
    event.target.src = this.onErrorImg;
  }

}
