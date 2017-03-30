'use strict';

const lib = require('./lib');

module.exports = {
  notifyUser : (to, notification) => {
    return lib.notify(to, notification);
  }
};
