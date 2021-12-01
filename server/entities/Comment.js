export default class Comment {
  constructor(topic, body, creator) {
    this.topic = topic;
    this.id = topic.currentCommentId;
    this.body = body;
    this.creator = creator;
    this.creationDate = new Date();
  }

  edit(body, editor) {
    this.body = body;
    this.editor = editor;
    this.editionDate = new Date();
  }
}
