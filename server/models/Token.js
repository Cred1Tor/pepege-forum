import mongoose from 'mongoose';

export const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Token', tokenSchema);
