'use strict';

// const lib = require('./lib');
// const events = require('./events');

module.exports = {
  notifyUser : (to, notification) => {
    return lib.notify(to, notification);
  }
};
