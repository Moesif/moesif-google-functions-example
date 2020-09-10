
const path = require('path');
const assert = require('assert');
const requestRetry = require('requestretry');
const uuid = require('uuid');
const sinon = require('sinon');
const execPromise = require('child-process-promise').exec;

const program = require('..');
const fileName = `test-${uuid.v4()}.txt`;
const bucketName = process.env.FUNCTIONS_BUCKET;

const startFF = (target, signature, port) => {
  const cwd = path.join(__dirname, '..');
  // exec's 'timeout' param won't kill children of "shim" /bin/sh process
  // Workaround: include "& sleep <TIMEOUT>; kill $!" in executed command
  return execPromise(
    `functions-framework --target=${target} --signature-type=${signature} --port=${port} & sleep 2; kill $!`,
    {shell: true, cwd}
  );
};

const httpInvocation = (fnUrl, port, body) => {
  const baseUrl = `http://localhost:${port}`;

  if (body) {
    // POST request
    return requestRetry.post({
      url: `${baseUrl}/${fnUrl}`,
      retryDelay: 400,
      body: body,
      json: true,
    });
  } else {
    // GET request
    return requestRetry.get({
      url: `${baseUrl}/${fnUrl}`,
      retryDelay: 400,
    });
  }
};

describe('index.test.js', () => {
  describe('functions_helloworld_get helloGET', () => {
    const PORT = 8081;
    let ffProc;

    before(() => {
      ffProc = startFF('helloGET', 'http', PORT);
    });

    after(async () => {
      await ffProc;
    });

    it('helloGET: should print hello world', async () => {
      const response = await httpInvocation('helloGET', PORT);

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body, 'Hello World!');
    });
  });

  describe('functions_syncedOutgoing syncedOutgoing', () => {
    const PORT = 8082;
    let ffProc;

    before(() => {
      ffProc = startFF('syncedOutgoing', 'http', PORT);
    });

    after(async () => {
      await ffProc;
    });

    it('syncedOutgoing: should get an body item', async () => {
      const response = await httpInvocation('syncedOutgoing?index=5', PORT);
      const jsonResult = JSON.parse(response.body);

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(jsonResult.id, 5);
    });
  });

  describe('functions_delayedOutgoing delayedOutgoing', () => {
    const PORT = 8083;
    let ffProc;

    before(() => {
      ffProc = startFF('delayedOutgoing', 'http', PORT);
    });

    after(async () => {
      await ffProc;
    });

    it('delayedOutgoing: should print a name via GET', async () => {
      const response = await httpInvocation('delayedOutgoing?name=John&count=5', PORT);

      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(response.body, 'Hello John!');
    });
  });

  describe('functions_expressApp expressApp', () => {
    const PORT = 8084;
    let ffProc;

    before(() => {
      ffProc = startFF('expressApp', 'http', PORT);
    });

    after(async () => {
      await ffProc;
    });

    it('expressApp: should get an example endpoint via GET', async () => {
      const response = await httpInvocation('endpoints/6', PORT);
      console.log(response.body);
      const jsonResult = JSON.parse(response.body);
      assert.strictEqual(response.statusCode, 200);
      assert.strictEqual(jsonResult.id, '6');
      assert.strictEqual(jsonResult.endpoint, 'test');
    });

    it('expressApp: should post a body via POST', async () => {
      const response = await httpInvocation('endpoints', PORT, { name: 'helloworld' });
      console.log(response.body);
      const jsonResult = response.body;
      assert.strictEqual(response.statusCode, 201);
      assert.strictEqual(jsonResult.id, '50');
      assert.strictEqual(jsonResult.name, 'helloworld');
      assert.strictEqual(jsonResult.endpoint, 'test');
    });
  });
});
