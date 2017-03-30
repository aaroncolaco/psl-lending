'use strict';

const FCM = require('fcm-push');

const config = require('../config');

const serverkey = config.getFcmServerKey();
const fcm = FCM(serverkey);

const notify = (to, notification) => {
  const message = {
    to,
    collapse_key: 'collapseKey',
    data: notification,
  };
  fcm.send(message, (err, response) => {
    if (err) {
      console.log("Something has gone wrong !");
    } else {
      console.log("Successfully sent with resposne :", response);
    }
  });
};


module.exports = {
  notify
};
