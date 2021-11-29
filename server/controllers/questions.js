const db = require('../db');
const photosController = require('./photos');

const getQuestionsQueryText = `
SELECT id AS question_id,
  body AS question_body,
  date_written AS question_date,
  asker AS asker_name,
  helpful AS question_helpfulness,
  reported
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
  helpful AS helpfulness,
  question_id
FROM answers
WHERE reported IS FALSE
  AND question_id = $1;
`;

const getAnswers = (questionId) => (
  db.query(getAnswersQueryText, [questionId])
);

const getAnswersForEachQuestion = (rows) => (
  Promise.all(
    rows.map((row) => (getAnswers(row.question_id))),
  )
);

const getPhotos = (answerId) => (
  db.query(photosController.getPhotosQueryText, [answerId]).then((result) => (result.rows))
);

const getQuestions = (productId, page, count) => {
  // get all rows from questions table
  const offset = (page - 1) * count;
  const output = { product_id: productId, results: null };
  return db.query(getQuestionsQueryText, [productId, count, offset])
    .then((questionsResults) => {
      output.results = questionsResults.rows;
      const promises = [];
      output.results.forEach((questionResult) => {
        promises.push(getAnswers(questionResult.question_id)
          .then((answersResults) => {
            const answers = Object.fromEntries(
              answersResults.rows.map((row) => ([row.id, row])),
            );
            // const answers = answersResultsRows.map((row))
            // eslint-disable-next-line no-param-reassign
            questionResult.answers = answers;
          }));
      });
      return Promise.all(promises);
    })
    .then(() => {
      // const photosPromises = [];
      // answersResultsRows.forEach((rowsList) => {
      //   rowsList.forEach((row) => {
      //     photosPromises.push(getPhotos(row.id));
      //   });
      // });
    }).then(() => (output))
    // .then((photosResults) => (photosResults.rows))))
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
module.exports.getPhotos = getPhotos;
