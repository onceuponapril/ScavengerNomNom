import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { UserPage } from '../user/user';

import { UserDataProvider } from '../../providers/user-data/user-data';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  home:any = HomePage;
  user:any = UserPage;

  constructor(public navCtrl: NavController,public userDataService: UserDataProvider) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad TabsPage');
  // }
  

 }
