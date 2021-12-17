import {
  create, patch, remove,
} from '../controllers/comments';
import {
  getAuthorizeMw,
  verifyTopicId,
  verifyCommentId,
  authorizeForCommentEdition,
} from '../utils/middlewares';

export default (app) => {
  app.post('/topics/:topicId/comments', getAuthorizeMw(), verifyTopicId, create);

  app.patch('/topics/:topicId/comments/:commentId', getAuthorizeMw(), verifyCommentId, authorizeForCommentEdition, patch);

  app.delete('/topics/:topicId/comments/:commentId', getAuthorizeMw(), verifyCommentId, authorizeForCommentEdition, remove);

  return app;
};
