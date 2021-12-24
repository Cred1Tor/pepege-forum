import Express from 'express';
import HttpError from 'http-errors';
import addRoutes from './routes/index';
import users from './data/users.json';
import User from './models/User';

export default async () => {
  const app = new Express();

  app.use(Express.json());

  addRoutes(app);

  if (process.env.NODE_ENV !== 'test') {
    import('./db');
    await User.insertMany(users).catch(() => {});
  }

  app.use((_req, _res, next) => {
    next(new HttpError.NotFound('Page not found'));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, _req, res, _next) => {
    res.status(error.status || 500).json(
      Object.keys(error).length !== 0 ? error : { error: error.toString() },
    );
  });

  return app;
};
