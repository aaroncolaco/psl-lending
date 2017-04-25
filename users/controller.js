'use strict';

const _ = require('lodash');

const helpers = require('./helpers');
const lib = require('./lib');
const notifications = require('../notifications');


// verified users

const deleteUser = (req, res) => {

  const where = {
    _id: req.params.id
  };

  helpers.deleteUser(where, (err, user) => {
    if (err) {
      console.error(err);
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
      console.error(err);
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
  }
  if (query.hasOwnProperty('name') && _.isString(query.name)) {
    where.name = new RegExp(query.name.trim(), 'i');
  }
  if (query.hasOwnProperty('email') && _.isString(query.email)) {
    where.email = new RegExp(query.email.trim(), 'i');
  }
  if (query.hasOwnProperty('limit') && _.isInteger(parseInt(query.limit))) {
    limit = parseInt(query.limit);
  }

  helpers.searchUsers(limit, where, (err, users) => {
    if (err) {
      console.error(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(200).json(users);
  });
};

const updateUser = (req, res) => {
  const body = _.pick(req.body, ['ethAccount', 'firebaseToken', 'name', 'publicKey']);
  const where = {
    _id: req.params.id
  };

  const attributes = {};

  if (body.hasOwnProperty('ethAccount') && _.isString(body.ethAccount)) {
    attributes.ethAccount = body.ethAccount;
  }
  if (body.hasOwnProperty('firebaseToken') && _.isString(body.firebaseToken)) {
    attributes.firebaseToken = body.firebaseToken;
  }
  if (body.hasOwnProperty('name') && _.isString(body.name)) {
    attributes.name = body.name;
  }
  if (body.hasOwnProperty('publicKey') && _.isString(body.publicKey)) {
    attributes.publicKey = body.publicKey;
  }


  helpers.updateUser(where, attributes, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(err.status || 500).json(err);
    }
    res.status(202).json(user);
  });
};



const signUp = (req, res) => {
  const otp = lib.generateOtp();
  const attributes = {
    email : req.body.email,
    name : req.body.name,
    otp,
    attempts: 0
  };

  helpers.createUnverifiedUser(attributes, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(err.status || 500).json(err);
    }

    lib.sendOtp(user.email, user.otp)
      .then((success) => {
        return res.status(201).json(user);
      })
      .catch((error) => {
        console.error(error);
        return res.status(error.status || 500).json(error);
      });
  });
};

const verifyUser = (req, res) => {
  const id = req.params.id;
  const otp = req.body.otp;

  lib.verifyUser(id, otp)
    .then((verifiedUser) => {
      return res.status(202).send(verifiedUser);
    })
    .catch((err) => {
      console.error(err);
      return res.status(err.status || 500).json(err);
    });
};

module.exports = {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,

  signUp,
  verifyUser
};
