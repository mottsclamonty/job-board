import { BadRequestError } from '../errors/index.js';

const checkTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('Test user is read only');
  }
  next();
};

export default checkTestUser;
