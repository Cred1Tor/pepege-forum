import User from '../models/User.js';

export const getAuthForm = (req, res) => {
  res.render('session/new', { form: {} });
};

export const create = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.verifyPassword(password)) {
    const error = 'Invalid email or password';
    res.status(422).render('session/new', { form: req.body, error });
    return;
  }

  req.session.email = email;
  res.redirect('/');
};

export const destroy = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
