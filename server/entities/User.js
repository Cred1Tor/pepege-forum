import encrypt from '../utils/encrypt.js';

let id = 1;

export default class User {
  guest = false;

  admin = false;

  constructor(email, name, password) {
    this.id = id;
    id += 1;
    this.email = email;
    this.name = name;
    this.passwordDigest = encrypt(password);
    this.registrationDate = Date.now();
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
