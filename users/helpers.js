'use strict';

const unverifiedUser = require('./unverifiedUserModel');
const User = require('./model');


const createUser = (attributes, callback) => {
  const newUser = User(attributes);

  newUser.save()
    .then((user) => {
      return callback(null, newUser);
    }, (err) => {
      return callback({"status": 400, "message": "Bad Data", "error": err}, null);
    });
};


const deleteUser = (where, callback) => {
  User.findByIdAndRemove(where)
    .then((user) => {
      if (!user) {
        return callback({"status": 404, "message": "Not found"}, null);
      }
      return callback(null, user);
    })
    .catch((err) => {
      return callback({"status": 500, "error": err}, null);
    });
};


const findUser = (where, callback) => {
  User.findOne(where)
    .then((user) => {
      if (!user) {
        return callback({"status": 404, "message": "Not found"}, null);
      }
      return callback(null, user);
    })
    .catch((err) => {
      return callback({"status": 500, "error": err}, null);
    });
};


const searchUsers = (limit, where, callback) => {
  limit = limit < 100 ? limit:10;
  User.find(where)
    .limit(50)  // how many to return
    .sort({ name: 1 })
    .then((users) => {
      if (!users) {
        return callback({"status": 404, "message": "Not found"}, null);
      }
      return callback(null, users);
    })
    .catch((err) => {
      return callback({"status": 500, "error": err}, null);
    });
};


const updateUser = (where, attributes, callback) => {
  const id = where.id;

  User.findOne(where)
    .then((user) => {
      if (!user) {
        return callback({"status": 404, "message": "Not found"}, null);
      } else {
        user.update(attributes).then(() => {
         return callback(null, true);
        }, (err) => {
          return callback({"status": 400, "error": "Bad data"}, null);
        });
      }
    }, (err) => {
      console.log(err);
      return callback({"status": 500, "error": err}, null);
    });
};


// unverified Users
const createUnverifiedUser = (attributes, callback) => {
  const where = {
    email: attributes.email
  };
  findUser(where, (err, verifiedUsers) => {
    if (err) {
      console.error(err);
    }
    if (!verifiedUsers) {
      const newUser = unverifiedUser(attributes);

      newUser.save()
        .then((user) => {
          return callback(null, newUser);
        }, (err) => {
          return callback({"status": 400, "message": "Bad Data", "error": err}, null);
        });
    } else {
      // if already registered, reject
      return callback({"status": 409, "message": "User Already Registered"}, null);
    }
  });
};

const deleteUnverifiedUsers = (where, callback) => {
  unverifiedUser.remove(where)
    .then((removed) => {
      if (!removed) {
        return callback({"status": 404, "message": "Not found"}, null);
      }
      return callback(null, removed);
    })
    .catch((err) => {
      return callback({"status": 500, "error": err}, null);
    });
};

const findUnverifiedUser = (where, callback) => {
  unverifiedUser.findOne(where)
    .then((user) => {
      if (!user) {
        return callback({"status": 404, "message": "Not found"}, null);
      }
      return callback(null, user);
    })
    .catch((err) => {
      return callback({"status": 500, "error": err}, null);
    });
};


module.exports = {
  createUser,
  deleteUser,
  findUser,
  searchUsers,
  updateUser,

  createUnverifiedUser,
  deleteUnverifiedUsers,
  findUnverifiedUser
};
