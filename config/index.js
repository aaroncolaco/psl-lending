'use strict';

const config = require('./config');
const env = process.env.NODE_ENV || 'development';
const envtConfig = config[env]; // env specific values

module.exports = {
  getEnv: () => {
    return env;
  },
  getDbConnectionString: () => {
    return process.env.DB_URL || envtConfig.dbString;
  },
  getFcmServerKey: () => {
    return process.env.FCM_SERVER_KEY || envtConfig.fcmServerKey;
  },
  getStatusMsgs: () => {
    return config.statusMsgs;
  },
  getURL: () => {
    return envtConfig.url;
  }
};
