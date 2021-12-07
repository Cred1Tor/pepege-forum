// import User from '../entities/User.js';
import { getNewUserForm, create } from '../controllers/users.js';

export default (app) => {
  app.get('/users/new', getNewUserForm);

  app.post('/users', create);
};
