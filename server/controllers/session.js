import jwt from 'jsonwebtoken';
import User from '../models/User';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.verifyPassword(password)) {
    res.status(403).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.status(200).json({ token });
};

export const logout = async (req, res) => {
  const userId = req.user.id;
  res.status(200).json({ success: true, message: 'User logged out', userId });
};
