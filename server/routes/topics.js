import {
  getIndex, getNewTopicForm, getTopicEditForm, getTopic, create, patch, remove,
} from '../controllers/topics.js';

export default (app) => {
  app.get('/topics', getIndex);

  app.get('/topics/new', getNewTopicForm);

  app.get('/topics/:topicId', getTopic);

  app.post('/topics', create);

  app.get('/topics/:topicId/edit', getTopicEditForm);

  app.patch('/topics/:topicId', patch);

  app.delete('/topics/:topicId', remove);

  return app;
};
