import Comment from './Comment.js';

export default class Topic {
  static id = 1;

  comments = [];

  currentCommentId = 1;

  viewCount = 0;

  commentCount = 0;

  constructor(title, body, creator) {
    this.title = title;
    this.body = body;
    this.creator = creator;
    this.creationDate = new Date();
    this.id = this.constructor.id;
    this.constructor.id += 1;
  }

  edit(title, body, editor) {
    this.title = title;
    this.body = body;
    this.editor = editor;
    this.editionDate = new Date();
  }

  addComment(body, creator) {
    const comment = new Comment(this, body, creator);
    this.comments.push(comment);
    this.currentCommentId += 1;
    this.commentCount += 1;
    return comment;
  }

  findComment(id) {
    return this.comments.find((comment) => comment.id === id);
  }

  deleteComment(id) {
    this.comments = this.comments.filter((comment) => comment.id !== id);
    this.commentCount -= 1;
  }
}
