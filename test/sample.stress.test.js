// [START functions_http_system_test]
const assert = require('assert');
const Supertest = require('supertest');

console.log(
  `stress testing against deployed google functions on baseurl: ${process.env.BASE_URL}`
);

const supertest = Supertest(process.env.BASE_URL);

describe('stress tests', () => {
  it('should trigger syncedOutgoing 6 times', async () => {
    for (let index = 10; index <= 16; index++) {
      await supertest
        .get(`/syncedOutgoing?index=${index}`)
        .expect(200)
        .expect((response) => {
          console.log(response.body);
          assert.strictEqual(response.body.id, index);
        });
    }
  });

  it('should trigger delayedOutgoing 3 times', async () => {
    for (let index = 10; index <= 12; index++) {
      await supertest
        .get(`/delayedOutgoing?count=${4}&name=jon${index}`)
        .expect(200)
        .expect((response) => {
          console.log(response.text);
          assert.strictEqual(response.text, `Hello jon${index}!`);
        });
    }
  });

  it('should trigger expressApp get 3 times', async () => {
    for (let index = 20; index <= 22; index++) {
      await supertest
        .get(`/expressApp/endpoints/${index}`)
        .expect(200)
        .expect((response) => {
          console.log(response.body);
          assert.strictEqual(response.body.endpoint, 'test');
          assert.strictEqual(response.body.id, `${index}`);
        });
    }
  });
});
