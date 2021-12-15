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

export default mongoose.model('Topic', topicSchema);
