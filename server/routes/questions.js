/* eslint-disable camelcase */
const express = require('express');
const questionController = require('../controllers/questions');
const router = express.Router();

router.get('/qa/questions', (req, res) => {
  const { product_id } = req.query;
  const page = req.query.page === undefined ? 1 : req.query.page;
  const count = req.query.count === undefined ? 5 : req.query.count;
  // OFFSET says to skip that many rows before beginning to return rows.
  questionController.getQuestions(product_id, page, count).then((result) => {
    res.json(result);
  }).catch((error) => {
    console.error(error.stack);
    res.status(500);
    res.send(error);
  });
});

router.put('/qa/questions/:question_id/helpful', (req, res) => {
  const { question_id } = req.params;
  questionController.markHelpful(question_id).then(
    () => { res.status(204).end(); },
  );
});

router.put('/qa/questions/:question_id/report', (req, res) => {
  const { question_id } = req.params;
  questionController.report(question_id).then(
    () => { res.status(204).end(); },
  );
});

module.exports = router;
