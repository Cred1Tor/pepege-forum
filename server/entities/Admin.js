import User from './User.js';

export default class Admin extends User {
  admin = true;

  constructor(email, name, password) {
    super(email, name, password);
  }
}