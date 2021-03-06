'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');


const config = require('./config');

const deals = require('./deals/router');
const users = require('./users/router');

const app = express();

app.use(config.getEnv() === 'development' ? logger('dev') : logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*Mongoose promises are depreciated. Hence, plug in native promises*/
mongoose.Promise = global.Promise;
mongoose.connect(config.getDbConnectionString(), {useMongoClient: true}, function(err) {
  // Info
  console.log('Environment: ' + config.getEnv());
  console.log('MongoDB: ' + config.getDbConnectionString());

  if (err) {
    console.error(err);
  } else {
    console.log('Connected to MongoDB successfully');
  }
});

app.use('/api/deals', deals);
app.use('/api/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end("Error. Check Console.");
});

module.exports = app;
