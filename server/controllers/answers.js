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
