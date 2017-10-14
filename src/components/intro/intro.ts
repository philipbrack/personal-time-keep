import {Component} from '@angular/core';

import {ViewController} from 'ionic-angular';

@Component({
  selector: 'intro',
  templateUrl: 'intro.html'
})
export class IntroComponent {

  text: string;

  constructor(public viewCtrl: ViewController) {
  }

  dismiss() {

    this.viewCtrl.dismiss();
  }

}
