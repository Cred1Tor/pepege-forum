import Topic from '../models/Topic.js';
import { requiredAuth, verifyTopicId, authorizeForTopicEdition } from '../utils/middlewares.js';

export const getIndex = async (req, res, next) => {
  try {
    const topics = await req.app.models.Topic.find();
    res.render('topics/index', { topics });
  } catch (error) {
    next(error);
  }
};

export const getNewTopicForm = [
  requiredAuth,
  (_req, res) => {
    res.render('topics/new', { form: {}, errors: {} });
  },
];

export const getTopic = [
  verifyTopicId,
  async (req, res, next) => {
    try {
      const topic = await req.app.models.Topic.findById(req.params.topicId);
      topic.viewCount += 1;
      await topic.save();
      res.render('topics/show', { topic, commentForm: {}, errors: {} });
    } catch (error) {
      next(error);
    }
  },
];

export const create = [
  requiredAuth,
  async (req, res, next) => {
    try {
      const { title, body } = req.body;

      const errors = {};
      if (!title) {
        errors.title = "Title can't be blank";
      }

      if (!body) {
        errors.body = "Body can't be blank";
      }

      if (Object.keys(errors).length === 0) {
        const topic = new Topic({ title, body, creator: res.locals.currentUser });
        await req.app.models.Topic.insertMany(topic);
        res.set('Topic-Id', topic.id);
        res.redirect(`/topics/${topic.id}`);
        return;
      }

      res.status(422);
      res.render('topics/new', { form: req.body, errors });
    } catch (error) {
      next(error);
    }
  },
];

export const getTopicEditForm = [
  authorizeForTopicEdition,
  verifyTopicId,
  async (req, res, next) => {
    try {
      const topic = await req.app.models.Topic.findById(req.params.topicId);
      res.render('topics/edit', { topic, form: topic, errors: {} });
    } catch (error) {
      next(error);
    }
  },
];

export const patch = [
  authorizeForTopicEdition,
  verifyTopicId,
  async (req, res, next) => {
    try {
      const topic = await req.app.models.Topic.findById(req.params.topicId);

      const { title, body } = req.body;
      const errors = {};

      if (!title) {
        errors.title = "Title can't be blank";
      }

      if (!body) {
        errors.body = "Body can't be blank";
      }

      if (Object.keys(errors).length === 0) {
        await topic.edit(title, body, res.locals.currentUser);
        res.redirect(`/topics/${topic.id}`);
        return;
      }

      res.status(422);
      res.render('topics/edit', { topic, form: req.body, errors });
    } catch (error) {
      next(error);
    }
  },
];

export const remove = [
  authorizeForTopicEdition,
  verifyTopicId,
  async (req, res, next) => {
    try {
      await req.app.models.Topic.deleteOne({ id: req.params.id });
      const topics = await req.app.models.Topic.find();
      res.status(302).render('topics/index', { topics });
    } catch (error) {
      next(error);
    }
  },
];
