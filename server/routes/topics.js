import Topic from '../entities/Topic.js';

export default (app) => {
  app.get('/topics', (_req, res) => {
    res.render('topics/index', { topics: app.models.topics });
  });

  app.get('/topics/new', app.requiredAuth, (_req, res) => {
    res.render('topics/new', { form: {}, errors: {} });
  });

  app.get('/topics/:id', (req, res, next) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.id);

    if (!topic) {
      next(new app.httpError.NotFound('Topic not found'));
    }

    res.render('topics/show', { topic });
  });

  app.post('/topics', app.requiredAuth, (req, res) => {
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
      res.redirect(`/topics/${topic.id}`);
      return;
    }

    res.status(422);
    res.render('topics/new', { form: req.body, errors });
  });

  app.get('/topics/:id/edit', app.requiredAuth, (req, res, next) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.id);

    if (!topic) {
      next(new app.httpError.NotFound('Topic not found'));
    }

    res.render('topics/edit', { topic, form: topic, errors: {} });
  });

  app.patch('/topics/:id', app.requiredAuth, (req, res, next) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.id);

    if (!topic) {
      next(new app.httpError.NotFound('Topic not found'));
    }

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
      res.redirect(`/topics/${topic.id}`);
      return;
    }

    res.status(422);
    res.render('topics/edit', { topic, form: req.body, errors });
  });

  app.delete('/topics/:id', app.requiredAuth, (req, res, next) => {
    const topic = app.models.topics.find((t) => t.id.toString() === req.params.id);

    if (!topic) {
      next(new app.httpError.NotFound('Topic not found'));
    }

    app.models.topics = app.models.topics.filter(({ id }) => topic.id !== id);
    res.status(302).render('topics/index', { topics: app.models.topics });
  });

  return app;
};
