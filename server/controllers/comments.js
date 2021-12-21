import HttpError from 'http-errors';
import Topic from '../models/Topic';
import Comment from '../models/Comment';

export const create = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    const { body } = req.body;
    const errors = {};

    if (!body) {
      errors.body = "Comment can't be blank";
    }

    if (Object.keys(errors).length !== 0) {
      throw new HttpError(422, 'Invalid comment data', { errors });
    }

    const comment = new Comment({ body, creator: res.locals.user, topicId: topic.id });
    await comment.save();
    // topic.comments.push(comment);
    topic.commentCount += 1;
    await topic.save()
      .then(() => {
        res.set('X-Comment-Id', comment.id);
        res.set('X-Topic-Id', topic.id);
        res.status(200).json(comment);
      })
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};

export const patch = async (req, res, next) => {
  try {
    // const topic = await Topic.findById(req.params.topicId);
    const comment = await Comment.findById(req.params.commentId);
    // const comment = topic.comments.id(req.params.commentId);
    const { body } = req.body;
    const errors = {};

    if (!body) {
      errors.body = "Comment can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      comment.body = body;
      comment.editorId = res.locals.user.id;
      comment.editionDate = Date.now();
      await comment.save()
        .then(() => {
          res.set('X-Comment-Id', comment.id);
          res.set('X-Topic-Id', req.params.topicId);
          res.status(200).json(comment);
        })
        .catch((err) => next(err));
      return;
    }

    res.status(422).json({ message: 'Invalid comment data', errors });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    const comment = await Comment.findById(req.params.commentId);
    await comment.deleteOne();
    topic.commentCount -= 1;
    await topic.save()
      .then(() => {
        res.set('X-Comment-Id', comment.id);
        res.set('X-Topic-Id', topic.id);
        res.status(200).json({ success: true, message: 'Comment deleted' });
      })
      .catch((err) => {
        next(err);
      });
    return;
  } catch (error) {
    next(error);
  }
};
