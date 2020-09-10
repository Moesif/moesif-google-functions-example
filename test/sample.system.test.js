// [START functions_http_system_test]
const assert = require('assert');
const Supertest = require('supertest');

console.log(
  `system testing against deployed google functions on baseurl: ${process.env.BASE_URL}`
);

const supertest = Supertest(process.env.BASE_URL);

describe('system tests', () => {
  it('should trigger syncedOutgoing', async () => {
    await supertest
      .get('/syncedOutgoing?index=10')
      .expect(200)
      .expect((response) => {
        console.log(response.body);
        assert.strictEqual(response.body.id, 10);
      });
  });

  it('should trigger delayedOutgoing', async () => {
    await supertest
      .get('/delayedOutgoing?count=5&name=Jon')
      .expect(200)
      .expect((response) => {
        console.log(response.text);
        assert.strictEqual(response.text, 'Hello Jon!');
      });
  });

  it('should trigger expressApp get', async () => {
    await supertest
     .get('/expressApp/endpoints/6')
     .expect(200)
     .expect((response) => {
       console.log(response.body);
       assert.strictEqual(response.body.endpoint, 'test');
     });
  });

  it('should trigger expressApp post', async () => {
    await supertest
     .post('/expressApp/endpoints')
     .send({
       name: 'George'
     })
     .expect(201)
     .expect((response) => {
       console.log(response.body);
       assert.strictEqual(response.body.endpoint, 'test');
       assert.strictEqual(response.body.name, 'George');
       assert.strictEqual(response.body.id, '50');
     });
  });
});
