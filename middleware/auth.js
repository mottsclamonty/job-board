import { UnauthenticatedError } from '../errors/index.js';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === '64a44545510682f0c3fc6e61';
    console.log(payload);
    req.user = { userId: payload.userId, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

export default authMiddleware;
