import {
  create, patch, remove,
} from '../controllers/comments';
import {
  authorize,
  verifyTopicId,
  verifyCommentId,
  authorizeForCommentEdition,
} from '../utils/middlewares';

export default (app) => {
  app.post('/topics/:topicId/comments', authorize, verifyTopicId, create);

  app.patch('/topics/:topicId/comments/:commentId', authorize, verifyCommentId, authorizeForCommentEdition, patch);

  app.delete('/topics/:topicId/comments/:commentId', authorize, verifyCommentId, authorizeForCommentEdition, remove);

  return app;
};
