import {
  getList, getTopic, create, patch, remove,
} from '../controllers/topics.js';
import { authorize, verifyTopicId, authorizeForTopicEdition } from '../utils/middlewares.js';

export default (app) => {
  app.get('/topics', getList);

  app.get('/topics/:topicId', verifyTopicId, getTopic);

  app.post('/topics', authorize, create);

  app.patch('/topics/:topicId', authorize, verifyTopicId, authorizeForTopicEdition, patch);

  app.delete('/topics/:topicId', authorize, verifyTopicId, authorizeForTopicEdition, remove);

  return app;
};
