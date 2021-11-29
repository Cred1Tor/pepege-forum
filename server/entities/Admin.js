import User from './User.js';

export default class Admin extends User {
  constructor(email, name, password) {
    super(email, name, password);
    this.admin = true;
  }
}
