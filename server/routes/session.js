import jwtMiddleware from 'express-jwt';
import { login, refresh, logout } from '../controllers/session';

export default (app) => {
  app.post('/session', login);

  app.post('/refresh', refresh);

  app.delete('/session', jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), logout);
};
