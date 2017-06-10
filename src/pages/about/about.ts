import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Messages } from '../../providers/messages/messages';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  messages:any;
  constructor(public navCtrl: NavController,public messageService:Messages,public alertCtrl:AlertController) {
    //when initialized called get messages
    this.getMessages();
  }
  //method to ge all the messages from the backend
  getMessages(){
    
    this.messageService.getMessages().subscribe(response =>{
        console.log("mensajes",response)
        this.messages=response;
        
        console.log(response)
  },err => {
        console.log("error status",err.status)
        if(err.status==0){
         this.presentAlert("Error Connecting to Server","Please establish a connection and try again");
        }  
    })
  }
  presentAlert(title,subtitle){
    let alert = this.alertCtrl.create({
            title: title,
            subTitle: subtitle,
            buttons: ['Dismiss']
          });
    alert.present();
  }
}
