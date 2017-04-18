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
      from: '"PSL Microlending" <' + adminEmail +'>', // sender address
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
  const emailBodyHtml = `<!DOCTYPE html><meta content="text/html; charset=UTF-8"http-equiv=Content-Type><meta content="width=device-width,initial-scale=1"name=viewport><title>Account verification Email</title><style>@import url(http://fonts.googleapis.com/css?family=Droid+Sans);img{max-width:600px;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic}a{text-decoration:none;border:0;outline:0;color:#bbb}a img{border:none}h1,h2,h3,td{font-family:Helvetica,Arial,sans-serif;font-weight:400}td{text-align:center}body{-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none;width:100%;height:100%;color:#37302d;background:#fff;font-size:16px}table{border-collapse:collapse!important}.headline{color:#fff;font-size:34px}.force-full-width{width:100%!important}.step-width{width:110px;height:111px}.otp{font-size:2em;color:#fff}</style><style media=screen>@media screen{h1,h2,h3,td{font-family:'Droid Sans','Helvetica Neue',Arial,sans-serif!important}}</style><style media="only screen and (max-width:480px)">@media only screen and (max-width:480px){table[class=w320]{width:320px!important}img[class=step-width]{width:80px!important;height:81px!important}}</style><body bgcolor=#ffffff class=body style=padding:0;margin:0;display:block;background:#fff;-webkit-text-size-adjust:none><table align=center cellpadding=0 cellspacing=0 height=100% width=100%><tr><td align=center valign=top bgcolor=#ffffff width=100%><center><table style="margin:0 auto"cellpadding=0 cellspacing=0 width=600 class=w320><tr><td align=center valign=top><table style="margin:0 auto"style="margin:0 auto"cellpadding=0 cellspacing=0 width=100%><tr><td style=font-size:30px;text-align:center><br>PSL Microlending<br><br></table><table style="margin:0 auto"cellpadding=0 cellspacing=0 width=100% bgcolor=#4dbfbf><tr><td class=headline><br>Registration Almost Complete!<tr><td><br><center><table style="margin:0 auto"cellpadding=0 cellspacing=0 class=force-width-80><tr><td><img alt="step one"src=https://www.filepicker.io/api/file/MMVdxAuqQuy7nqVEjmPV class=step-width><td><img alt="step two"src=https://www.filepicker.io/api/file/QKOMsiThQcePodddaOHk class=step-width><td><img alt="step three"src=https://www.filepicker.io/api/file/qnkuUNPS6TptLRIjWERA class=step-width><tr><td style=vertical-align:top;color:#187272;font-weight:700>Register<td style=vertical-align:top;color:#187272;font-weight:700>Verify<td style=vertical-align:top;color:#187272;font-weight:700>Done!</table></center><tr><td><center><table style="margin:0 auto"cellpadding=0 cellspacing=0 width=60%><tr><td style=color:#187272><br><br>Your account has successfully been created! Use OTP below to verify and get started!<br><br></table></center><tr><td><div><br><!--[if mso]><v:roundrect xmlns:v=urn:schemas-microsoft-com:vml xmlns:w=urn:schemas-microsoft-com:office:word href=http:// style=height:50px;v-text-anchor:middle;width:200px arcsize=8% stroke=f fillcolor=#178f8f><w:anchorlock><center><![endif]--> <a href=""class=otp>${otp}</a><!--[if mso]><![endif]--></div><br><br></table><table style="margin:0 auto"cellpadding=0 cellspacing=0 width=100% bgcolor=#f5774e><tr><td style=background-color:#f5774e class=headline><br>New Features<tr><td><img alt="meter image"src=https://www.filepicker.io/api/file/tjUsYjIHSDCkrrniLuev height=89 width=145><tr><td><center><table style="margin:0 auto"cellpadding=0 cellspacing=0 width=60%><tr><td style=color:#933f24><br>Security and Reliablibity for all users! If security is what you need, we‘ve got you covered!<br><br></table></center><tr><td><div><!--[if mso]><v:roundrect xmlns:v=urn:schemas-microsoft-com:vml xmlns:w=urn:schemas-microsoft-com:office:word href=http:// style=height:50px;v-text-anchor:middle;width:200px arcsize=8% stroke=f fillcolor=#ac4d2f><w:anchorlock><center><![endif]--> <a href=""style=background-color:#ac4d2f;border-radius:4px;color:#fff;display:inline-block;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;line-height:50px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none>Learn More</a><!--[if mso]><![endif]--></div><br><br></table><table style="margin:0 auto"style="margin:0 auto"cellpadding=0 cellspacing=0 bgcolor=#414141 class=force-full-width><tr><td style=background-color:#414141><br><br><img alt=google+ src=https://www.filepicker.io/api/file/R4VBTe2UQeGdAlM7KDc4> <img alt=facebook src=https://www.filepicker.io/api/file/cvmSPOdlRaWQZnKFnBGt> <img alt=twitter src=https://www.filepicker.io/api/file/Gvu32apSQDqLMb40pvYe><br><br><tr><td style=color:#bbb;font-size:12px><a href=#>View in browser</a> | <a href=#>Unsubscribe</a> | <a href=#>Contact</a><br><br><tr><td style=color:#bbb;font-size:12px>© 2017 Persistent Systems Ltd. All Rights Reserved<br><br></table></table></center></table>`
  return sendEmail(to, emailBodyPlainText, emailBodyHtml);
};

const verifyUser = (id, otp) => {

  const otpValidity = 4; // making otp valid for 4 hours since creation

  const now = new Date();
  now.setHours(now.getHours() - otpValidity);

  const validTime = new Date(now);

  const where = {
    _id: id,
    otp,
    createdAt: {$gte: validTime}
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

        // set verified to true
        user.update({"verified": true})
          .then((success) => {
          }, (err) => {
            console.error(err);
          });

        helpers.deleteUnverifiedUsers({"email": user.email}, (err, removedCount) => {
          if (err) {
            console.error(err);
          }
        })

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
