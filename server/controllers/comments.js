import {
  requiredAuth,
  verifyTopicId,
  verifyCommentId,
  authorizeForCommentEdition,
} from '../utils/middlewares.js';

export const create = [
  requiredAuth,
  verifyTopicId,
  async (req, res) => {
    const topic = await req.app.models.Topic.findById(req.params.topicId);
    const { body } = req.body;
    const errors = {};

    if (!body) {
      errors.body = "Comment can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      const comment = await topic.addComment(body, res.locals.currentUser);
      res.set('Comment-Id', comment.id);
      res.status(201).render('topics/show', { topic, commentForm: {}, errors: {} });
      return;
    }

    res.status(422);
    res.render('topics/show', { topic, commentForm: req.body, errors });
  },
];

export const getCommentEditForm = [
  verifyCommentId,
  authorizeForCommentEdition,
  async (req, res) => {
    const topic = await req.app.models.Topic.findById(req.params.topicId);
    const comment = topic.findComment(req.params.commentId);
    res.render('comments/edit', { comment, form: comment, errors: {} });
  },
];

export const patch = [
  verifyCommentId,
  authorizeForCommentEdition,
  async (req, res) => {
    const topic = await req.app.models.Topic.findById(req.params.topicId);
    const comment = topic.findComment(req.params.commentId);
    const { body } = req.body;
    const errors = {};

    if (!body) {
      errors.body = "Comment can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      await comment.edit(body, res.locals.currentUser);
      res.render('topics/show', { topic, commentForm: {}, errors: {} });
      return;
    }

    res.status(422);
    res.render('comments/edit', { comment, form: req.body, errors });
  },
];

export const remove = [
  verifyCommentId,
  authorizeForCommentEdition,
  async (req, res) => {
    const topic = await req.app.models.Topic.findById(req.params.topicId);
    await topic.deleteComment(req.params.commentId);
    res.render('topics/show', { topic, commentForm: {}, errors: {} });
  },
];
