import users from './users.js';
import session from './session.js';
import topics from './topics.js';
import comments from './comments.js';

const controllers = [
  users,
  session,
  topics,
  comments,
];

export default (app) => controllers.forEach((f) => f(app));
