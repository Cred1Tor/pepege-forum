class Topic {
  constructor(title, body, author) {
    this.title = title;
    this.body = body;
    this.author = author;
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

Topic.id = 1;

export default Topic;
