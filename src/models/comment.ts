export class Comment {
  private key: string;
  private commentatorId: string;
  private commentatorUserName: string;
  private commentatorAvatar: string;
  private commentTimestamp: string;
  private commentText: string
 
  public constructor ( key: string,
                       commentatorId: string,
                       commentatorUserName: string,
                       commentatorAvatar: string,
                       commentTimestamp: string,
                       commentText:string) {
    this.key = key;
    this.commentatorId = commentatorId;
    this.commentatorUserName = commentatorUserName;
    this.commentatorAvatar = commentatorAvatar;
    this.commentTimestamp = commentTimestamp;
    this.commentText = commentText;
  }


  public getCommentKey(): string {
    return this.key;
  }

  public getCommentatorId(): string {
    return this.commentatorId;
  }

  public getCommentatorUserName(): string {
    return this.commentatorUserName;
  }

  public getCommentatorAvatar(): string {
    return this.commentatorAvatar;
  }

  public getCommentTimestamp(): string {
    return this.commentTimestamp;
  }

  public getCommentText(): string {
    return this.commentText;
  }
  
}