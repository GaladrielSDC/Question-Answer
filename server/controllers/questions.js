const db = require('../db');
const photosController = require('./photos');

const getQuestionsQueryText = `
SELECT id AS question_id,
  body AS question_body,
  date_written AS question_date,
  asker AS asker_name,
  helpful AS question_helpfulness
  FROM questions
WHERE reported IS FALSE
  AND product_id = $1
LIMIT $2 OFFSET $3;
`;

const getAnswersQueryText = `
SELECT id,
  body,
  date_written AS date,
  answerer AS answerer_name,
  helpful AS helpfulness
FROM answers
WHERE reported IS FALSE
  AND question_id = $1;
`;

const getQuestions = (productId, page, count) => {
  // get all rows from questions table
  const offset = (page - 1) * count;
  return db.query(getQuestionsQueryText, [productId, count, offset])
    .then((questionsResults) => {
      const answersPromises = Promise.all(questionsResults.rows.map((row) => (
        db.query(getAnswersQueryText, [row.id])
      )));
      return {
        product_id: productId,
        results: questionsResults.rows,
      };
    })
    .catch((e) => console.error(e.stack));
  // run a query for each of these rows
};

const markHelpfulQueryText = `
UPDATE questions
SET helpful = helpful + 1
WHERE id = $1;
`;

const markHelpful = (questionId) => (
  // return a promise and let the router resolve it
  db.query(markHelpfulQueryText, [questionId])
);

const reportQueryText = `
UPDATE questions
SET reported = TRUE
WHERE id = $1;
`;

const report = (questionId) => (
  db.query(reportQueryText, [questionId])
);

// POST REQUESTS
const insertQueryText = `
INSERT INTO questions (product_id, body, asker, email)
VALUES ($1, $2, $3, $4);
`;

const insert = (productId, body, name, email) => (
  db.query(insertQueryText, [productId, body, name, email])
);

module.exports.getQuestions = getQuestions;
module.exports.markHelpful = markHelpful;
module.exports.report = report;
module.exports.insert = insert;
