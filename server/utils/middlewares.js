import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';
import Topic from '../models/Topic';
import User from '../models/User';

export const authorize = async (req, res, next) => {
  try {
    const accessToken = req.get('Authorization')?.replace('Bearer ', '');

    if (!accessToken) {
      throw new HttpError(401, 'Jwt must be provided');
    }

    const tokenData = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = {};
    req.user.id = tokenData.userId;
    res.locals.user = await User.findOne({ id: tokenData.userId });
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyTopicId = async (req, _res, next) => {
  const topic = await Topic.findById(req.params.topicId)
    .catch(() => next(new HttpError.BadRequest('Invalid topic id')));

  if (!topic) {
    next(new HttpError.NotFound('Topic not found'));
  }

  next();
};

export const authorizeForTopicEdition = async (req, res, next) => {
  const topic = await Topic.findById(req.params.topicId);

  if (topic.creator.id === req.user.id || res.locals.user.isAdmin()) {
    return next();
  }

  return next(new HttpError.Forbidden('You are not authorized to edit this topic'));
};

export const verifyCommentId = async (req, _res, next) => {
  const topic = await Topic.findById(req.params.topicId)
    .catch(() => next(new HttpError.BadRequest('Invalid topic id')));

  if (!topic) {
    return next(new HttpError.NotFound('Topic not found'));
  }

  const comment = topic.comments.id(req.params.commentId);

  if (!comment) {
    return next(new HttpError.NotFound('Comment not found'));
  }

  return next();
};

export const authorizeForCommentEdition = async (req, res, next) => {
  const topic = await Topic.findById(req.params.topicId);
  const comment = topic.comments.id(req.params.commentId);

  if (comment.creator.id === res.locals.user.id || res.locals.user.isAdmin()) {
    return next();
  }

  return next(new HttpError.Forbidden('You are not authorized to edit this comment'));
};
