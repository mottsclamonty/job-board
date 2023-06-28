import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minLength: 3,
    maxLength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 6,
    select: false,
  },
  lastName: {
    type: String,
    maxLength: 20,
    default: 'Smith',
    trim: true,
  },
  location: {
    type: String,
    maxLength: 20,
    default: 'My City',
    trim: true,
  },
});

// Sign and return a jwt with userID as payload
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  const hashedPW = await bcrypt.hash(this.password, salt);
  this.password = hashedPW;
});

export default mongoose.model('User', UserSchema);
