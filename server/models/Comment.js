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
  await this.updateOne({ body: newBody, editor, editionDate: Date.now() });
};

export default await mongoose.model('Comment', commentSchema);
