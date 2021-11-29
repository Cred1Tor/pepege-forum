import Express from 'express';
import addRoutes from './routes/index';
import User from './entities/User';
import Admin from './entities/Admin';

export default () => {
  const app = new Express();
  addRoutes(app);

  const users = [
    new Admin('admin@admin', 'Aleksandr', 'qwerty'),
    new User('user@user', 'pepe the frog', '123'),
  ];

  app.models.users = users;

  return app;
};
