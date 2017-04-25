'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    minlength: [3, 'Text less than 3 char'],
    required: [true, '{PATH} is required'],
    trim: true,
    unique: true
  },
  firebaseToken: {
    type: String,
    default: ' ',
    required: [true, '{PATH} is required'],
    trim: true
  },
  name: {
    type: String,
    minlength: [3, 'Text less than 3 char'],
    required: [true, '{PATH} is required'],
    trim: true
  },
  ethAccount: {
    type: String,
    trim: true
  },
  publicKey: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email', 'firebaseToken', 'name', 'ethAccount', 'publicKey']);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
