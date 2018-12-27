import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
/*
  Generated class for the LocationDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationDataProvider {
  private locationObservable: Observable<Geoposition>;
  private locationObserver: Observer<Geoposition>;
  private options : GeolocationOptions;
  private currentPos : Geoposition;
  constructor(private geolocation : Geolocation) {
    this.locationObservable = Observable.create(observer => {
      this.locationObserver = observer;
    });
    this.options = {
        enableHighAccuracy : true
    };
    this.getCurrentLocation();
  }

  public getCurrentLocation() {
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

      this.currentPos = pos;
      console.log("here");
      this.notifySubscribers();
    },(err : PositionError)=>{
      console.log("error : " + err.message);
      this.notifySubscribers();
    });
  }

  public getObservable(): Observable<Geoposition>{
    return this.locationObservable;
  }
  private notifySubscribers(): void {
    this.locationObserver.next(this.currentPos);
  }
}
