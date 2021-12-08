export const requiredAuth = (req, res, next) => {
  if (res.locals.currentUser.isGuest()) {
    return next(new req.app.httpError.Forbidden('You have to sign in first'));
  }
  return next();
};

export const verifyTopicId = async (req, _res, next) => {
  const topic = await req.app.models.Topic.findById(req.params.topicId);

  if (!topic) {
    next(new req.app.httpError.NotFound('Topic not found'));
  }

  next();
};

export const authorizeForTopicEdition = async (req, res, next) => {
  const topic = await req.app.models.Topic.findById(req.params.topicId);

  if (topic.creator.id === res.locals.currentUser.id || res.locals.currentUser.isAdmin()) {
    return next();
  }

  return next(new req.app.httpError.Forbidden('You are not authorized to edit this topic'));
};

export const verifyCommentId = async (req, _res, next) => {
  const topic = await req.app.models.Topic.findById(req.params.topicId);

  if (!topic) {
    return next(new req.app.httpError.NotFound('Topic not found'));
  }

  const comment = topic.comments.id(req.params.commentId);

  if (!comment) {
    return next(new req.app.httpError.NotFound('Comment not found'));
  }

  return next();
};

export const authorizeForCommentEdition = async (req, res, next) => {
  const topic = await req.app.models.Topic.findById(req.params.topicId);
  const comment = topic.comments.id(req.params.commentId);

  if (comment.creator.id === res.locals.currentUser.id || res.locals.currentUser.isAdmin()) {
    return next();
  }

  return next(new req.app.httpError.Forbidden('You are not authorized to edit this comment'));
};
