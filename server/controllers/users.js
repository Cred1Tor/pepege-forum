import User from '../models/User.js';

export const getNewUserForm = (req, res) => {
  res.render('users/new', { form: {}, errors: {} });
};

export const create = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const errors = {};
    const emailExists = await User.findOne({ email: newUser.email });
    const nameExists = await User.findOne({ name: newUser.name });

    if (!/.+@.+\..+/.test(newUser.email)) {
      errors.email = 'Wrong email format';
    }

    if (emailExists) {
      errors.email = 'User with this email already exists';
    }

    if (!newUser.name) {
      errors.name = 'Name can\'t be blank';
    }

    if (nameExists) {
      errors.name = 'User with this name already exists';
    }

    if (!req.body.password) {
      errors.password = 'Password can\'t be blank';
    }

    if (Object.keys(errors).length === 0) {
      await newUser.save()
        .then(() => res.redirect('/'))
        .catch(() => next(new req.app.httpError.UnprocessableEntity('Can\'t save user')));
      return;
    }

    res.status(422).render('users/new', { form: req.body, errors });
  } catch (error) {
    next(error);
  }
};
