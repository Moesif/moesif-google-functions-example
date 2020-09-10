// [START functions_http_system_test]
const assert = require('assert');
const Supertest = require('supertest');

console.log(process.env.BASE_URL);

console.log(JSON.stringify(process.env));
// const supertest = Supertest(process.env.BASE_URL);

// describe('system tests', () => {
//   it('helloHttp: should print a name', async () => {
//     await supertest
//       .post('/helloHttp')
//       .send({name: 'John'})
//       .expect(200)
//       .expect((response) => {
//         assert.strictEqual(response.text, 'Hello John!');
//       });
//   });
//   // [END functions_http_system_test]

//   it('helloHttp: should print hello world', async () => {
//     await supertest
//       .get('/helloHttp')
//       .expect(200)
//       .expect((response) => {
//         assert.strictEqual(response.text, 'Hello World!');
//       });
//   });
// });
