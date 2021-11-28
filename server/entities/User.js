import encrypt from '../utils/encrypt.js';

export default class User {
  static id = 1;
  guest = false;
  admin = false;

  constructor(email, name, password) {
    this.id = this.constructor.id;
    this.constructor.id += 1;
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