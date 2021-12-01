export const requiredAuth = (req, res, next) => {
  if (res.locals.currentUser.isGuest()) {
    return next(new req.app.httpError.Forbidden('You have to sign in first'));
  }
  return next();
};

export const verifyTopicId = (req, _res, next) => {
  const topic = req.app.models.topics.find((t) => t.id.toString() === req.params.topicId);

  if (!topic) {
    next(new req.app.httpError.NotFound('Topic not found'));
  }

  next();
};

export const authorizeForTopicEdition = (req, res, next) => {
  const topic = req.app.models.topics.find((t) => t.id.toString() === req.params.topicId);

  if (topic.creator.id === res.locals.currentUser.id || res.locals.currentUser.isAdmin()) {
    return next();
  }

  return next(new req.app.httpError.Forbidden('You are not authorized to edit this topic'));
};
