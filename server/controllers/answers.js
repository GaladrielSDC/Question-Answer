const db = require('../db');
const photosController = require('./photos');

const getAnswerQueryText = `
SELECT id AS answer_id, body, date_written AS date, answerer AS answerer_name, helpful AS helpfulness
FROM answers
  WHERE question_id = $1
  AND reported IS FALSE
  LIMIT $2
  OFFSET $3
`;

const getAnswers = (questionId, page, count, offset) => (
  db.query(getAnswerQueryText, [questionId, count, offset]).then(
    (answerResults) => (
      // const answerIds = answerResult.rows.map((row) => row.answer_id);
      // const promises = answerIds.map((id) => db.query(photosQuery, [id]));
      // Promise.all(promises)
      //   .then((values) => res.json(
      //     answerResult.rows,
      //   ));
      {
        question: questionId,
        page,
        count,
        results: answerResults.rows,
      }
    ),
  )
    .catch((e) => console.error(e.stack))
);

const insertQueryText = `
INSERT INTO answers(question_id, body, answerer, email)
VALUES($1, $2, $3, $4)
RETURNING id;
`;

const insert = (questionId, body, name, email, photos) => (
  // insert answer
  db.query(insertQueryText, [questionId, body, name, email])
    .then((result) => {
      const answerId = result.rows[0].id;
      return photos.map((url) => photosController.insertPhoto(answerId, url));
    })
);

const markHelpfulQueryText = `
UPDATE answers
SET helpful = helpful + 1
WHERE id = $1;
`;

const markHelpful = (answerId) => (
  db.query(markHelpfulQueryText, [answerId])
);

const reportQueryText = `
UPDATE answers
SET reported = true
WHERE id = $1;
`;

const report = (answerId) => (
  db.query(reportQueryText, [answerId])
);

module.exports.getAnswers = getAnswers;
module.exports.markHelpful = markHelpful;
module.exports.report = report;
module.exports.insert = insert;
