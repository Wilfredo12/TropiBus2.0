import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { MapOverviewPage } from '../mapOverview/mapOverview';
import { Routes_StopsPage } from '../routes&stops/routes&stops';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MapOverviewPage;
  tab2Root: any = Routes_StopsPage;
  tab3Root: any = AboutPage;

  constructor() {

  }
}
