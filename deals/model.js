'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dealSchema = new Schema({
  ethereumId: {
    type: String,
    required: [true, '{PATH} is required'],
    trim: true,
    minlength: [5, 'Text less than 5 char']
  },
  lenderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['created', 'accepted', 'rejected', 'closed'],
    default: 'created',
    required: [true, '{PATH} is required'],
    trim: true
  },
  txIds: {
    type: [String],
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
