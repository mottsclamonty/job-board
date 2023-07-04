import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }
  const user = await User.create({ name, email, password });

  // jwt token containing userID
  const token = user.createJWT();

  // storing jwt in cookie
  attachCookie({ res, token });

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },

    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // If email or password isn't provided throw an error
  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ email }).select('+password');

  // If user doesn't exist throw an error
  if (!user) {
    throw new UnauthenticatedError(
      'No account is registered with that email. Please try again.'
    );
  }
  const passwordMatches = await user.comparePassword(password, user.password);

  // If password isn't correct throw an error
  if (!passwordMatches) {
    throw new UnauthenticatedError(
      'The email and password provided do not match our records. Please try again.'
    );
  }

  const token = user.createJWT();

  // set password to null for payload to frontend
  user.password = null;

  // storing jwt in cookie
  attachCookie({ res, token });

  // Return the user minus password and its jwt
  res.status(StatusCodes.OK).json({
    user,
    location: user.location,
  });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();

  // storing jwt in cookie
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logoutCurrentUser = async (req, res) => {
  res.clearCookie('token');
  res.status(StatusCodes.OK).end();
};

export { register, login, updateUser, getCurrentUser, logoutCurrentUser };
