const db = require('../db');

const getPhotosQueryText = `
SELECT id,
  url,
  answer_id
FROM answers_photos
WHERE answer_id = $1
`;

const getPhotos = (answerId) => (db.query(getPhotosQueryText, [answerId]));

const insertPhotoQueryText = `
INSERT INTO answers_photos (answer_id, url)
VALUES ($1, $2);
`;

const insertPhoto = (answerId, url) => (db.query(insertPhotoQueryText, [answerId, url]));

module.exports.getPhotos = getPhotos;
module.exports.getPhotosQueryText = getPhotosQueryText;
module.exports.insertPhoto = insertPhoto;
