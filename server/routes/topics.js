import Topic from '../entities/Topic.js';
import { requiredAuth, verifyTopicId, authorizeForTopicEdition } from '../utils/middlewares.js';

export default (app) => {
  app.get('/topics', (_req, res) => {
    res.render('topics/index', { topics: app.models.topics });
  });

  app.get('/topics/new', requiredAuth, (_req, res) => {
    res.render('topics/new', { form: {}, errors: {} });
  });

  app.get('/topics/:topicId', verifyTopicId, (req, res) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.topicId);
    topic.viewCount += 1;
    res.render('topics/show', { topic, commentForm: {}, errors: {} });
  });

  app.post('/topics', requiredAuth, (req, res) => {
    const { title, body } = req.body;

    const errors = {};
    if (!title) {
      errors.title = "Title can't be blank";
    }

    if (!body) {
      errors.body = "Body can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      const topic = new Topic(title, body, res.locals.currentUser);
      app.models.topics.push(topic);
      res.set('Topic-Id', topic.id);
      res.redirect(`/topics/${topic.id}`);
      return;
    }

    res.status(422);
    res.render('topics/new', { form: req.body, errors });
  });

  app.get('/topics/:topicId/edit', authorizeForTopicEdition, verifyTopicId, (req, res) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.topicId);
    res.render('topics/edit', { topic, form: topic, errors: {} });
  });

  app.patch('/topics/:topicId', authorizeForTopicEdition, verifyTopicId, (req, res) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.topicId);

    const { title, body } = req.body;
    const errors = {};

    if (!title) {
      errors.title = "Title can't be blank";
    }

    if (!body) {
      errors.body = "Body can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      topic.edit(title, body, res.locals.currentUser);
      res.redirect(`/topics/${topic.id}`);
      return;
    }

    res.status(422);
    res.render('topics/edit', { topic, form: req.body, errors });
  });

  app.delete('/topics/:topicId', authorizeForTopicEdition, verifyTopicId, (req, res) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.topicId);

    app.models.topics = app.models.topics.filter(({ id }) => topic.id !== id);
    res.status(302).render('topics/index', { topics: app.models.topics });
  });

  return app;
};
