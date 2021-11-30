export default class Guest {
  guest = true;

  admin = false;

  isGuest() {
    return this.guest;
  }

  isAdmin() {
    return this.admin;
  }
}
