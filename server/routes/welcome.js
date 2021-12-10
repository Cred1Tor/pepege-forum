import get from '../controllers/welcome.js';

export default (app) => {
  app.get('/', get);
};
