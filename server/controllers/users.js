import HttpError from 'http-errors';
import User from '../models/User';

export default async (req, res, next) => {
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

    if (Object.keys(errors).length !== 0) {
      throw new HttpError(422, 'Invalid user credentials', { errors });
    }

    await newUser.save()
      .then(() => res.status(200).json({ user: newUser }))
      .catch(() => {
        throw new HttpError.InternalServerError('Can\'t save user');
      });
  } catch (error) {
    next(error);
  }
};
