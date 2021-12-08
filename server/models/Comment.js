import mongoose from 'mongoose';
import { userSchema } from './User.js';

export const commentSchema = new mongoose.Schema({
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
});

commentSchema.methods.edit = async function editComment(newBody, editor) {
  this.body = newBody;
  this.editor = editor;
  this.editionDate = Date.now();
  await this.parent().save();
};

export default await mongoose.model('Comment', commentSchema);
