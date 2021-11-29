import Express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import addRoutes from './routes/index.js';
import User from './entities/User.js';
import Admin from './entities/Admin.js';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

export default () => {
  const app = new Express();

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
  }));

  addRoutes(app);

  const users = [
    new Admin('admin@admin', 'Aleksandr', 'qwerty'),
    new User('user@user', 'pepe the frog', '123'),
  ];

  app.models = {};
  app.models.users = users;

  return app;
};
