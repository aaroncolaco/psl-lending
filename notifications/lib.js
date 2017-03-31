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
    .then(function(response) {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });
};


const to = "cAMma8M1Y_8:APA91bGdADCOZH9uMGDf8hvXA8S-l7HHlhZKrc1unQidjj8gVIrlcIuGapMtZuSQqVyPWJ2fdyivP00AD7PoKDJv9KlvcGMjGdPYBwXdhTOv84Q8HOXqoFc2BfeKnQokT3-IHzTubPn3";
const payload = {
  "message": "Hello World",
};
// notify(to, payload);

module.exports = {
  notify
};
