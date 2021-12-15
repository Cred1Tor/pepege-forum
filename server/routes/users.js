// import User from '../entities/User.js';
import create from '../controllers/users.js';

export default (app) => {
  app.post('/users', create);
};
