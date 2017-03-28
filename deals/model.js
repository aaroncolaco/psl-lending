'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dealSchema = new Schema({
  lenderId: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true,
    minlength: [3, 'Text less than 3 char']
  },
  borrowerId: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true,
    minlength: [2, 'Text less than 2 char']
  },
  accepted: {
    type: Boolean,
    required: [true, '{PATH} is required'],
    trim: true,
    minlength: [10, 'Text less than 10 char']
  },
  txIds: {
    type: [String],
    trim: true,
    minlength: [3, 'Text less than 3 char']
  },
  lenderSig: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true,
    minlength: [3, 'Text less than 3 char']
  },
  borrowerSig: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true,
    minlength: [3, 'Text less than 3 char']
  },
  textHash: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true,
    minlength: [3, 'Text less than 3 char']
  }
}, {
  timestamps: true
});

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
