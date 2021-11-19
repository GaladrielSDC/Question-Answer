const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/qa/questions/:question_id/answers', (req, res) => {
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

module.exports = router;