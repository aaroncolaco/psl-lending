'use strict';

const UnverifiedUser = require('./unverifiedUserModel');
const User = require('./model');


const createUser = (attributes) => {
  const newUser = User(attributes);
  return newUser.save();
};


const deleteUser = (id) => User.findByIdAndRemove(id);


const findUser = (where) => User.findOne(where);


const searchUsers = (limit, where) => {
  limit = Math.min(Math.max(limit, 1), 100); // between [0,100] only

  return User.find(where)
    .limit(limit)
    .sort({ name: 1 });
};


const updateUser = (where, attributes) => {
  return User.findOne(where)
    .then(user => {
      if (!user) {
        return Promise.resolve(false);
      }
      return user.update(attributes);
    }, err => {
      return Promise.reject(err);
    });
};


// unverified Users
const createUnverifiedUser = (attributes) => {
  const where = {
    email: attributes.email
  };

  return findUser(where)
    .then(user => {
      if (user) {
        return Promise.resolve(false);
      }
      const newUser = UnverifiedUser(attributes);
      return newUser.save();
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

const deleteUnverifiedUsers = (where) => UnverifiedUser.remove(where);

const findUnverifiedUser = (where) => UnverifiedUser.findOne(where);


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
