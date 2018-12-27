import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PostDataProvider } from "../../providers/post-data/post-data";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UserPage } from '../user/user';
import { Location } from '../../models/location'

// import { UserDataProvider } from "../../providers/user-data/user-data";
// import { PostManager } from "../../models/postManager";
//
// /**
//  * Generated class for the EditPage page.
//  *
//  * See https://ionicframework.com/docs/components/#navigation for more info on
//  * Ionic pages and navigation.
//  */
//
const PLACEHOLDER_IMAGE: string = "../../assets/imgs/placeholder.png";
declare var google;
@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {
  private postKey: string;
  private post:any;
  private image: string;
  private location: Location;
  private roomNumber = "";
  // google map api
  private GoogleAutocomplete:any;
  private autocompleteInput = "";
  private geocoder: any;
  private autocompleteItems: Array<object>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public postDataService:PostDataProvider,
              public camera: Camera) {
      this.postKey = this.navParams.get("postKey");
      // console.log(key);
      this.post = this.postDataService.getPost(this.postKey);
      this.image = this.post.getPostImage();
      this.location = this.post.getLocation();
      if (this.location != undefined){
        this.roomNumber = this.location.getRoomNumber();
      }
      this.autocompleteInput = this.location.getDescription();
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.geocoder = new google.maps.Geocoder;
      this.autocompleteItems = [];
  }

  ionViewDidLoad() {
    // console.log(this.key);

  }

  update() {
    // this.post.setPostImage(this.image);
    this.location.setDescription(this.autocompleteInput);
    this.location.setRoomNumber(this.roomNumber);
    this.post.setLocation(this.location);
    this.postDataService.updatePost(this.postKey);
    this.navCtrl.pop();
  }

  delete(){
    console.log(this.post);
    this.postDataService.removePost(this.post);
    console.log(this.navCtrl.length());
    if (this.navCtrl.length() > 2) {
      this.navCtrl.remove(this.navCtrl.getPrevious().index);
    }
    this.navCtrl.pop();
  }

  private takePic(){
    console.log('triggered');
    const options: CameraOptions = {
      quality: 13,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      if (imageData) {
        // this.post.setPostImage('data:image/jpeg;base64,' + imageData);
        this.image = 'data:image/jpeg;base64,' + imageData;
      }
     }, (err) => {
      //  this.post.setPostImage(PLACEHOLDER_IMAGE);
       this.image = PLACEHOLDER_IMAGE;
       console.log(err);
     });
  }

  private clearImage(): void {
    this.image = "";
  }

  private updateSearchResults(): void {
    // From: https://ionicthemes.com/tutorials/about/ionic-2-google-maps-google-places-geolocation
    if (this.autocompleteInput == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocompleteInput },
    (predictions, status) => {
      this.autocompleteItems = [];
      if (predictions != null){
      predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
    }
    });
  }

  private selectPlace(place: any):void {
    this.autocompleteItems = [];
    this.geocoder.geocode({'placeId': place.place_id}, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.location = new Location(place.description, "", results[0].geometry.location.lat(), results[0].geometry.location.lng());
        this.autocompleteInput = place.description;
      }
    });

  }
  private startSearch():void {
    this.autocompleteItems = [];
    this.autocompleteInput = "";
    this.location = new Location();
  }
  private endSearch():void {
    this.autocompleteItems = [];
    if (this.location.isNew()){
      this.location = new Location(this.autocompleteInput, "", null, null);
    }
  }

}
