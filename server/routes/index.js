import users from './users.js';
import session from './session.js';

const controllers = [
  users,
  session,
];

export default (app) => controllers.forEach((f) => f(app));