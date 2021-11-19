/* eslint-disable camelcase */
const express = require('express');
const db = require('./db');
const app = express();
const questions = require('./routes/questions');
const answers = require('./routes/answers');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', questions);
app.use('/', answers);

app.get('/qa', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Q&A API server listening at http://localhost:${port}`);
});
