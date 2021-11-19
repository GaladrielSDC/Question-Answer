const db = require('../db');

const questionQueryText = `
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

const answerQueryText = `
SELECT id,
  body,
  date_written AS date,
  answerer AS answerer_name,
  helpful AS helpfulness
FROM answers
WHERE reported IS FALSE
  AND question_id = $1;
`;

const photoQueryText = `
SELECT id,
  url
FROM answers_photos
WHERE answer_id = $1;
`;

const getQuestions = (productId, page, count) => {
  // get all rows from questions table
  const offset = (page - 1) * count;
  return db.query(questionQueryText, [productId, count, offset])
    .then((questionsResults) => {
      const answersPromises = Promise.all(questionsResults.rows.map((row) => (
        db.query(answerQueryText, [row.id])
      )));
      return {
        product_id: productId,
        results: questionsResults.rows,
      };
    })
    .catch((e) => console.error(e.stack));
  // run a query for each of these rows
};

module.exports.getQuestions = getQuestions;
