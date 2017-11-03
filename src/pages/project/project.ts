import {Component} from '@angular/core';
import {AlertController, IonicPage, ItemSliding, ModalController} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {ModelProvider, ProjectModel} from '../../providers/model/model';
import {ProjectEditorComponent} from '../../components/project-editor/project-editor';

@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage {
  newProject: string;

  constructor(private alertCtrl: AlertController, private keyboard: Keyboard, private modalCtrl: ModalController, public model: ModelProvider) {
    this.newProject = '';
  }

  addProject() {
    if (!this.model.createProject(this.newProject)) {

      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'Cannot add a project which already exists',
        buttons: ['Dismiss']
      });
      alert.present();
    }
    this.keyboard.close();
    this.newProject = '';
  }

  delete(project: ProjectModel, item: ItemSliding) {
    item.close();
    if (project.name === 'None') {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'Cannot delete this project',
        buttons: ['Dismiss']
      });
      alert.present();
      item.close();
      return;
    }


    let youSureAlert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: 'Removing a project removes all assigned timers as well',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Remove',
          handler: data => {
            this.model.deleteProject(project);
          }
        }
      ]
    });
    youSureAlert.present();
  }

  edit(proj: ProjectModel, slidingItem: ItemSliding) {
    if (proj.name === 'None') {
      let alert = this.alertCtrl.create({
        title: 'Info',
        subTitle: 'Cannot edit this project',
        buttons: ['Dismiss']
      });
      alert.present();
      slidingItem.close();
      return;
    }
    let m = this.modalCtrl.create(ProjectEditorComponent, {project: proj});
    m.onDidDismiss(data => {
    });
    m.present();
    slidingItem.close();
  }
}
