const pactum = require('pactum');

const url = 'http://localhost:3000/';

describe('Questions', () => {
  test('has a get questions endpoint', async () => {
    await pactum.spec()
      .get(`${url}qa/questions?product_id=6270`)
      .expectStatus(200)
      .expectJsonSchemaAt('product_id', { type: 'string' })
      .expectJsonSchemaAt('results', { type: 'array' });
  });
});

describe('Answers', () => {
  test('has a get answers endpoint', async () => {
    await pactum.spec()
      .get(`${url}qa/questions/22091/answers`)
      .expectStatus(200)
      .expectBodyContains('question')
      .expectBodyContains('page')
      .expectBodyContains('count')
      .expectBodyContains('results')
      .expectJsonSchemaAt('results', { type: 'array' });
  });
});
