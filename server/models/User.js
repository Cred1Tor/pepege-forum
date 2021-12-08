import mongoose from 'mongoose';
import encrypt from '../utils/encrypt.js';

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/.+@.+\..+/, 'Wrong email format'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  password: {
    type: String,
    set: function setPassword(password) {
      this.passwordDigest = encrypt(password);
    },
  },
  passwordDigest: {
    type: String,
  },
  registrationDate: {
    type: Date,
    default: Date.now(),
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.isGuest = function isGuest() {
  return false;
};

userSchema.methods.isAdmin = function isAdmin() {
  return this.admin;
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return encrypt(password) === this.passwordDigest;
};

export default await mongoose.model('User', userSchema);
