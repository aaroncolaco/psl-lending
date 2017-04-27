'use strict';

const admin = require('firebase-admin');
const config = require('../config');

const serviceAccount = config.getFirebaseServiceAccount();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://resource-lending.firebaseio.com"
});

const notify = (to, notification) => admin.messaging().sendToDevice(to, notification);

module.exports = {
  notify
};
