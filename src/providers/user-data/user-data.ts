import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';
import firebase from 'firebase';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/*
  Generated class for the UserDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserDataProvider {
  // @ViewChild('myNav') nav: NavController;
  private serviceObserver: Observer<string>;
  private clientObservable: Observable<string>;
  private user: any;


  constructor() {
    this.user = firebase.auth().currentUser;
    this.clientObservable = Observable.create(observerThatWasCreated => {
      this.serviceObserver = observerThatWasCreated;
    });
    firebase.auth().onAuthStateChanged(user => this.validateUser(user));
  }

  public getObservable(): Observable<string> {
    return this.clientObservable;
  }

  private notifySubscribers(authenticated: string): void{
    // "success" or error message
    this.serviceObserver.next(authenticated);
  }

  public createAccount(email: string, password: string, username:string):void {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(
      user => this.updateUserName(user.user, username)
    ).catch(
      (error) => this.notifySubscribers(error.message)
    );

  }

  public logIn(email: string, password: string):void {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(
      error =>this.notifySubscribers(error.message)
    );

  }
  public  logOut() : void{
      firebase.auth().signOut().catch(
        error =>this.notifySubscribers(error.message)
       );
    }

  public getUserName():string {
    if (this.user){
      return this.user.displayName;
    }
  }

  public getUserId():string {
    if (this.user){
      return this.user.uid;
    }
  }

  public updateUserName(user:any, username:string):void {
    if (!user){
      return;
    }
    user.updateProfile({
      displayName: username
    }).then(
      // Update successful.
      this.validateUser(user)
    );
  }
  private validateUser(user):void {
    if (user) {
      // User is signed in.
      this.notifySubscribers("success");
      this.user = user;
      console.log(this.user);
    } else {
      // No user is signed in.
      this.notifySubscribers("");
      this.user = null;
    }
  }


}
