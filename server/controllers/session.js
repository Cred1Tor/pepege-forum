import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Token from '../models/Token';

const issueTokenPair = async (userId) => {
  const newRefreshToken = uuid();
  await Token.create({ token: newRefreshToken, userId });

  return {
    token: jwt.sign({ id: userId }, process.env.JWT_SECRET),
    refreshToken: newRefreshToken,
  };
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.verifyPassword(password)) {
    res.status(403).json({ error: 'Invalid email or password' });
    return;
  }

  const tokenPair = await issueTokenPair(user.id);
  res.status(200).json(tokenPair);
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  const dbToken = await Token.findOne({ token: refreshToken });
  if (!dbToken) {
    return;
  }
  await dbToken.deleteOne();
  const tokenPair = await issueTokenPair(dbToken.userId);
  res.status(200).json(tokenPair);
};

export const logout = async (req, res) => {
  const userId = req.user.id;
  await Token.deleteMany({ userId });
  res.status(200).json({ success: true });
};
