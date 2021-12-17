import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';
import User from '../models/User';
import Token from '../models/Token';

const issueTokenPair = async (userId) => {
  const newRefreshTokenId = uuid();
  const newRefreshToken = new Token({ token: newRefreshTokenId, userId });
  await newRefreshToken.save();
  const tokenPOJO = newRefreshToken.toObject();
  // eslint-disable-next-line no-underscore-dangle
  delete tokenPOJO._id;
  // eslint-disable-next-line no-underscore-dangle
  delete tokenPOJO.__v;
  return {
    token: jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '5m' }),
    refreshToken: jwt.sign(tokenPOJO, process.env.JWT_SECRET, { expiresIn: '1h' }),
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

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokenData = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const dbToken = await Token.findOne({ token: tokenData.token });

    if (!dbToken) {
      throw new HttpError(403, 'Refresh token not found, login to issue new token');
    }

    await dbToken.delete();
    res.status(200).json(await issueTokenPair(dbToken.userId));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  const userId = req.user.id;
  await Token.deleteMany({ userId });
  res.status(200).json({ success: true });
};
