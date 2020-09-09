
'use strict';

const moesif = require('moesif-nodejs');

const options = {
  applicationId: 'Your Application Id',
  logBody: true,
  debug: true
};

const moesifMiddleware = moesif(options);

moesifMiddleware.startCaptureOutgoing();

exports.moesif = moesifMiddleware;
