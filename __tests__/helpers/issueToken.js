import jwt from 'jsonwebtoken';

export default (payload) => jwt.sign(payload, process.env.JWT_SECRET);
