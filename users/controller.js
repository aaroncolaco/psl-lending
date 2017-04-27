'use strict';

const _ = require('lodash');

const helpers = require('./helpers');
const lib = require('./lib');
const notifications = require('../notifications');


// verified users

const deleteUser = (req, res) => {
  helpers.deleteUser(req.params.id)
    .then(user => {
      if (!user) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      res.status(200).json(user);
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not delete User", err);
    });
};

const getUserById = (req, res) => {
  const where = {
    _id: req.params.id
  };

  helpers.findUser(where)
    .then(user => {
      if (!user) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      res.status(200).json(user);
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not delete User", err);
    });
};

const getUsers = (req, res) => {
  const where = {};
  let limit = 10;

  if (req.query.hasOwnProperty('ethAccount') && _.isString(req.query.ethAccount)) {
    where.ethAccount = new RegExp(req.query.ethAccount.trim(), 'i');
  }
  if (req.query.hasOwnProperty('name') && _.isString(req.query.name)) {
    where.name = new RegExp(req.query.name.trim(), 'i');
  }
  if (req.query.hasOwnProperty('email') && _.isString(req.query.email)) {
    where.email = new RegExp(req.query.email.trim(), 'i');
  }
  if (req.query.hasOwnProperty('limit') && _.isInteger(parseInt(req.query.limit))) {
    limit = parseInt(req.query.limit);
  }

  helpers.searchUsers(limit, where)
    .then(users => {
      if (!users) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      res.status(200).json(users);
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not delete User", err);
    });
};

// after user is confirmed, init account
const initUserAccount = (req, res) => {
  // can init user only once
  // user who hasnt been initialized yet will have `firebaseToken` & `ethAccount` equal ' '
  const where = {
    _id: req.params.id,
    ethAccount: '',
    publicKey: ''
  };

  const attributes = {};

  // `ethAccount` & `publicKey` are required to init account
  if (!(req.body.hasOwnProperty('ethAccount') && _.isString(req.body.ethAccount))) {
    return errorResponse(res, "Bad Data", Error("Bad Data. Send ethAccount."), 400);
  }
  if (!(req.body.hasOwnProperty('publicKey') && _.isString(req.body.publicKey))) {
    return errorResponse(res, "Bad Data", Error("Bad Data. Send publicKey."), 400);
  }

  attributes.ethAccount = req.body.ethAccount;
  attributes.publicKey = req.body.publicKey;

  if (req.body.hasOwnProperty('firebaseToken') && _.isString(req.body.firebaseToken)) {
    attributes.firebaseToken = req.body.firebaseToken;
  }
  if (req.body.hasOwnProperty('name') && _.isString(req.body.name)) {
    attributes.name = req.body.name;
  }


  helpers.updateUser(where, attributes)
    .then(success => {
      if (!success) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      return res.status(202).json({ status: 202, message: "Created Account" });
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not delete User", err);
    });
};

const updateUser = (req, res) => {
  const where = {
    _id: req.params.id
  };

  const attributes = {};

  if (req.body.hasOwnProperty('firebaseToken') && _.isString(req.body.firebaseToken)) {
    attributes.firebaseToken = req.body.firebaseToken;
  }
  if (req.body.hasOwnProperty('name') && _.isString(req.body.name)) {
    attributes.name = req.body.name;
  }

  helpers.updateUser(where, attributes)
    .then(success => {
      if (!success) {
        return errorResponse(res, "Not found", Error("Not found"), 404);
      }
      return res.status(202).json({ status: 202, message: "Updated" });
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not delete User", err);
    });
};



const signUp = (req, res) => {
  const otp = lib.generateOtp();
  const attributes = {
    email: req.body.email,
    name: req.body.name,
    otp,
    attempts: 0
  };
  let unverifiedUser = {};

  helpers.createUnverifiedUser(attributes)
    .then(user => {
      if (!user) {
        return errorResponse(res, "User already registered", Error("User already registered"), 409);
      }
      unverifiedUser = user;
      return lib.sendOtp(user.email, user.otp)
        .then(success => {
          return res.status(201).json(unverifiedUser);
        });
    })
    .catch(err => {
      console.error(err);
      return errorResponse(res, "Could not create User", err);
    });
};

const verifyUser = (req, res) => {
  const id = req.params.id;
  const otp = req.body.otp;

  lib.verifyUser(id, otp)
    .then(verifiedUser => {
      return res.status(202).send(verifiedUser);
    })
    .catch((err) => {
      console.error(err);
      return errorResponse(res, err.message || "Something went wrong", err, err.status || 500);
    });
};


const errorResponse = (res, message, error, status = 500) =>
  res.status(status).json({ "status": status, "message": message, "error": error });


module.exports = {
  deleteUser,
  getUserById,
  getUsers,
  initUserAccount,
  updateUser,

  signUp,
  verifyUser
};
