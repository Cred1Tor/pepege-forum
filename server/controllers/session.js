import jwt from 'jsonwebtoken';
import User from '../models/User';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.verifyPassword(password)) {
    res.status(403).json({ error: 'Invalid email or password' });
    return;
  }

  const userData = user.toObject();
  /* eslint-disable no-underscore-dangle */
  userData.id = userData._id;
  delete userData._id;
  delete userData.__v;
  /* eslint-enable no-underscore-dangle */
  const token = jwt.sign({ user: userData }, process.env.JWT_SECRET);
  res.status(200).json({ token });
};

export const logout = async (req, res) => {
  const userId = req.user.id;
  res.status(200).json({ success: true, message: 'User logged out', userId });
};
