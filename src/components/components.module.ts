import {NgModule} from '@angular/core';
import {TimerComponent} from './timer/timer';
import {IonicModule} from 'ionic-angular';
import {TimerEditorComponent} from './timer-editor/timer-editor';
import {TimerIntervalComponent} from './timer-interval/timer-interval';
import {ProjectEditorComponent} from './project-editor/project-editor';
import {IntroComponent} from './intro/intro';
@NgModule({
  declarations: [TimerComponent,
    TimerEditorComponent,
    TimerIntervalComponent,
    ProjectEditorComponent,
    IntroComponent],
  imports: [IonicModule],
  entryComponents: [TimerComponent,
    TimerEditorComponent,
    TimerIntervalComponent,
    ProjectEditorComponent,
    IntroComponent
  ],
  exports: [TimerComponent,
    TimerEditorComponent,
    TimerIntervalComponent,
    ProjectEditorComponent,
    IntroComponent]
})
export class ComponentsModule {
}
