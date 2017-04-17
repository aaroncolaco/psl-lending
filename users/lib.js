'use strict';

const nodemailer = require('nodemailer');

const helpers = require('./helpers');
const config = require('../config');
const env = config.getEnv();
const adminEmail = config.getAdminEmail();
const adminEmailPassword = config.getAdminEmailPassword();

const generateOtp = () => {
  if (env === 'production') {
    return getRandomIntInclusive(1000, 9999);
  }
  return '1234';
};

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const sendEmail = (to, emailBody) => {
  return new Promise((resolve, reject) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'mail.persistent.co.in',
      port: 587,
      auth: {
        user: adminEmail,
        pass: adminEmailPassword
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"PSL Microlending" <' + adminEmail +'>', // sender address
      to: to, // list of receivers
      subject: 'OTP - Verify Your Microlending Account ✔', // Subject line
      text: emailBody, // plain text body
      html: '<b>' + emailBody + '</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      return resolve(true);
    });
  });
};

const sendOtp = (to, otp) => {
  // construct body of email and metadata and call `sendEmail` function to send
  const emailBody = "Thank you for signing up for Microlending!\n\nYour OTP is: " + otp;
  return sendEmail(to, emailBody);
};

const verifyUser = (id, otp) => {
  const where = {
    _id: id,
    otp
  };

  return new Promise((resolve, reject) => {
    helpers.findUnverifiedUser(where, (err, user) => {
      if (err) {
        return reject(err);
      } else if (user) {
        // add to (Registered) Users DB
        const attributes = {
          "email": user.email,
          "ethAccount": user.ethAccount,
          "name": user.name
        };

        helpers.createUser(attributes, (err, verifiedUser) => {
          if (err) {
            return reject(err);
          }
          return resolve(verifiedUser);
        });
      }
    });
  });
};

module.exports = {
  generateOtp,
  sendOtp,
  sendEmail,
  verifyUser
};
