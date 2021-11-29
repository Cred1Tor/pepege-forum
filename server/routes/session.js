export default (app) => {
  app.get('/session/new', (req, res) => {
    res.render('session/new', { form: {} });
  });

  app.post('/session', (req, res) => {
    const { email, password } = req.body;
    const user = app.models.users.find((u) => u.email === email);

    if (!user || !user.verifyPassword(password)) {
      const error = 'Invalid email or password';
      res.status(422).render('session/new', { form: req.body, error });
      return;
    }

    req.session.email = email;
    res.redirect('/');
  });

  app.delete('/session', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });
};
