import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from '@ionic-native/keyboard';
import {StatusBar} from '@ionic-native/status-bar';
import {EmailComposer} from '@ionic-native/email-composer';
import {Globalization} from '@ionic-native/globalization';
import {File} from '@ionic-native/file';
import {MomentModule} from 'angular2-moment';
import {IonicStorageModule} from '@ionic/storage';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ComponentsModule} from '../components/components.module';
import {ModelProvider} from '../providers/model/model';
import {ProjectPageModule} from "../pages/project/project.module";
import {SharePageModule} from "../pages/share/share.module";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    ProjectPageModule,
    SharePageModule,
    FormsModule,
    IonicModule.forRoot(MyApp,{
      preloadModules: true
    }),
    IonicStorageModule.forRoot(),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    EmailComposer,
    File,
    Globalization,
    Keyboard,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ModelProvider
  ]
})
export class AppModule {
}
