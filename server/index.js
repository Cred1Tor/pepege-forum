import Express from 'express';
import session from 'express-session';
import path from 'path';
import methodOverride from 'method-override';
import httpError from 'http-errors';
import { fileURLToPath } from 'url';
import addRoutes from './routes/index.js';
import User from './entities/User.js';
import Admin from './entities/Admin.js';
import Guest from './entities/Guest.js';

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
  app.use(methodOverride('_method'));
  app.use(Express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    if (req.session?.email) {
      const { email } = req.session;
      res.locals.currentUser = app.models.users.find((user) => user.email === email);
    } else {
      res.locals.currentUser = new Guest();
    }
    next();
  });

  app.httpError = httpError;

  addRoutes(app);

  const users = [
    new Admin('admin@admin', 'Aleksandr', 'qwerty'),
    new User('user@user', 'pepe the frog', '123'),
  ];

  app.models = {};
  app.models.users = users;
  app.models.topics = [];

  app.use((_req, _res, next) => {
    next(new app.httpError.NotFound('Page not found'));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, _req, res, _next) => {
    res.status(error.status || 500).render('errors/index', { error });
  });

  return app;
};
