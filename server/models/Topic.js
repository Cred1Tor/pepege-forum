import mongoose from 'mongoose';
import Comment, { commentSchema } from './Comment.js';
import { userSchema } from './User.js';

const topicSchema = new mongoose.Schema({
  comments: [commentSchema],
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  body: {
    type: String,
    required: [true, 'Body is required'],
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  editionDate: Date,
  creator: userSchema,
  editor: userSchema,
  viewCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
});

topicSchema.methods.edit = async function editTopic(newTitle, newBody, editor) {
  await this.updateOne({
    title: newTitle, body: newBody, editor, editionDate: Date.now(),
  });
};

topicSchema.methods.addComment = async function addComment(body, creator) {
  const comment = new Comment({ body, creator });
  this.comments.push(comment);
  this.commentCount += 1;
  await this.save();
  return comment;
};

topicSchema.methods.findComment = function findComment(id) {
  return this.comments.id(id);
};

topicSchema.methods.deleteComment = async function deleteComment(id) {
  await this.comments.id(id).remove();
  this.commentCount -= 1;
  await this.save();
};

export default await mongoose.model('Topic', topicSchema);
