// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from "../../models/post";
import { PostManager } from '../../models/postManager';
import { Comment } from '../../models/comment';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Location } from '../../models/location'
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the PostDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostDataProvider {

  private postManager: PostManager;
  private postObservable: Observable<Post[]>;
  private postObserver: Observer<Object>;
  private commentObservable: Observable<Comment[]>;
  private commentObserver: Observer<Object>;
  private userPostListObservable:Observable<Post[]>;
  private userPostListObserver:Observer<Object>;
  private db: any;


  constructor(public toastCtrl: ToastController) {
    console.log('Hello PostDataProvider Provider');

    this.postManager = new PostManager();

    this.postObservable = Observable.create(observer => {
      this.postObserver = observer;
    });

    this.commentObservable = Observable.create(observer => {
      this.commentObserver = observer;
    });

    this.userPostListObservable = Observable.create(observer => {
      this.userPostListObserver = observer;
    });

    this.db = firebase.database();
    let postRef = this.db.ref('/posts');
    let i = 0;

    postRef.on('value', snapshot => {
      console.log(snapshot)
      this.postManager.initFromFirebase(snapshot);
      this.notifySubscribers();
      if (i>0){
        this.presentToast()
      };
      i++;
    }
    );
  }


  public getPostList(): Post[] {
    let postList = this.postManager.getPostList();
    return postList;
  }

  public getPostByKey(key: string): Post {
    let post = this.postManager.getPostByKey(key);
    return post;
  }

  public getPostObservable(): Observable<Post[]> {
    return this.postObservable;
  }

  public getCommentObservable(): Observable<Comment[]> {
    return this.commentObservable;
  }
  public getUserPostListObservable(): Observable<Post[]> {
    return this.userPostListObservable;
  }

  private notifySubscribers(): void {
    let postList = this.postManager.getPostList();
    this.postObserver.next(postList);
  }

  private notifyUserPostListSubscribers(userId:string): void {
    let userPostList = this.postManager.getPostByUserId(userId);
    this.userPostListObserver.next(userPostList);
  }

  private notifyCommentSubscribers(postKey): void {
    let post = this.postManager.getPostByKey(postKey);
    let commentList = post.getCommentList();
    this.commentObserver.next(commentList);
  }

  public addPost(title: string, 
                 location: Location, 
                 timestamp: string, 
                 expiration: string, 
                 description: string, 
                 image: string, 
                 userId: string,
                 userName: string,
                 comments: Object): void {

    let postRef = this.db.ref('/posts');
    let postDataRef = postRef.push();
    let key = postDataRef.getKey();
    let post = this.postManager.addPost(key,
                                        title,
                                        location,
                                        timestamp,
                                        expiration,
                                        description,
                                        image,
                                        userId,
                                        userName);
    postDataRef.set(post);
    this.notifySubscribers();
    this.notifyUserPostListSubscribers(userId);
  }

  public getPost(key:string){
    return this.postManager.getPostByKey(key);
  }
  public getPostListByUserId(userId: string){
    return this.postManager.getPostByUserId(userId);
  }

  public removePost(post:any){
    let id=post["userId"];
    this.postManager.removePost(post);
    let parentRef = this.db.ref('/posts');
    let childRef = parentRef.child(post.getPostKey());
    childRef.remove();
    this.notifySubscribers();
    this.notifyUserPostListSubscribers(id);
  }

  public updatePost(postKey:string): void {
    let post = this.postManager.getPostByKey(postKey);
    let id = post["userId"];
    let parentRef = this.db.ref('/posts');
    let childRef = parentRef.child(postKey);
    childRef.set({key: postKey,
                 title: post.getPostTitle(),
                 location: post.getLocation(),
                 timestamp: post.getPostTimestamp(),
                 expiration: post.getExpiration(),
                 description: post.getPostDescription(),
                 image: post.getPostImage(),
                 userId: post.getUserId(),
                 userName: post.getUserName(),
                 comments: post.getComments()
       });
    this.notifySubscribers();
    this.notifyUserPostListSubscribers(id);

  }

  public getCommentList(postKey: string) {
    let post = this.postManager.getPostByKey(postKey);
    let commentList = post.getCommentList();
    return commentList;
  }

  public addComment(postKey: string,
                    commentatorId: string,
                    commentatorUserName: string,
                    commentatorAvatar: string,
                    commentTimestamp: string,
                    commentText: string): void {
    let post = this.postManager.getPostByKey(postKey);
    let commentRef = this.db.ref('/posts/' + postKey + '/comments');
    let commentDataRef = commentRef.push();
    let commentKey = commentDataRef.getKey();
    post.addComment(commentKey, commentatorId, commentatorUserName,
                    commentatorAvatar, commentTimestamp, commentText);
    console.log('added comment!!:', post.getComments())
    this.updatePost(postKey);
    this.notifyCommentSubscribers(postKey);
    // this.notifySubscribers();
  }

  public deleteComment(postKey: string, comment: Comment): void {
    let post = this.postManager.getPostByKey(postKey);
    post.removeComment(comment);
    let commentRef = this.db.ref('/posts/' + postKey + '/comments');
    let commentChildRef = commentRef.child(comment.getCommentKey());
    commentChildRef.remove();
    this.notifyCommentSubscribers(postKey);
    this.notifySubscribers();
  }

  private presentToast() {
    let toast = this.toastCtrl.create({
      message: "Posts are just updated! Refresh to check the lateset list.",
      duration: 4000
    });
    toast.present();
  
  }

}
