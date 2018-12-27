import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register'
import { UserDataProvider } from '../../providers/user-data/user-data';
import { HomePage } from '../home/home'
import { EditPage } from '../edit/edit';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private email:string = "";
  private password:string = "";
  private errorMsg:string = "";
  home:any = HomePage;
  edit:any = EditPage;
  tabs:any = TabsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
            private userDataService: UserDataProvider) {
    this.userDataService.getObservable().subscribe(update=> {
      this.getMessage(update);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private register():void {
    this.navCtrl.push(RegisterPage);
  }

  private login():void {
    if (this.email == "" || this.password == ""){
      this.errorMsg = "Some fields are missing."
      return;
    }
    this.userDataService.logIn(this.email, this.password);
  }


  private getMessage(msg: string):void {
    if (msg != "success"){
      this.errorMsg = msg;
    } else {
      this.navCtrl.setRoot(TabsPage);
    }
  }

}
