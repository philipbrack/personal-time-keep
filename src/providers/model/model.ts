import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Storage} from '@ionic/storage';
import {Platform} from 'ionic-angular';
import {EmailComposer} from '@ionic-native/email-composer';
import {Globalization} from '@ionic-native/globalization';
import {File} from '@ionic-native/file';
import * as moment from 'moment' ;

export class TimerMeta {
  constructor(public key: string, public val: string) {

  }
}
export class TimeRange {
  constructor(public start: number, public end: number) {

  }

}
export class TimerModel {


  constructor(public id: number, public intervals: TimeRange[], public title: string, public metas: TimerMeta[], public project: ProjectModel, public complete: boolean) {

  }

  resume() {
    this.intervals.push(new TimeRange(Date.now(), Date.now()));

  }

  pause() {
    this.intervals[this.intervals.length - 1].end = Date.now();
  }

  getDurationInSeconds() {
    return this.getDurationMilli() / 1000;
  }

  twoDigit(number) {
    var twodigit = number >= 10 ? number : "0" + number.toString();
    return twodigit;
  }

  getDurationString() {
    let total = this.getDurationMilli();
    let remainder = 0;
    let h = Math.floor(total / 3600000);

    remainder = (h == 0) ? total : (total - (h * 3600000));

    let m = Math.floor(remainder / 60000);

    remainder = (m == 0) ? remainder : (remainder - (m * 60000));

    let s = Math.round(remainder / 1000);

    return this.twoDigit(h) + ':' + this.twoDigit(m) + ':' + this.twoDigit(s);


  }

  private getDurationMilli() {

    let total: number = 0;
    for (let i = 0; i < this.intervals.length; i++) {
      total += (this.intervals[i].end - this.intervals[i].start);
    }

    return total;
  }

}

export class ProjectModel {
  constructor(public name: string) {

  }
}

@Injectable()
export class ModelProvider {
  projects: ProjectModel[];
  timers: TimerModel[];
  public locale: string;

  private timersSubject: BehaviorSubject<TimerModel[]> = new BehaviorSubject([]);
  private projectsSubject: BehaviorSubject<ProjectModel[]> = new BehaviorSubject([]);

  get timersObservable(): Observable<TimerModel[]> {
    return this.timersSubject.asObservable();
  }

  get projectsObservable(): Observable<ProjectModel[]> {
    return this.projectsSubject.asObservable();
  }

  constructor(private emailComposer: EmailComposer, private file: File, private globalization: Globalization, private platform: Platform, private storage: Storage) {
    this.projects = [];
    this.timers = [];

    this.platform.ready().then(() => {

      this.globalization.getLocaleName()
        .then((res) => {
          this.locale = res.value;
        })
        .catch(err => console.error(err));

      this.platform.pause.subscribe(() => {
        // this does not fire upon app closing.
        this.forceSave();
      });

      // because I need to remember time at moment of closing
      // and there are no ios Events I am forced to use a periodic
      // function.
      //https://forum.ionicframework.com/t/ios-call-storage-set-when-app-closes/104223
      setInterval(() => {
        this.forceSave();
      }, 5000);


      storage.ready().then(() => {
        Promise.all([
          storage.get('projects'),
          storage.get('timers')]).then((values) => {
          if (values[0]) {
            for (let element of values[0]) {
              this.projects.push(new ProjectModel(element.name));
            }
          } else {
            this.projects.push(new ProjectModel('None'));
          }

          this.updateProjectObservable();

          if (values[1]) {
            for (let element of values[1]) {
              this.timers.push(new TimerModel(element.id, element.intervals, element.title, element.metas, element.project, element.complete));
            }
          }
          this.updateTimersObservable();
        });
      });

    });

  }

  createProject(name: string): boolean {
    let project = new ProjectModel(name);

    let exists = false;

    for (let item of this.projects) {
      if (item.name === name) {
        exists = true;
      }
    }
    if (!exists) {
      this.updateProjectObservable();
      this.projects.push(project);
      return true;
    }
    return false;

  }


  createTimer(name: string): TimerModel {

    //verify it doesn't already exist.
    for (let t of this.timers) {
      if (t.title === name) {
        return null;
      }
    }

    var id = Math.floor(Math.random() * 1E16);
    let timer = new TimerModel(id, [], name, [], this.projects[0], false);
    this.timers.push(timer);
    this.updateTimersObservable();
    return timer;
  }

  completeTimer(timer: TimerModel) {
    timer.complete = true;
    this.updateTimersObservable();
  }

  deleteTimer(timer: TimerModel) {
    let res = this.timers.filter((item) => {
      return item.id != timer.id;
    });

    this.timers = res;
    this.updateTimersObservable();
  }

  deleteProject(project: ProjectModel) {
    let projects2 = this.projects.filter((item) => {
      return item.name != project.name;
    });


    let timers2 = this.timers.filter((item) => {
      return item.project.name != project.name;
    });

    this.projects = projects2;
    this.timers = timers2;

    this.updateProjectObservable();
  }

  getTimer(tId: number): TimerModel {
    return this.timers.find(timer => timer.id == +tId);
  }


  buildCsvWithIntervals(project: ProjectModel) {
    let content: string = 'Timer Summary for project: ' + project.name +
      '\ntitle,total duration,interval duration in seconds,start,end,\n';

    for (let timer of this.timers) {
      if (timer.project.name === project.name) {
        for (let interval of timer.intervals) {
          // removing the last 5 digits since not sure what they are.
          let formattedStart = moment(new Date(interval.start).toISOString()).locale('en').format().slice(0, -5);
          let formattedEnd = moment(new Date(interval.end).toISOString()).locale('en').format().slice(0, -5);

          let currentDuration = (interval.end - interval.start) / 1000;

          content = content + timer.title + ',' + timer.getDurationString() +
            ',' + currentDuration + ',' + formattedStart +
            ',' + formattedEnd;
          content += ',\n'
        }
      }
    }

    return content;
  }

  buildCsvWithoutIntervals(project: ProjectModel) {
    let content: string = 'Timer Summary for project: ' + project.name +
      '\ntitle,total duration,total duration in seconds\n';

    for (let timer of this.timers) {
      if (timer.project.name === project.name) {
        content = content + timer.title + ',' + timer.getDurationString() +
          ',' + timer.getDurationInSeconds();
        content += ',\n'
      }
    }

    return content;
  }

  email(project: ProjectModel, emailAddr: string, isDetailed: boolean) {

    let content: string = '';

    if (isDetailed) {
      content = this.buildCsvWithIntervals(project);
    } else {
      content = this.buildCsvWithoutIntervals(project);
    }


    this.file.writeFile(this.file.dataDirectory, project.name + '.csv', content, {replace: true})
      .then(() => {
        let email = {
          to: emailAddr,
          attachments: [
            this.file.dataDirectory + project.name + '.csv'
          ],

          subject: 'TimeKeepFree Project:' + project.name,
          body: 'Attached is the csv file you requested in-app.  Open in Excel or Sheets to see formatted',
          isHtml: true
        };
        this.emailComposer.open(email);

      })
      .catch((err) => {
        console.error(err);
      });


  }

  getTimers(projName: string) {
    return this.timers.filter((item) => {
      return item.project.name === projName;
    });
  }

  forceSave() {
    this.storage.set('projects', this.projects);
    this.storage.set('timers', this.timers);

  }

  isProjectNameUsed(name: string): boolean {
    for (let p of this.projects) {
      if (p.name === name) {
        return true;
      }
    }
    return false;
  }

  isTimerNameUsed(title: string): boolean {
    for (let t of this.timers) {
      if (t.title === title) {
        return true;
      }
    }
    return false;
  }


  private updateProjectObservable() {
    this.forceSave();
    this.projectsSubject.next(this.projects);

  }

  private updateTimersObservable() {
    this.forceSave();
    // did this because I am using async as a pipe. Wasn't sure
    // how to do this properly.
    this.timersSubject.next(this.timers.filter((item) => {
      return item.complete == false;
    }));
  }

}
