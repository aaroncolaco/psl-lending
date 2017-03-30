'use strict';

const helpers = require('./helpers');
const notifications = require('../notifications');


const createUser = (req, res) => {
  const attributes = {
    email : req.body.email,
    ethAccount : req.body.ethAccount,
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

const updateUser = (req, res) => {
  const where = {
    _id: req.params.id
  };

  const attributes = {
    email : req.body.email,
    ethAccount : req.body.ethAccount,
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
  updateUser
};
