import { AfterViewInit, Component, OnInit } from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'app-two-d-model',
  templateUrl: './two-d-model.component.html',
  styleUrls: ['./two-d-model.component.scss']
})
export class TwoDModelComponent implements OnInit, AfterViewInit {

  loading = true;
  floorView = false;

  constructor() { }

  ngOnInit(): void {
    this.loading = true;
  }

  ngAfterViewInit(): void {
    this.enabledTwodModel();
  }

  enabledTwodModel() {
    this.loading = true;
    setTimeout(() => {
      this.initMapHighlight();
      setTimeout(() => {
        this.resizeImg();
        this.listenClick();
      }, 100)

    }, 300);
  }

  initMapHighlight() {
    // http://jsfiddle.net/X4mPW/3/
    // https://projects.davidlynch.org/maphilight/docs/
    jQuery(() => {
      var data: any = {};
      jQuery('.map').maphilight();
      data.strokeColor = "ffffff";
      data.strokeWidth = "3";
      data.alwaysOn = false;
      data.fillColor = 'b24332';
      data.fillOpacity = '0.6';
      jQuery('area').data('maphilight', data).trigger('alwaysOn.maphilight');
    });
  }

  resizeImg() {
    const map: HTMLMapElement = document.getElementById('image-map') as HTMLMapElement,
      img: HTMLImageElement = document.getElementById('2dmodel') as HTMLImageElement,
      mainDiv: HTMLDivElement = document.getElementById('main-div') as HTMLDivElement;
    var n,
      areas = map.getElementsByTagName('area'),
      len = areas.length,
      coords: Array<any> = [],
      previousWidth = img.naturalWidth;
    for (n = 0; n < len; n++) {
      coords[n] = areas[n].coords.split(',');
    }
    const resize = function () {
      var n, m, clen,
        x = img.offsetWidth / previousWidth;
      for (n = 0; n < len; n++) {
        clen = coords[n].length;
        for (m = 0; m < clen; m++) {
          coords[n][m] *= x;
        }
        areas[n].coords = coords[n].join(',');
      }
      previousWidth = mainDiv?.clientWidth as number; //document.body.clientWidth;
      return true;
    };
    resize();
  }

  listenClick() {
    const that = this;
    const map: HTMLMapElement = document.getElementById('image-map') as HTMLMapElement,
      areas: HTMLCollectionOf<HTMLAreaElement> = map.getElementsByTagName('area');
    for (var n = 0; n < areas.length; n++) {
      areas[n].removeAttribute('href');
      areas[n].setAttribute('class', areas[n].classList + ' cursor-pointer');
      // areas[n].setAttribute('data-toggle', 'tooltip');
      areas[n].onclick = function (e) {
        e.preventDefault();
        if (e?.target) {
          // alert(e.target['getAttribute']('coords'))
          that.enabledFloor();

        }
      }
      areas[n].onmouseenter = function (e) {
        e.preventDefault();
        var x = e.clientX;
        var y = e.clientY;
        if (e?.target && e.target['childNodes'] && e.target['childNodes'].length && e.target['childNodes'][0].getAttribute('class').includes('ctooltip')) {

        } else if (e?.target) {
          const div = document.createElement('div');
          div.setAttribute('class', 'ctooltip');
          div.innerText = e.target['getAttribute']('title');
          e?.target['appendChild'](div);
          div.style.display = 'block';
          div.style['background-color'] = 'black';
          div.style.position = 'absolute';
          div.style.color = 'white';
          div.style.left = x + "px";
          div.style.top = y + "px";
        }
      }
      areas[n].onmousemove = function (e) {
        e.preventDefault();
        var x = e.clientX;
        var y = e.clientY;
        if (e?.target && e.target['childNodes'] && e.target['childNodes'].length && e.target['childNodes'][0].getAttribute('class').includes('ctooltip')) {
          const div = e.target['childNodes'][0];
          div.style.display = 'block';
          div.style.left = x + "px";
          div.style.top = y + "px";
        }
      }
      areas[n].onmouseleave = function (e) {
        e.preventDefault();
        if (e?.target) {
          if (e?.target && e.target['childNodes'] && e.target['childNodes'].length && e.target['childNodes'][0].getAttribute('class').includes('ctooltip')) {
            const div = e.target['childNodes'][0];
            div.style.display = 'none'
          }
        }
      }
    };
    this.loading = false;

  }


  enabledFloor() {
    this.floorView = true;
    this.enabledTwodModel();
  }

  back() {
    this.floorView = false;
    this.enabledTwodModel();
  }

}


