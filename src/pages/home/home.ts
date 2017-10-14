import {Component} from '@angular/core';
import {ActionSheetController, AlertController, ModalController, NavController} from 'ionic-angular';
import {ModelProvider} from '../../providers/model/model'
import {ProjectPage} from '../../pages/project/project';
import {SharePage} from '../../pages/share/share';
import {Storage} from '@ionic/storage';
import {IntroComponent} from "../../components/intro/intro";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController, private modalCtrl: ModalController, public model: ModelProvider, public navCtrl: NavController, private storage: Storage) {

  }

  ionViewDidLoad() {

    this.storage.get('previouslyUsedApp').then((val) => {
      if (!val) {
        // if false,undefined or null..
        this.storage.set('previouslyUsedApp', true);

        let m = this.modalCtrl.create(IntroComponent);
        m.present();

      }
    });

  }

  addTimer() {

    let alert = this.alertCtrl.create({
      title: 'New Timer',
      inputs: [
        {
          name: 'title',
          placeholder: 'Timer 1'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Add',
          handler: data => {
            let timer = this.model.createTimer(data.title);
            if (!timer) {
              this.alertCtrl.create({
                title: 'Info',
                subTitle: 'Cannot use an existing name',
                buttons: ['Dismiss']
              }).present();
            }

          }
        }
      ]
    });
    alert.present();
  }

  presentAction() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'MENU',
      cssClass: 'home-action-sheet',
      buttons: [
        {
          text: 'SHARE',
          handler: () => {
            this.navCtrl.push(SharePage);
          }
        }, {
          text: 'MANAGE PROJECTS',
          handler: () => {
            this.navCtrl.push(ProjectPage);
          }
        }, {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }
}
