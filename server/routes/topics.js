import {
  getList, getTopic, create, patch, remove,
} from '../controllers/topics';
import { getAuthorizeMw, verifyTopicId, authorizeForTopicEdition } from '../utils/middlewares';

export default (app) => {
  app.get('/topics', getList);

  app.get('/topics/:topicId', verifyTopicId, getTopic);

  app.post('/topics', getAuthorizeMw(), create);

  app.patch('/topics/:topicId', getAuthorizeMw(), verifyTopicId, authorizeForTopicEdition, patch);

  app.delete('/topics/:topicId', getAuthorizeMw(), verifyTopicId, authorizeForTopicEdition, remove);

  return app;
};
