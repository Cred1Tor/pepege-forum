import { getAuthorizeMw } from '../utils/middlewares';
import {
  login, refresh, logout,
} from '../controllers/session';

export default (app) => {
  app.post('/session', login);

  app.post('/session/refresh', refresh);

  app.delete(
    '/session',
    getAuthorizeMw({ ignoreExpiration: true }),
    logout,
  );
};
