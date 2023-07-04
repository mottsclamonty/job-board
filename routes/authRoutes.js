import express from 'express';
import authenticateUser from '../middleware/auth.js';
import checkTestUser from '../middleware/checkTestUser.js';
import rateLimiter from 'express-rate-limit';

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // max 10 login requests
  message:
    "You've tried to login too many times. Please try again in 15 minutes",
});
const authRouter = express.Router();

import {
  login,
  register,
  updateUser,
  getCurrentUser,
  logoutCurrentUser,
} from '../controllers/authController.js';

authRouter.route('/register').post(limiter, register);
authRouter.route('/login').post(limiter, login);
authRouter
  .route('/updateUser')
  .patch(authenticateUser, checkTestUser, updateUser);
authRouter.route('/getCurrentUser').get(authenticateUser, getCurrentUser);
authRouter.route('/logoutCurrentUser').get(logoutCurrentUser);
export default authRouter;
