import create from '../controllers/users';

export default (app) => {
  app.post('/users', create);
};
