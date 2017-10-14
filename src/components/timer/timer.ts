import {Component, Input} from '@angular/core';
import {TimerModel, ModelProvider} from '../../providers/model/model'
import {AlertController, ItemSliding, ModalController} from 'ionic-angular';
import {TimerEditorComponent} from '../timer-editor/timer-editor';

@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class TimerComponent {
  @Input()
  set timerId(id: number) {
    this.timerObj = this.model.getTimer(id);
    this.title = this.timerObj.title;
  }

  isPaused: boolean;
  timerObj: TimerModel;
  title: string;
  duration: string;


  constructor(private model: ModelProvider, private modalCtrl: ModalController, private alertCtrl: AlertController) {
    this.title = '';
    this.isPaused = false;

  }

  ngAfterContentInit() {
    // https://github.com/ionic-team/ionic/issues/12950
    setTimeout(() => {
      this.isPaused = true;
    }, 0);
  }

  togglePause() {
    if (this.isPaused) {
      this.timerObj.resume();
      this.duration = '';
    } else {
      this.timerObj.pause();
      this.duration = this.timerObj.getDurationString();
    }

    this.isPaused = !this.isPaused;

  }

  complete() {
    this.model.completeTimer(this.timerObj);
  }

  delete(slidingItem: ItemSliding) {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: data => {
            slidingItem.close();
          }
        },
        {
          text: 'Yes',
          handler: data => {
            this.model.deleteTimer(this.timerObj);
          }
        }
      ]
    });
    alert.present();
  }

  edit(slidingItem: ItemSliding) {
    if (!this.isPaused) {
      this.timerObj.pause();
      this.isPaused = true;
    }
    let m = this.modalCtrl.create(TimerEditorComponent, {timer: this.timerObj});
    m.onDidDismiss(data => {
      this.timerObj = data;
      this.title = this.timerObj.title;
      this.duration = this.timerObj.getDurationString();
    });
    m.present();
    slidingItem.close();

  }

}
