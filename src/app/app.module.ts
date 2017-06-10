import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { TabsPage } from '../pages/tabs/tabs';
import { MapOverviewPage } from '../pages/mapOverview/mapOverview';
import { Routes_StopsPage } from '../pages/routes&stops/routes&stops';
import { RoutePage } from '../pages/route/route';
import { AltRoutePage } from '../pages/alt-route/alt-route';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BusLocation } from '../providers/bus-location/bus-location';
import { Messages } from '../providers/messages/messages';
import { RoutesStopsService } from '../providers/routes-stops-service/routes-stops-service';
import {Geolocation} from '@ionic-native/geolocation';
import { HttpModule} from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AltRoutePage,
    MapOverviewPage,
    Routes_StopsPage,
    RoutePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    MapOverviewPage,
    AltRoutePage,
    Routes_StopsPage,
    RoutePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BusLocation,
    Messages,
    Geolocation,
    InAppBrowser,
    RoutesStopsService
  ]
})
export class AppModule {}
