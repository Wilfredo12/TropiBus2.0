import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ToastController } from 'ionic-angular';
import {Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { RoutesStopsService } from '../../providers/routes-stops-service/routes-stops-service';
import { BusLocation } from '../../providers/bus-location/bus-location';
import L from "leaflet";



@Component({
  selector: 'route',
  templateUrl: 'route.html'
})
export class RoutePage {
  
  map: any;
  route:any;
  stops:any;
  locationMarker:any=null;
  nearbyStopMarker:any=null;
  tempStopMarker:any=null;
  busMarker:any=null;
  count:number=0;
  bus_stopIcon:any;
  bus_icon:any;
  user_icon:any;
  leave:boolean=false;
  

  constructor(public navCtrl: NavController,public params: NavParams,public toastCtrl:ToastController,
  public platform:Platform, public alertCtrl:AlertController, public busLocationService:BusLocation,
  public routes_stops_service:RoutesStopsService,public geolocation:Geolocation,public iab:InAppBrowser) {
    //get route information from constructor

    this.route=params.get("route");
    
  }
  //method that runs when the page is inticialized
  ngOnInit(){
    this.stops=[]
    this.bus_stopIcon = L.icon({
    iconUrl: 'assets/icon/bus_stopIcon.png',
    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
    });
    this.bus_icon = L.icon({
    iconUrl: 'assets/icon/bus.png',  
    iconSize:     [50, 50], // size of the icon
    iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -50] // point from which the popup should open relative to the iconAnchor
    });
    this.user_icon = L.icon({
    iconUrl: 'assets/icon/user_location.png',  
    iconSize:     [50, 50], // size of the icon
    iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -50] // point from which the popup should open relative to the iconAnchor
    });
    this.loadMap();
    
  }
  //method to load leaflet map container and openstreet map tile layer
  loadMap(){

      this.map = L.map('mapid', {
      center: {lat :18.201369, lng:-67.1395037},
      zoom: 13
    });
    

    //Add OSM Layer
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
      .addTo(this.map);
      this.loadRoute();
      this.getStops();  
 
 if(this.route.status=="Active"){
    this.busLocationCycle()
  }
 }
  //method to call backend and retrieved stop information from route, once information is
  //retrieved the method will call the loadStops method
getStops(){
    //todo usar getStops con ruta especifica
    this.routes_stops_service.getStopsFromRoute(this.route.route_id).subscribe(response =>{
        // var tempstops=response.stops;
        // for(var i=0;i<tempstops.length;i++){
        //   if(tempstops[i].route_ID==this.route.route_ID){
        //     this.stops.push(tempstops[i])
        //   }
        // }
        console.log(response)
        this.stops=response;
        //center map on bus stop coordinates
        //this.centerMap(this.stops[0].stop_latitude,this.stops[0].stop_longitude);
        this.loadStops();
  },err => {
        console.log("error status",err.status)
        if(err.status==0){
          this.presentAlert("Error Connecting to Server","Please establish a connection and try again");
        }  
    })
}
//load route to map in the form of a polyline
loadRoute(){
  var polylineOptions = {
               color: this.route.color,
               weight: 6,
               opacity: 1.0
             };

  var polyline = new L.Polyline(this.route.route_path, polylineOptions);
  polyline.addTo(this.map)
  
  //route popup content
  let content= "<h4>"+this.route.route_name+"</h4><p>"+this.route.route_description+"</p>"
  polyline.bindPopup(content)
  this.map.fitBounds(polyline.getBounds());
}
//method to load stops onto map
loadStops(){
    
    for(var i=0;i<this.stops.length;i++){
       
       this.addStop(this.stops[i])          
      
    }
  
}
//add stop marker with pop up
addStop(stop){
   var coords={lat:stop.stop_latitude,lng:stop.stop_longitude}
   let content = "<h4>"+stop.stop_name+"</h4><p>"+stop.stop_description+"</p>";
   let marker=L.marker(coords,{icon: this.bus_stopIcon}).bindPopup(content); 
   this.map.addLayer(marker);
}
//center map to the given latitude and longitude
centerMap(latitude,longitude){
   let latLng = {lat:latitude,lng:longitude};
   this.map.panTo(latLng);
}
//center map relative to bus top coordinate
centerStop(stop){
  //todo highlight stop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //erase nearby stop marker if already created
    //erase location marker if already created
    //erase highlight stop if created
    if(this.locationMarker!=null){
      this.map.removeLayer(this.locationMarker)
      this.locationMarker=null;
    }
    if(this.nearbyStopMarker!=null){
      this.map.removeLayer(this.nearbyStopMarker)
      this.nearbyStopMarker=null;
    }
    if(this.tempStopMarker!=null){
      this.map.removeLayer(this.tempStopMarker)
      this.tempStopMarker=null;
    }
    let latLng = {lat:stop.stop_latitude,lng:stop.stop_longitude};    
    let content = "<h4>"+stop.stop_name+"</h4><p>"+stop.stop_description+"</p>";
    this.tempStopMarker=L.marker(latLng,{icon: this.bus_stopIcon}).bindPopup(content); 
    this.map.addLayer(this.tempStopMarker);
    this.tempStopMarker.openPopup();
    this.map.setView(latLng,15);
    
}
//calculate the nearest bus stop with respect to the users location
nearbyStop(){ 
    //erase nearby stop marker if already created
    //erase location marker if already created
    //erase highlight stop if created
    if(this.locationMarker!=null){
      this.map.removeLayer(this.locationMarker)
      this.locationMarker=null;
    }
    if(this.nearbyStopMarker!=null){
      this.map.removeLayer(this.nearbyStopMarker)
      this.nearbyStopMarker=null;
    }
    if(this.tempStopMarker!=null){
      this.map.removeLayer(this.tempStopMarker)
      this.tempStopMarker=null;
    }
    //get users location
    this.geolocation.getCurrentPosition({timeout:3000, enableHighAccuracy:true}).then((myposition) => {
        //coordinates
        let latitude=myposition.coords.latitude;
        let longitude=myposition.coords.longitude;
        let latLng={lat:latitude,lng:longitude}

        //set up marker with pop up and add to map
        let content = "<h4>Your Location!</h4>";
        this.locationMarker= new L.Marker(latLng,{icon:this.user_icon})
        this.locationMarker.bindPopup(content);
        this.map.addLayer(this.locationMarker)
       
        //get nearbystop coordinates
        let nearbyStopCoordinates= this.getShortestDistance(latitude, longitude);
        console.log("nearby coordinates",nearbyStopCoordinates)

        //set up nearby stop marker with pop up onto map
        let nearbyLatLng={lat:nearbyStopCoordinates.stop_latitude,lng:nearbyStopCoordinates.stop_longitude}
        // let url="https://www.google.com/maps/place/"+nearbyStopCoordinates.stop_latitude+","+nearbyStopCoordinates.stop_longitude
        let content1 = "<h6>"+nearbyStopCoordinates.stop_name+" is the closest bus stop</h6><p>It is <b>"+Math.round(nearbyStopCoordinates.distance * 100) / 100+" </b>meters away from you.";
        this.nearbyStopMarker= new L.Marker(nearbyLatLng,{icon: this.bus_stopIcon})
        this.nearbyStopMarker.bindPopup(content1)
        this.map.addLayer(this.nearbyStopMarker)
        this.nearbyStopMarker.openPopup();        
        this.map.setView(nearbyLatLng,15);
        //this.map.fitBounds([[nearbyLatLng.lat,nearbyLatLng.lng],[latitude,longitude]]);
        //this.map.setZoom(14)
       }, (err) => {
         //if location is not enable present this alert
         this.presentAlert('Location not enable','Please go to location settings and enable location')
    });
 
}
//method to find the closest bus stop with respect to users location
getShortestDistance(lat,lng){
  var shortestDistance=10e10
  var closestCoordinates={stop_latitude:0,stop_longitude:0,stop_name:"None",distance:0};
  //calculate harvesine distance for each stop and filter out the shortest distance
  for(var i=0;i<this.stops.length;i++){
    var stop=this.stops[i]
    var distance=this.harvesineFormula(lat,lng,stop.stop_latitude,stop.stop_longitude)
    if(distance<shortestDistance){
      shortestDistance=distance;
      closestCoordinates=stop;
      closestCoordinates.distance=shortestDistance
    }
  }
  return closestCoordinates;
}
//harvesine formula is use to calculate the distance of two points on the sphere 
//using the latitudes and longitudes of the two points
harvesineFormula(lat1,lon1,lat2,lon2){
  //reference for javascript code online
  //http://www.movable-type.co.uk/scripts/latlong.html 
  //phi is latitude
  //lambda are longitudes
  var R = 6371e3; // metres
  var phi1 = this.toRad(lat1);
  var phi2 = this.toRad(lat2);
  var delta_phi = this.toRad(lat2-lat1);
  var delta_lambda = this.toRad(lon2-lon1);

  var a = Math.sin(delta_phi/2) * Math.sin(delta_phi/2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(delta_lambda/2) * Math.sin(delta_lambda/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var distance = R * c;
  return distance
}
//fetch bus location every 10 seconds for now just simulation
busLocationCycle(){
    console.log("entre al location cycle")
        if(this.busMarker!=null){
          this.map.removeLayer(this.busMarker)
          this.busMarker=null;
        }
        this.busLocationService.getBusLocation(this.route.route_id).subscribe(response=>{
            if(response.length!=0){
                for(var i=0;i<response.length;i++){
                  console.log(response[i])
                    let latLng = {lat:response[i].gps_latitude,lng:response[i].gps_longitude};    
                    let content = "<h4>Bus Name: </h4>"+response[i].bus_name+"<h4>Bus Status: </h4>"+response[i].bus_status;
                    this.busMarker=L.marker(latLng,{icon: this.bus_icon}).bindPopup(content); 
                    this.map.addLayer(this.busMarker);
                }       
            }
              },err => {
            console.log("error status",err.status)
            if(err.status==0){
              this.presentToast("Could not get bus location");
            }  
          })

           
    setTimeout(()=>{
      if(this.route.status&&!this.leave) this.busLocationCycle();
    },5000);
  }
  //gettingDirections for nearest stop
  getDirections(){
      let options ='location=yes,toolbar=yes,hidden=no';
      let url="https://www.google.com/maps/place/"+this.nearbyStopMarker.getLatLng().lat+","+this.nearbyStopMarker.getLatLng().lng;
      this.platform.ready().then(() => {
      const browser =this.iab.create(url, "_system", options);
        });   
  }
  // viewStopOnBrowser(stop){
  //   // console.log("entre a la parada",stop)
  //   let options ='location=yes,toolbar=yes,hidden=no';
  //   //https://www.google.com/maps/preview/@-15.623037,18.388672,8z=
  //   //http://www.google.com/maps/place/49.46800006494457,17.11514008755796
  //   let url="https://www.google.com/maps/place/"+stop.stop_latitude+","+stop.stop_longitude;
  //   //let url="https://www.google.com.pr/maps/place/@"+stop.stop_latitude+","+stop.stop_longitude
  //   this.platform.ready().then(() => {
  //     //const browser =
  //           new InAppBrowser(url, "_system", options);
  //       });   
   
  // }
//change from degrees to radians
toRad(degrees) {
    return degrees * Math.PI / 180;
}
//method to present alert to user using ionics alert controller
presentAlert(title,subTitle){
let alert = this.alertCtrl.create({
                title: title,
                subTitle: subTitle,
                buttons: ['Dismiss']
              });
alert.present();
}
presentToast(message) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: 'middle'
  });
  toast.present();
}

ionViewDidLeave(){
  this.leave=true;
}

}
