import { Component } from '@angular/core';
import { NavController,AlertController, LoadingController } from 'ionic-angular';
import { RoutePage } from '../route/route';
import { RoutesStopsService } from '../../providers/routes-stops-service/routes-stops-service';

@Component({
  selector: 'routes_stops',
  templateUrl: 'routes&stops.html'
})
export class Routes_StopsPage {

  routes: any;

  constructor(public navCtrl: NavController, public alertCtrl:AlertController, public routeService:RoutesStopsService,public loading:LoadingController ) {

  }
  //method called when page is initialized
  //it will retrieved all bus routes information
  ngOnInit(){
    let loading = this.loading.create({
    content: 'Fetching Routes...'
    });
    loading.present()
    this.routeService.getRoutes().subscribe(response =>{
        this.routes=response;
        loading.dismiss();
        console.log(response)
  },err => {
        console.log("error status",err.status)
        if(err.status==0){
          loading.dismiss();
          this.presentAlert("Error Connecting to Server","Please establish a connection and try again");
        }  
    })
}
//method to display description of route using the alert controller
  viewDescription(route){
    let alert = this.alertCtrl.create({
    title: route.route_name,
    subTitle: route.route_description,
    buttons: ['OK']
  });
  alert.present();
}
//method to change page to view especific route
  viewRoute(route){
     this.navCtrl.push(RoutePage,{
          route:route
      });
  }
  //refreshRoutes
  refreshRoutes(refresher) {
     this.routeService.getRoutes().subscribe(response =>{
        refresher.complete();
        this.routes=response;        
        console.log(response)
  },err => {
        console.log("error status",err.status)
        refresher.complete();
        if(err.status==0){          
          this.presentAlert("Error Connecting to Server","Please establish a connection and try again");
        }  
    })
  }
  //method to change the color of the bus status
  getStatus(status){
    if(status=="Active"){
      return "secondary"
    }
    else if(status == "Inactive"){
      return "danger"
    }
    else return "dark"
  }
  presentAlert(title,subTitle){
    let alert = this.alertCtrl.create({
                    title: title,
                    subTitle: subTitle,
                    buttons: ['Dismiss']
                  });
    alert.present();
    }

}
