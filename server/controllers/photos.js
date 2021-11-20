const db = require('../db');

const getPhotosQueryText = `
SELECT id,
  url
FROM answers_photos
WHERE answer_id = $1
`;

const getPhotos = (answerId) => (db.query(getPhotosQueryText, [answerId]));

module.exports.getPhotos = getPhotos;
