import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
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

export default mongoose.model('User', userSchema);
