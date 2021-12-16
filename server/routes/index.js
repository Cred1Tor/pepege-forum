import users from './users';
import session from './session';
import topics from './topics';
import comments from './comments';

const controllers = [
  users,
  session,
  topics,
  comments,
];

export default (app) => controllers.forEach((f) => f(app));
