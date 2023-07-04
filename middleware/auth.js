import { UnauthenticatedError } from '../errors/index.js';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  // checking request header
  const authHeader = req.headers['authorization'];
  // Make sure authentication header exists and begins with Bearer
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const testUser = payload.userId === '64a44545510682f0c3fc6e61';
    req.user = { userId: payload.userId, testUser };
    req.demoUser = next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

export default authMiddleware;
