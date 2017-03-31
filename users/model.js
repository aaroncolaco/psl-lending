'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true,
    lowercase: true,
    minlength: [3, 'Text less than 3 char']
  },
  firebaseToken: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true,
    minlength: [3, 'Text less than 3 char']
  },
  ethAccount: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
