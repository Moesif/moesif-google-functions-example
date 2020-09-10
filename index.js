'use strict';

// [START functions_helloworld_http]
const escapeHtml = require('escape-html');
const axios = require('axios');
const { moesifMiddleware } = require('./initMoesif');
// [END functions_helloworld_http]

// [START functions_helloworld_get]
/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.helloGET = (req, res) => {
  res.send('Hello World!');
};
// [END functions_helloworld_get]

// [START functions_synced_outgoing]
/**
 * HTTP Cloud Function that calls on to a third party API.
 * that should be automatically instrumented by Moesif.
 * This is an example of synced call. but the sending to Moesif
 * should still be out of the band.
 *
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.syncedOutgoing = (req, res) => {
  console.log(JSON.stringify(req.query));

  const index = req.query.index ? parseInt(req.query.index, 10) : 1;

  axios
    .get(`https://jsonplaceholder.typicode.com/posts/${index}`)
    .then(function (response) {
      console.log('response from axios back');
      console.log(JSON.stringify(response.data));
      res.json(response.data);
    })
    .catch((err) => {
      res.status(500).json({
        error: String(err),
      });
    });
};
// [END functions_synced_outgoing]

// [START functions_delayedOutgoing]
/**
 * HTTP Cloud Function that calls on to a third party API.
 * that should be automatically instrumented by Moesif.
 * This is in batch and delayed.
 *s
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.delayedOutgoing = (req, res) => {
  console.log(JSON.stringify(req.query));

  const count = req.query.count ? parseInt(req.query.count, 10) : 1;

  setTimeout(() => {
    for (let index = 1; index < count; index++) {
      axios
        .get(`https://jsonplaceholder.typicode.com/todos/${index}`)
        .then(function (response) {
          console.log('response from axios back');
          console.log(JSON.stringify(response.data));
        });
    }
  }, 50);

  // axios.get('https://jsonplaceholder.typicode.com/todos/1').then(function (response) {
  //   console.log('response from axios back');
  //   console.log(JSON.stringify(response));
  // });
  res.send(`Hello ${req.query.name}!`);
};
// [END functions_delayedOutgoing]

// [Start express app example]
/**
 * An Express App with Moesif added as middleware.
 * This will instrument incoming API calls.
 *
 */
const express = require('express');
const app = express();
app.use(moesifMiddleware);

app.get('/endpoints/:id', (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    name: `name${id}`,
    endpoint: 'test',
    id: id,
  });
});

app.post('/endpoints', (req, res) => {
  const name = (req.body && req.body.name) || 'default';
  res.status(201).json({
    id: '50',
    name: name,
    endpoint: 'test',
  });
});

exports.expressApp = app;
// [End express app example]
