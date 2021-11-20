const db = require('../db');

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

const getPhotosQueryText = `
SELECT id,
  url
FROM answers_photos
WHERE answer_id = $1;
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

const markQuestionHelpful = (questionId) => (
  // return a promise and let the router resolve it
  db.query(markHelpfulQueryText, [questionId])
);

module.exports.getQuestions = getQuestions;
module.exports.markHelpful = markQuestionHelpful;
