import {Component} from '@angular/core';
import {AlertController, NavParams, ViewController} from 'ionic-angular';
import {ProjectModel, ModelProvider, TimerModel} from '../../providers/model/model';

@Component({
  selector: 'project-editor',
  templateUrl: 'project-editor.html'
})
export class ProjectEditorComponent {

  name: string;
  project: ProjectModel;
  timers: TimerModel[];

  constructor(private alertCtrl: AlertController, public viewCtrl: ViewController, private navParams: NavParams, private model: ModelProvider) {
    this.project = this.navParams.data.project;
    this.name = this.project.name;

    this.timers = this.model.getTimers(this.project.name).filter((timer) => {
      return (timer.complete === true);
    });
  }

  dismiss() {

    if (this.name !== this.project.name && this.model.isProjectNameUsed(this.name)) {

      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'This name is already in use',
        buttons: ['Dismiss']
      });
      alert.present();

    }
    else {
      this.project.name = this.name;
      this.model.forceSave();
      this.viewCtrl.dismiss(this.project);

    }
  }

}
