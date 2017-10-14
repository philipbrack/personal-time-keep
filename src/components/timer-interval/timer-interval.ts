import {Component, Input} from '@angular/core';
import {TimeRange} from '../../providers/model/model';
import * as moment from 'moment';

@Component({
  selector: 'timer-interval',
  templateUrl: 'timer-interval.html'
})
export class TimerIntervalComponent {
  start: string;
  end: string;
  changeTime: boolean;
  range: TimeRange;


  @Input() set rangeObj(r: TimeRange) {
    this.range = r;

    // I am not totally sure why this is going to go to locale zone...
    this.start = moment(new Date(r.start).toISOString()).locale('en').format();
    this.end = moment(new Date(r.end).toISOString()).locale('en').format();
  };

  constructor() {
    this.changeTime = false;
  }

  ngOnInit() {
  }

  update() {

    // put in milliseconds.
    this.range.start = 1000 * moment(this.start).unix();
    this.range.end = 1000 * moment(this.end).unix();

  }

}
