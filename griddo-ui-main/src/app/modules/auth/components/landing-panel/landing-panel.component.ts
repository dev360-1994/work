import { Component, OnInit, Input } from '@angular/core';
import { SwiperOptions } from 'swiper/types/swiper-options';
// import Swiper core and required modules
import SwiperCore, { Autoplay, EffectFade } from 'swiper/core';
import { ActivatedRoute } from '@angular/router';

// install Swiper modules
SwiperCore.use([EffectFade, Autoplay]);

@Component({
  selector: 'app-landing-panel',
  templateUrl: './landing-panel.component.html',
  styleUrls: ['./landing-panel.component.scss']
})
export class LandingPanelComponent implements OnInit {

  links!: Array<{ title: string, url: string }>;
  isLogin!: boolean

  swiperOptions: SwiperOptions = {
    autoplay: true,
    effect: 'fade'
  };

  slides: Array<string> = [
    '/assets/imgs/explore.png',
    '/assets/imgs/explore-2.png',
    '/assets/imgs/explore-3.png'
  ]

  isSmallScreen = window.innerWidth <= 800;

  constructor(private activatedRoute: ActivatedRoute) {
    window.onresize = () => this.isSmallScreen = window.innerWidth <= 800;
    this.links = [
      { title: 'About Us', url: '' },
      { title: 'Ask For a Trial', url: '' }
    ]
    this.activatedRoute.data.subscribe(data => {
      this.isLogin = data?.login ?? false;
    });
  }

  ngOnInit(): void {
  }

}
