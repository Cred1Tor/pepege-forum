import {
  requiredAuth,
  verifyTopicId,
  verifyCommentId,
  authorizeForCommentEdition,
} from '../utils/middlewares.js';

export default (app) => {
  app.post('/topics/:topicId/comments', requiredAuth, verifyTopicId, (req, res) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.topicId);
    const { body } = req.body;
    const errors = {};

    if (!body) {
      errors.body = "Comment can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      const comment = topic.addComment(body, res.locals.currentUser);
      res.set('Comment-Id', comment.id);
      res.status(201).render('topics/show', { topic, commentForm: {}, errors: {} });
      return;
    }

    res.status(422);
    res.render('topics/show', { topic, commentForm: req.body, errors });
  });

  app.get('/topics/:topicId/comments/:commentId/edit', verifyCommentId, authorizeForCommentEdition, (req, res) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.topicId);
    const comment = topic.findComment(Number(req.params.commentId));
    res.render('comments/edit', { comment, form: comment, errors: {} });
  });

  app.patch('/topics/:topicId/comments/:commentId', verifyCommentId, authorizeForCommentEdition, (req, res) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.topicId);
    const { body } = req.body;
    const errors = {};

    if (!body) {
      errors.body = "Comment can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      const comment = topic.findComment(Number(req.params.commentId));
      comment.edit(body, res.locals.currentUser);
      res.render('topics/show', { topic, commentForm: {}, errors: {} });
      return;
    }

    res.status(422);
    res.render('topics/show', { topic, commentForm: req.body, errors });
  });

  app.delete('/topics/:topicId/comments/:commentId', verifyCommentId, authorizeForCommentEdition, (req, res) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.topicId);
    topic.deleteComment(Number(req.params.commentId));
    res.render('topics/show', { topic, commentForm: {}, errors: {} });
  });

  return app;
};
