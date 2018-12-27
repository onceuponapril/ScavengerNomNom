import { Component } from '@angular/core';
import { NavController, Checkbox } from 'ionic-angular';
import { Post } from '../../models/post';
// import { PostManager } from '../../models/postManager';
import { PostDetailPage } from '../post-detail/post-detail';
import { EditPage } from '../edit/edit';
import { ViewDetailPage } from '../view-detail/view-detail';
import { PostDataProvider } from "../../providers/post-data/post-data";
import { UserDataProvider } from "../../providers/user-data/user-data";
import { TabsPage } from '../tabs/tabs';
import { LocationDataProvider } from "../../providers/location-data/location-data";
import { Geoposition } from '@ionic-native/geolocation'; 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private postList: Post[];
  private user: any;
  private userId:string;
  private filteredList: Post[];
  private userPostList: Post[];
  public aColor: string = "#f9f9f9";
  private currentLat: number;
  private currentLon: number;
  private sortBy = "newest";
  constructor(public navCtrl: NavController,
    private postDataService: PostDataProvider,
    private userDataService: UserDataProvider,
    private locationDataService: LocationDataProvider) {
    this.postDataService.getPostObservable().subscribe( postList => {
      this.postList = postList;
      this.filteredList = this.postList;
      this.sortPost();
      this.locationDataService.getCurrentLocation();
    });
    this.postList = this.postDataService.getPostList();
    this.userId = this.userDataService.getUserId();
    this.postDataService.getUserPostListObservable().subscribe( userPostList => {
      this.userPostList = userPostList });
    this.filteredList = this.postList;
    this.locationDataService.getObservable().subscribe(newLocation => {
      if (newLocation === undefined || this.filteredList === undefined){
        return
      }
      this.currentLat = newLocation.coords.latitude;
      this.currentLon = newLocation.coords.longitude;
      for (var i = 0; i < this.filteredList.length; i++){
        let distance = this.filteredList[i].getLocation().calculateDistance(this.currentLat, this.currentLon);
        this.filteredList[i].setDistance(distance);
      }
      console.log("Location refreshed " + this.filteredList);
    });
  }

  ngOnInit() {
    this.postList = this.postDataService.getPostList();
    this.userId = this.userDataService.getUserId();

  }
  ionViewDidLoad(){
    this.sortPost();
    this.locationDataService.getCurrentLocation();
  }
  addPost() {
    this.navCtrl.push(PostDetailPage);
  }

  editPost(key:string){
    this.navCtrl.push(EditPage,{"postKey":key});
  }

  viewPost(postKey: string) {
    this.navCtrl.push(ViewDetailPage, {"postKey": postKey});
  }

  sortPost(){
    // newest, expiration, distance
    if (this.sortBy == "newest"){
      this.filteredList.sort(function(a,b){
        return b.getOriginalTimestamp() - a.getOriginalTimestamp();
      });
    } else if (this.sortBy == "expiration") {
      this.filteredList.sort(function(a,b){
        if (new Date(Date.parse(a.getExpiration())).getTime() < Date.now()){
          return 1;
        } else if (new Date(Date.parse(b.getExpiration())).getTime() < Date.now()){
          return -1;
        }
        return new Date(Date.parse(a.getExpiration())).getTime() - new Date(Date.parse(b.getExpiration())).getTime();
      });
    } else if (this.sortBy == "distance") {
      this.filteredList.sort(function(a,b){
        // console.log(b.expiration)
        if (a.getDistance() == null) { return 1; }
        if (b.getDistance() == null) { return -1; }
        return a.getDistance() - b.getDistance();
      });
    }
}

  filterPost(cbox:Checkbox){
    if (cbox.checked != true){
      this.filteredList = this.postList
    } else{
      this.filteredList = this.postList.filter((post) => {
        return Date.parse(post.getExpiration()) > Date.now();
      });
    }
  }

}
