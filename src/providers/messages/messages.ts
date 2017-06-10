import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class Messages {

  constructor(public http: Http) {
    console.log('Hello Messages Provider');
  }
getMessages(){
   //let url="assets/data/messages.json"
   let url="https://evening-crag-15118.herokuapp.com/timuserRoutes/getMessages"
    return this.http.get(url)
        .map(res =>res.json());
  }
}
