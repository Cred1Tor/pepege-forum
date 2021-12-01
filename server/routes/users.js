import User from '../entities/User.js';

export default (app) => {
  app.get('/users/new', (req, res) => {
    res.render('users/new', { form: {}, errors: {} });
  });

  app.post('/users', (req, res) => {
    const { email, name, password } = req.body;
    const errors = {};
    const emailExists = app.models.users.some((user) => user.email === email);
    const nameExists = app.models.users.some((user) => user.name === name);

    if (!/.+@.+/.test(email)) {
      errors.email = 'Wrong email format';
    }

    if (emailExists) {
      errors.email = 'User with this email already exists';
    }

    if (!name) {
      errors.name = 'Name can\'t be blank';
    }

    if (nameExists) {
      errors.name = 'User with this name already exists';
    }

    if (!password) {
      errors.password = 'Password can\'t be blank';
    }

    if (Object.keys(errors).length === 0) {
      const user = new User(email, name, password);
      app.models.users.push(user);
      res.redirect('/');
      return;
    }

    res.status(422);
    res.render('users/new', { form: req.body, errors });
  });
};
