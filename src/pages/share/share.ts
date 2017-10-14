import {Component} from '@angular/core';
import {AlertController, NavController, IonicPage} from 'ionic-angular';
import {ModelProvider, ProjectModel} from '../../providers/model/model';

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {
  availProjects: ProjectModel[];
  project: ProjectModel;
  email: string;

  constructor(private alertCtrl: AlertController, private model: ModelProvider, public navCtrl: NavController) {


    model.projectsObservable.subscribe((l) => {
      this.availProjects = l;
      this.project = this.availProjects[0];
    });
  }

  send() {

    if (!this.project) {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'Please select a project',
        buttons: ['Dismiss']
      });
      alert.present();
      return;
    }


    let shareAlert = this.alertCtrl.create({
      title: 'Report Type',
      subTitle: 'Detailed report includes intervals',
      buttons: [
        {
          text: 'Summary',
          handler: data => {
            this.model.email(this.project, this.email, false);
            this.navCtrl.pop();
          }
        },
        {
          text: 'Detailed',
          handler: data => {
            this.model.email(this.project, this.email, true);
            this.navCtrl.pop();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        }
      ]
    });
    shareAlert.present();

  }

}
