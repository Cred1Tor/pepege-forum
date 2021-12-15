import dotenv from 'dotenv';
import jwtMiddleware from 'express-jwt';
import Topic from '../models/Topic.js';
import User from '../models/User.js';

dotenv.config();

export const authorize = [
  jwtMiddleware({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),
  async (req, res, next) => {
    const { id } = req.user;
    res.locals.user = await User.findOne({ id })
      .catch((err) => { throw err; });
    next();
  },
];

export const verifyTopicId = async (req, _res, next) => {
  const topic = await Topic.findById(req.params.topicId)
    .catch(() => next(new req.app.httpError.NotFound('Topic not found')));

  if (!topic) {
    next(new req.app.httpError.NotFound('Topic not found'));
  }

  next();
};

export const authorizeForTopicEdition = async (req, res, next) => {
  const topic = await Topic.findById(req.params.topicId);

  if (topic.creator.id === res.locals.user.id || res.locals.user.isAdmin()) {
    return next();
  }

  return next(new req.app.httpError.Forbidden('You are not authorized to edit this topic'));
};

export const verifyCommentId = async (req, _res, next) => {
  const topic = await Topic.findById(req.params.topicId)
    .catch(() => next(new req.app.httpError.NotFound('Topic not found')));

  if (!topic) {
    return next(new req.app.httpError.NotFound('Topic not found'));
  }

  const comment = topic.comments.id(req.params.commentId)
    .catch(() => next(new req.app.httpError.NotFound('Comment not found')));

  if (!comment) {
    return next(new req.app.httpError.NotFound('Comment not found'));
  }

  return next();
};

export const authorizeForCommentEdition = async (req, res, next) => {
  const topic = await Topic.findById(req.params.topicId);
  const comment = topic.comments.id(req.params.commentId);

  if (comment.creator.id === res.locals.user.id || res.locals.user.isAdmin()) {
    return next();
  }

  return next(new req.app.httpError.Forbidden('You are not authorized to edit this comment'));
};
