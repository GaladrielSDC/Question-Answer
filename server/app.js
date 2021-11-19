/* eslint-disable camelcase */
const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/qa', (req, res) => {
  res.send('Hello World');
});

app.get('/qa/questions', (req, res) => {
  const { product_id } = req.query;
  const page = req.query.page === undefined ? 1 : req.query.page;
  const count = req.query.count === undefined ? 5 : req.query.count;
  // OFFSET says to skip that many rows before beginning to return rows.
  const offset = (page - 1) * count;
  const text = `
    SELECT * FROM questions
      WHERE product_id = $1
      AND reported is FALSE
      LIMIT $2
      OFFSET $3`;
  db.query(text, [product_id, count, offset]).then((result) => {
    res.json({
      product_id,
      results: result.rows,
    });
  })
    .catch((e) => console.error(e.stack));
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.params;
  const page = req.query.page === undefined ? 1 : req.query.page;
  const count = req.query.count === undefined ? 5 : req.query.count;
  const offset = (page - 1) * count;
  const answersQuery = `
    SELECT id AS answer_id, body, date_written AS date, answerer AS answerer_name, helpful AS helpfulness
    FROM answers
      WHERE question_id = $1
      AND reported IS FALSE
      LIMIT $2
      OFFSET $3
  `;

  const photosQuery = 'SELECT id, url FROM answers_photos WHERE answer_id = $1';
  db.query(answersQuery, [question_id, count, offset]).then(
    (answerResult) => {
      const answerIds = answerResult.rows.map((row) => row.answer_id);
      const promises = answerIds.map((id) => db.query(photosQuery, [id]));
      Promise.all(promises)
        .then((values) => res.json(
          values.map((result) => result.rows),
        ));
    },
  )
    .catch((e) => console.error(e.stack));
});

app.listen(port, () => {
  console.log(`Q&A API server listening at http://localhost:${port}`);
});
