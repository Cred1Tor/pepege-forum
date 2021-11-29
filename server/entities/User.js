import encrypt from '../utils/encrypt.js';

class User {
  constructor(email, name, password) {
    this.id = this.constructor.id;
    this.constructor.id += 1;
    this.email = email;
    this.name = name;
    this.passwordDigest = encrypt(password);
    this.registrationDate = Date.now();
    this.guest = false;
    this.admin = false;
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

User.id = 1;
export default User;
