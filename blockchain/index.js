'use strict';

const lib = require('./lib');

module.exports = {
  seedAccount : (amount, toAccount) => lib.seedAccount(amount, toAccount)
};
