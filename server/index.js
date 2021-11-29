import Express from 'express';
import session from 'express-session';
import addRoutes from './routes/index.js';
import User from './entities/User.js';
import Admin from './entities/Admin.js';

export default () => {
  const app = new Express();

  app.set('view engine', 'pug');
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

  app.models.users = users;

  return app;
};
