/* eslint-disable camelcase */
const express = require('express');
const answersController = require('../controllers/answers');
const router = express.Router();

router.get('/qa/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.params;
  const page = req.query.page === undefined ? 1 : req.query.page;
  const count = req.query.count === undefined ? 5 : req.query.count;
  const offset = (page - 1) * count;
  answersController.getAnswers(question_id, page, count, offset).then((result) => {
    res.json(result);
  });
});

router.post('/qa/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.params;
  const {
    body,
    name,
    email,
    photos,
  } = req.body;
  answersController.insert(question_id, body, name, email, photos).then(() => {
    res.status(201).end();
  }).catch((error) => {
    console.error(error);
    res.status(500).end();
  });
});

router.put('/qa/answers/:answer_id/helpful', (req, res) => {
  const { answer_id } = req.params;
  answersController.markHelpful(answer_id).then(() => {
    res.status(204).end();
  }).catch((error) => {
    console.error(error.stack);
    res.status(500).end();
  });
});

router.put('/qa/answers/:answer_id/report', (req, res) => {
  const { answer_id } = req.params;
  answersController.report(answer_id).then(() => {
    res.status(204).end();
  }).catch((error) => {
    console.error(error.stack);
    res.status(500).end();
  });
});

module.exports = router;
