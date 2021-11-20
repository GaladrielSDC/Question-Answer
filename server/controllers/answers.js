const db = require('../db');

const getAnswerQueryText = `

`;

const getAnswers = () => {};

const markHelpfulQueryText = `
UPDATE answers
SET helpful = helpful + 1
WHERE id = $1;
`;

const markHelpful = (answerId) => (
  db.query(markHelpfulQueryText, [answerId])
);

module.exports.getAnswers = getAnswers;
module.exports.markHelpful = markHelpful;
