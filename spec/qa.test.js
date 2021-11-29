const pactum = require('pactum');

const url = 'http://localhost:3000/';

describe('Questions', () => {
  test('has a get questions endpoint', async () => {
    await pactum.spec()
      .get(`${url}qa/questions`)
      .expectStatus(200);
  });
});
