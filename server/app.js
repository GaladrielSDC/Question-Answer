/* eslint-disable camelcase */
const express = require('express');
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

app.get('/loaderio-156fc831e2c494c54228d619be2627a2', (req, res) => res.send('loaderio-156fc831e2c494c54228d619be2627a2'));

app.listen(port, () => {
  console.log(`Q&A API server listening at http://localhost:${port}`);
});
