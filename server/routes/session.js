import { authorize } from '../utils/middlewares';
import { login, logout } from '../controllers/session';

export default (app) => {
  app.post('/session', login);

  app.delete(
    '/session',
    authorize,
    logout,
  );
};
