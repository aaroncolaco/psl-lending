'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const unverifiedUserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    minlength: [3, 'Text less than 3 char'],
    required: [true, '{PATH} is required'],
    trim: true
  },
  name: {
    type: String,
    minlength: [3, 'Text less than 3 char'],
    required: [true, '{PATH} is required'],
    trim: true,
  },
  otp: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true
  },
  verified: {
    type: Boolean,
    required: [true, '{PATH} is required'],
  }
}, {
  timestamps: true
});


/*****
  '.methods' - instance method
  '.statics' - class method
*****/

// called implicitly when returning user object to API as json
// making sure the password, salt, hash and sensitive data is not sent
unverifiedUserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email', 'name']);
};

const unverifiedUser = mongoose.model('unverifiedUser', unverifiedUserSchema);

module.exports = unverifiedUser;
