import {
  create, getCommentEditForm, patch, remove,
} from '../controllers/comments.js';

export default (app) => {
  app.post('/topics/:topicId/comments', create);

  app.get('/topics/:topicId/comments/:commentId/edit', getCommentEditForm);

  app.patch('/topics/:topicId/comments/:commentId', patch);

  app.delete('/topics/:topicId/comments/:commentId', remove);

  return app;
};
