import mongoose from 'mongoose';
import { userSchema } from './User';

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
  topicId: { type: mongoose.ObjectId, ref: 'Topic' },
});

export default mongoose.model('Comment', commentSchema);
