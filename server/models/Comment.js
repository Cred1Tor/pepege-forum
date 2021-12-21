import mongoose from 'mongoose';

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
  creatorId: { type: mongoose.ObjectId, ref: 'User' },
  editorId: { type: mongoose.ObjectId, ref: 'User' },
  topicId: { type: mongoose.ObjectId, ref: 'Topic' },
});

export default mongoose.model('Comment', commentSchema);
