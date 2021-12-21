import mongoose from 'mongoose';
import { userSchema } from './User';

const topicSchema = new mongoose.Schema({
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

topicSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'topicId',
  justOne: false,
});

topicSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Topic', topicSchema);
