import users from './users';
import session from './session';
import welcome from './welcome';

const controllers = [
  welcome,
  users,
  session,
];

export default (app) => controllers.forEach((f) => f(app));
