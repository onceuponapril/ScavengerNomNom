import { Comment } from './comment';
import { Location } from './location';
import * as moment from 'moment';



export class Post {
  private key: string;
  private title: string;

  private location: Location;
  private timestamp: string;
  private expiration: string;

  private description: string;
  private image: string;
  private userId: string;
  private userName: string;
  private comments: Object = {};

  // temp
  private distance: number = null;



  public constructor ( key: string,
                       title: string,
                       location: any,
                       timestamp: string,
                       expiration: string,
                       description: string,
                       image: string,
                       userId:string,
                       userName: string) {
    this.key = key;
    this.title = title;
    this.location = location;
    this.timestamp = timestamp;
    this.expiration = expiration;
    this.description = description;
    // if (images.length > 0) {
    //     this.images = images.slice(0);
    // } else {
    //     this.images = new Array<string>();
    // };
    this.image = image;
    this.userId = userId;
    this.userName = userName;
    console.log(this.comments);
  }

  public getPostKey(): string {
    return this.key;
  }

  public getPostTitle(): string {
    return this.title;
  }

  public setPostTitle(title: string): void {
    this.title = title;
  }


  public getLocation(): Location {
    return this.location;
  }

  public setLocation(location: Location): void {
    this.location = location;
  }

  public getPostTimestamp(): string {
    return this.timestamp;
  }

  public getOriginalTimestamp(): number{
    let original = moment(this.timestamp, "MMMM Do YYYY, h:mm:ss a")
    return parseInt(original.format("X"))
  }
  public getExpiration(): string {
    return this.expiration;
  }

  public getExpirationRelative(): string {

    
    let exRelative = moment(this.expiration).fromNow();
    if (Date.parse(this.expiration) < Date.now()){
      return "Expired: " + exRelative;
    }
    return "Expire: " + exRelative;

  }


  public setExpiration(expiration: string): void {
    this.expiration = expiration;
  }

  public getPostDescription(): string {
    return this.description;
  }

  public setPostDescription(description: string): void {
    this.description = description;
  }

  public getPostImage(): string {
    return this.image;
  }

  public setPostImage(image: string): void {
    // if (images.length > 0) {
    //   this.images = images.slice(0);
    // } else {
    //   this.images = new Array<string>();
    // }
    this.image = image;

  }
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public setDistance(newDistance: number):void {
    this.distance = newDistance;
  }

  public getDistance(): number{
    return this.distance;
  }
  public getUserId(): string {
    return this.userId;
  }

  public setUserName(userName: string): void{
    this.userName = userName;
  }

  public getUserName(): string{
    return this.userName;
  }
  // comment management

  public initComments(commentSnapshot: Object) {
    for (let k in commentSnapshot) {
      let commentObject = commentSnapshot[k]
      let comment = new Comment(k, 
                                commentObject.commentatorId, 
                                commentObject.commentatorUserName,
                                commentObject.commentatorAvatar, 
                                commentObject.commentTimestamp, 
                                commentObject.commentText)
      this.comments[k] = comment;
      console.log('Init comments:', this.comments);
    }
  }

  public initLocation(location: any) {
    console.log(location);
    let newLocation = new Location(location.description, location.roomNumber, location.latitude, location.longitude);
    this.location = newLocation;
  }

  public getComments(): Object {
    return this.comments;
  }

  public setComments(comments: Object): void {
    this.comments = comments;
  }

  public getCommentList(): Comment[] {
    let commentList: Comment[] = [];
    for (let k in this.comments) {
      commentList.push(this.comments[k]);
    }
    return commentList;
  }

  public getCommentByKey(key: string): Post {
    return this.comments[key];
  }

  public addComment(commentkey: string,
                    commentatorId: string,
                    commentatorUserName: string,
                    commentatorAvatar: string,
                    commentTimestamp: string,
                    commentText:string): Comment {
    let comment = new Comment(commentkey, commentatorId, commentatorUserName, 
                              commentatorAvatar, commentTimestamp, commentText);
    if (this.comments === undefined) {
      this.comments = {};
      this.comments[commentkey] = comment;
    }
    else {
      this.comments[commentkey] = comment;
    }
    console.log('Hey added comment:', this.comments)
    return comment;
  }

  public removeComment(comment: Comment): void {
    delete this.comments[comment.getCommentKey()];
  }

  public removeCommentByKey(key: string): void {
    delete this.comments[key];
  }

  public getNumOfComments(): number {
    let commentList = this.getCommentList();
    return commentList.length;
  }


}
