const express = require('express');
const db = require('../db');
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

module.exports = router;
