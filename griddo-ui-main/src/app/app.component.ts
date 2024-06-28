import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'griddo';
  constructor() {
    const tabs: Array<number> = JSON.parse(localStorage?.getItem('tab') || '[]');
    tabs.push(tabs.length);
    localStorage?.setItem('tab',JSON.stringify(tabs));

    // window.onbeforeunload = () => {
    //   alert('onbeforeunload');
    // }

    // window.onunload = () => {
    //   alert('onunload');
    // }
  }
}
