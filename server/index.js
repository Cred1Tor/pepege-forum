import Express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import httpError from 'http-errors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import addRoutes from './routes/index';
import models from './models/index';
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
  app.use(methodOverride('_method'));
  app.use(Express.urlencoded({ extended: true }));
  app.use(Express.json());
  app.use('/assets', Express.static(path.join(__dirname, 'assets')));

  app.httpError = httpError;

  addRoutes(app);

  app.models = models;

  if (process.env.NODE_ENV !== 'test') {
    import('./db');
    await app.models.User.insertMany(users).catch(() => {});
  }

  app.use((_req, _res, next) => {
    next(new app.httpError.NotFound('Page not found'));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, _req, res, _next) => {
    res.status(error.status || 500).json(error);
  });

  return app;
};
