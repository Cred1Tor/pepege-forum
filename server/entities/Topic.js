export default class Topic {
  static id = 1;

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
}
