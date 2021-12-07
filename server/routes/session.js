import { getAuthForm, create, destroy } from '../controllers/session.js';

export default (app) => {
  app.get('/session/new', getAuthForm);

  app.post('/session', create);

  app.delete('/session', destroy);
};
