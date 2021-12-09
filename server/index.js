import Express from 'express';
import session from 'express-session';
import path from 'path';
import methodOverride from 'method-override';
import httpError from 'http-errors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import addRoutes from './routes/index.js';
import Guest from './entities/Guest.js';
import models from './models/index.js';
import users from './data/users.json';

dotenv.config();

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

export default async () => {
  const app = new Express();

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  }));
  app.use(methodOverride('_method'));
  app.use(Express.urlencoded({ extended: true }));
  app.use('/assets', Express.static(path.join(__dirname, 'assets')));

  app.use(async (req, res, next) => {
    if (req.session?.email) {
      const { email } = req.session;
      res.locals.currentUser = await app.models.User.findOne({ email })
        .catch((err) => { throw err; });
    } else {
      res.locals.currentUser = new Guest();
    }
    next();
  });

  app.httpError = httpError;

  addRoutes(app);

  app.models = models;

  if (process.env.NODE_ENV !== 'test') {
    import('./db.js');
    await app.models.User.insertMany(users).catch(() => {});
  }

  app.use((_req, _res, next) => {
    next(new app.httpError.NotFound('Page not found'));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, _req, res, _next) => {
    res.status(error.status || 500).render('errors/index', { error });
  });

  return app;
};
