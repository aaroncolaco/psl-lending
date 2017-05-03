'use strict';

const lib = require('./lib');

module.exports = {
  notify : (to, notification) => lib.notify(to, notification)
};
