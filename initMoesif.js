
'use strict';

const moesif = require('moesif-nodejs');

const options = {
  applicationId: 'Your Application Id',
  logBody: true,
  debug: true,
  disableBatching: true
};

const moesifMiddleware = moesif(options);

// moesifMiddleware.startCaptureOutgoing();

exports.moesifMiddleware = moesifMiddleware;
