'use strict';

const nodemailer = require('nodemailer');

const helpers = require('./helpers');
const config = require('../config');
const env = config.getEnv();
const adminEmail = config.getAdminEmail();
const adminEmailPassword = config.getAdminEmailPassword();

const generateOtp = () => {
  if (env === 'production') {
    return getRandomIntInclusive(100000, 999999);
  }
  return '123456';
};

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const sendEmail = (to, emailBodyPlainText, emailBodyHtml) => {
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
      from: '"PSL Microlending" <' + adminEmail + '>', // sender address
      to: to, // list of receivers
      subject: 'OTP - Verify Your Microlending Account ✔', // Subject line
      text: emailBodyPlainText, // plain text body
      html: emailBodyHtml // html body
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
  const emailBodyPlainText = "Thank you for signing up for Microlending!\n\nYour OTP is: " + otp;
  const emailBodyHtml = `<!DOCTYPE html> <html> <head> <meta http-equiv=Content-Type content="text/html; charset=UTF-8" /> <meta name=viewport content="width=device-width, initial-scale=1" /> <title>Account verification Email</title> <style type=text/css>@import url(http://fonts.googleapis.com/css?family=Droid+Sans);img{max-width:600px;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic}a{text-decoration:none;border:0;outline:0;color:#bbb}a img{border:0}td,h1,h2,h3{font-family:Helvetica,Arial,sans-serif;font-weight:400}td{text-align:center}body{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;width:100%;height:100%;color:#37302d;background:#fff;font-size:16px}table{border-collapse:collapse!important}.headline{color:#fff;font-size:34px}.force-full-width{width:100%!important}.step-width{width:110px;height:111px}.otp{font-size:2em;color:#fff}.learn-more{font-size:1.4em;color:#fff}</style> <style type=text/css media=screen>@media screen{td,h1,h2,h3{font-family:'Droid Sans','Helvetica Neue','Arial','sans-serif'!important}}</style> <style type=text/css media="only screen and (max-width: 480px)">@media only screen and (max-width:480px){table[class="w320"]{width:320px!important}img[class="step-width"]{width:80px!important;height:81px!important}}</style> </head> <body class=body style=padding:0;margin:0;display:block;background:#fff;-webkit-text-size-adjust:none bgcolor=#ffffff> <table align=center cellpadding=0 cellspacing=0 width=100% height=100%> <tr> <td align=center valign=top bgcolor=#ffffff width=100%> <center> <table style="margin:0 auto" cellpadding=0 cellspacing=0 width=600 class=w320> <tr> <td align=center valign=top> <table style="margin:0 auto" cellpadding=0 cellspacing=0 width=100% style="margin:0 auto;"> <tr> <td style=font-size:30px;text-align:center> <br> Microlending <br> <br> </td> </tr> </table> <table style="margin:0 auto" cellpadding=0 cellspacing=0 width=100% bgcolor=#4dbfbf> <tr> <td class=headline> <br> Registration Almost Complete! </td> </tr> <tr> <td> <br> <center> <table style="margin:0 auto" cellspacing=0 cellpadding=0 class=force-width-80> <tr> <td> <img class=step-width src=https://www.filepicker.io/api/file/MMVdxAuqQuy7nqVEjmPV alt="step one"> </td> <td> <img class=step-width src=https://www.filepicker.io/api/file/QKOMsiThQcePodddaOHk alt="step two"> </td> <td> <img class=step-width src=https://www.filepicker.io/api/file/qnkuUNPS6TptLRIjWERA alt="step three"> </td> </tr> <tr> <td style=vertical-align:top;color:#187272;font-weight:bold> Register </td> <td style=vertical-align:top;color:#187272;font-weight:bold> Verify </td> <td style=vertical-align:top;color:#187272;font-weight:bold> Done! </td> </tr> </table> </center> </td> </tr> <tr> <td> <center> <table style="margin:0 auto" cellpadding=0 cellspacing=0 width=60%> <tr> <td style=color:#187272> <br> <br> Your account has successfully been created! Use OTP below to verify and get started! <br> <br> </td> </tr> </table> </center> </td> </tr> <tr> <td> <div> <br /> <p class=otp>${otp}</p> </div> <br> <br> </td> </tr> </table> <table style="margin:0 auto" cellpadding=0 cellspacing=0 width=100% bgcolor=#f5774e> <tr> <td style=background-color:#f5774e class=headline> <br> New Features </td> </tr> <tr> <td> <img src=https://www.filepicker.io/api/file/tjUsYjIHSDCkrrniLuev width=145 height=89 alt="meter image"> </td> </tr> <tr> <td> <center> <table style="margin:0 auto" cellpadding=0 cellspacing=0 width=60%> <tr> <td style=color:#933f24> <br> Security and Reliablibity for all users! If security is what you need, we‘ve got you covered! <br><br> </td> </tr> </table> </center> </td> </tr> <tr> <td> <div> <a class=learn-more href=https://google.com>Learn More</a> </div> <br> <br> </td> </tr> </table> <table style="margin:0 auto" width=100% cellpadding=0 cellspacing=0 class=force-full-width bgcolor=#414141> <tr> <td style=background-color:#414141> <br> <br> <img src=https://www.filepicker.io/api/file/R4VBTe2UQeGdAlM7KDc4 alt=google+> <img src=https://www.filepicker.io/api/file/cvmSPOdlRaWQZnKFnBGt alt=facebook> <img src=https://www.filepicker.io/api/file/Gvu32apSQDqLMb40pvYe alt=twitter> <br> <br> </td> </tr> <tr> <td style=color:#bbb;font-size:12px> <a href=#>View in browser</a> | <a href=#>Unsubscribe</a> | <a href=#>Contact</a> <br><br> </td> </tr> <tr> <td style=color:#bbb;font-size:12px> © 2017 All Rights Reserved <br> <br> </td> </tr> </table> </td> </tr> </table> </center> </td> </tr> </table> </body> </html>`;
  return sendEmail(to, emailBodyPlainText, emailBodyHtml);
};

const verifyUser = (id, otp) => {
  const otpValidity = 4; // making otp valid for 4 hours since creation

  const now = new Date();
  now.setHours(now.getHours() - otpValidity);
  const validTime = new Date(now);

  let tempUser = {};

  const where = {
    _id: id,
  };

  return helpers.findUnverifiedUser(where)
    .then(user => {
      if(!user) {
        return Promise.reject({ "status": 404, "message": "User not found" });
      }
      if (user.attempts >= 4) {
        // Exceeded number of attempts
        return Promise.reject({ "status": 429, "message": "Exceeded number of attempts" });
      }

      tempUser = user;

      // increment number of attempts
      return user.update({ "attempts": ++user.attempts });
    })
    .then(success => {
      if (tempUser.createdAt.valueOf() <= validTime.valueOf()) {
        // OTP expired
        return Promise.reject({ "status": 400, "message": "OTP Expired" });
      }

      if (tempUser.otp !== otp) {
        // wrong OTP
        return Promise.reject({ "status": 401, "message": "Incorrect OTP" });
      }

      return helpers.deleteUnverifiedUsers({ "email": tempUser.email });
    })
    .then(users => {
      // SUCCESS. add to (Registered) Users DB
      const attributes = {
        "email": tempUser.email,
        "ethAccount": ' ',
        "publicKey": ' ',
        "name": tempUser.name
      };

      return helpers.createUser(attributes)
    })
    .then(user => Promise.resolve(user))
    .catch(err => Promise.reject(err));
};

module.exports = {
  generateOtp,
  sendOtp,
  sendEmail,
  verifyUser
};
