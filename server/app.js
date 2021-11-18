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
  const offset = page * count;
  const text = `
    SELECT * FROM questions
      WHERE product_id = $1
      AND reported is FALSE
      LIMIT $2`;
  db.query(text, [product_id, count]).then((result) => {
    console.log(result.rows);
  })
    .catch((e) => console.error(e.stack));
  res.end();
});

app.listen(port, () => {
  console.log(`Q&A API server listening at http://localhost:${port}`);
});
