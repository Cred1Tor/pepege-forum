import HttpError from 'http-errors';
import Topic from '../models/Topic';

export const getList = async (req, res, next) => {
  try {
    const topics = await Topic.find();
    res.status(200).json(topics);
  } catch (error) {
    next(error);
  }
};

export const getTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    topic.viewCount += 1;
    await topic.save();
    res.status(200).json(topic);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, body } = req.body;

    const errors = {};
    if (!title) {
      errors.title = "Title can't be blank";
    }

    if (!body) {
      errors.body = "Body can't be blank";
    }

    if (Object.keys(errors).length !== 0) {
      throw new HttpError(422, 'Invalid topic data', { errors });
    }

    await Topic.create({ title, body, creator: res.locals.user })
      .then((topic) => {
        res.set('X-Topic-Id', topic.id);
        res.status(200).json(topic);
      })
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};

export const patch = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.topicId);

    const { title, body } = req.body;
    const errors = {};

    if (!title) {
      errors.title = "Title can't be blank";
    }

    if (!body) {
      errors.body = "Body can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      topic.title = title;
      topic.body = body;
      topic.editor = res.locals.user;
      topic.editionDate = Date.now();

      await topic.save()
        .then(() => {
          res.set('X-Topic-Id', topic.id);
          res.status(200).json(topic);
        })
        .catch(() => next(new HttpError.InternalServerError('Can\'t save topic')));
      return;
    }

    res.status(422).json({ message: 'Invalid topic data', errors });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await Topic.deleteOne({ _id: req.params.topicId })
      .then(() => res.status(200).json({ success: true, message: 'topic deleted' }))
      .catch(() => next(new HttpError.InternalServerError('Can\'t delete topic')));
  } catch (error) {
    next(error);
  }
};
