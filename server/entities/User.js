import encrypt from '../utils/encrypt.js';

export default class User {
  guest = false;
  admin = false;

  constructor(email, name, password) {
    this.email = email;
    this.name = name;
    this.passwordDigest = encrypt(password);
  }

  isGuest() {
    return this.guest;
  }

  isAdmin() {
    return this.admin;
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
}