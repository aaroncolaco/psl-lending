'use strict';

const admin = require('firebase-admin');
const config = require('../config');

const serviceAccount = config.getFirebaseServiceAccount();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://resource-lending.firebaseio.com"
});

const notify = (to, data) => {

  const notification = {
    data
  };

  admin.messaging().sendToDevice(to, notification)
    .then((response) => {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
};

module.exports = {
  notify
};
