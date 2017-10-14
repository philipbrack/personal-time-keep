import {Component} from '@angular/core';

import {AlertController, NavParams, ViewController} from 'ionic-angular';
import {TimerModel, ModelProvider, ProjectModel} from '../../providers/model/model';

@Component({
  selector: 'timer-editor',
  templateUrl: 'timer-editor.html'
})
export class TimerEditorComponent {
  timer: TimerModel;
  availProjects: ProjectModel[];
  origName: string;
  project: ProjectModel;
  name: string;

  constructor(private alertCtrl: AlertController, public viewCtrl: ViewController, private navParams: NavParams, private model: ModelProvider) {
    this.timer = this.navParams.data.timer;
    this.name = this.timer.title;

    this.origName = this.name;

    this.project = this.timer.project;

    model.projectsObservable.subscribe((l) => {
      this.availProjects = l;
    });

  }

  delete(ti) {
    let res = this.timer.intervals.filter((item) => {
      return !(item.start == ti.start && item.end == ti.end);
    });
    this.timer.intervals = res;
  }

  dismiss() {
    if (this.name != this.origName && this.model.isTimerNameUsed(this.name)) {

      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'This name is already in use',
        buttons: ['Dismiss']
      });
      alert.present();
    }
    else {
      this.timer.title = this.name;
      this.timer.project = this.project;
      this.model.forceSave();
      this.viewCtrl.dismiss(this.timer);
    }
  }

}
