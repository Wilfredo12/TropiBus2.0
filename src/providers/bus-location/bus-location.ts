import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BusLocation provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BusLocation {

  constructor(public http: Http) {
    console.log('Hello BusLocation Provider');
  }
  getBusLocation(routeID){
    let url="http://localhost:8080/timuserRoutes/getBusLocation?route_id="+routeID
    //let url="https://evening-crag-15118.herokuapp.com/timuserRoutes/getBusLocation?route_id="+routeID
    return this.http.get(url).map(res=>res.json())
  }

}
