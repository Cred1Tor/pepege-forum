import users from './users.js';
import session from './session.js';
import welcome from './welcome.js';
import topics from './topics.js';

const controllers = [
  welcome,
  users,
  session,
  topics,
];

export default (app) => controllers.forEach((f) => f(app));
