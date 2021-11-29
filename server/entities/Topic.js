class Topic {
  constructor(title, body, author) {
    this.title = title;
    this.body = body;
    this.author = author;
    this.creationDate = Date.now();
    this.id = this.constructor.id;
    this.constructor.id += 1;
  }

  edit(title, body, editor) {
    this.title = title;
    this.body = body;
    this.editor = editor;
    this.editionDate = Date.now();
  }
}

Topic.id = 1;

export default Topic;
