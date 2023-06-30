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

// Provide a jwt with userID as payload
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Compare provided password
UserSchema.methods.comparePassword = async function (providedPW) {
  const passwordMatch = bcrypt.compare(providedPW, this.password);
  return passwordMatch;
};

UserSchema.pre('save', async function () {
  // Only hash password if field is being modified - Else don't bother to prevent error being thrown
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', UserSchema);
