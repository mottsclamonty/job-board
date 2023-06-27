import express from 'express';
const authRouter = express.Router();

import { login, register, updateUser } from '../controllers/authController.js';

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/updateUser').patch(updateUser);

export default authRouter;
