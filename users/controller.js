'use strict';

const _ = require('lodash');

const helpers = require('./helpers');
const notifications = require('../notifications');


const createUser = (req, res) => {
  const attributes = {
    email : req.body.email,
    ethAccount : req.body.ethAccount,
    firebaseToken: req.body.firebaseToken,
    name : req.body.name
  };

  helpers.createUser(attributes, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(201).json(user);
  });
};

const deleteUser = (req, res) => {

  const where = {
    _id: req.params.id
  };

  helpers.deleteUser(where, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(200).json(user);
  });
};

const getUserById = (req, res) => {
  const where = {
    _id: req.params.id
  };

  helpers.findUser(where, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(200).json(user);
  });
};

const getUsers = (req, res) => {
  const query = req.query;
  const where = {};
  let limit = 10;

  if (query.hasOwnProperty('ethAccount') && _.isString(query.ethAccount)) {
    where.ethAccount = new RegExp(query.ethAccount.trim(), 'i');
  };
  if (query.hasOwnProperty('name') && _.isString(query.name)) {
    where.name = new RegExp(query.name.trim(), 'i');
  };
  if (query.hasOwnProperty('email') && _.isString(query.email)) {
    where.email = new RegExp(query.email.trim(), 'i');
  };
  if (query.hasOwnProperty('limit') && _.isInteger(query.limit)) {
    limit = query.limit;
  };

  helpers.searchUsers(limit, where, (err, users) => {
    if (err) {
      console.log(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(200).json(users);
  });
};

const updateUser = (req, res) => {
  const where = {
    _id: req.params.id
  };

  const attributes = {
    email : req.body.email,
    ethAccount : req.body.ethAccount,
    firebaseToken: req.body.firebaseToken,
    name : req.body.name
  };

  helpers.updateUser(where, attributes, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(202).json(user);
  });
};


module.exports = {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser
};
