export default class Comment {
  constructor(data) {
    this.id = data.id;
    this.emotion = data.emotion;
    this.commentText = data.comment;
    this.author = data.author;
    this.date = data.date;
  }

  toRAW() {
    return {
      id: this.id,
      emotion: this.emotion,
      comment: this.commentText,
      author: this.author,
      date: this.date
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}
