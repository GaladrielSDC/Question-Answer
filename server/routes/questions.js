const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/qa/questions', (req, res) => {
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

module.exports = router;
