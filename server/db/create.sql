-- id,product_id,body,date_written,asker_name,asker_email,reported,helpful
CREATE TABLE questions (
  id SERIAL UNIQUE PRIMARY KEY,
  product_id INTEGER not null,
  body character varying(1000),
  date_written bigint not null,
  asker character varying(60) not null,
  email text not null,
  reported boolean not null DEFAULT FALSE,
  helpful INTEGER not null DEFAULT 0
);
COPY questions
from 'questions.csv' DELIMITER ',' CSV HEADER;
ALTER TABLE questions
ALTER COLUMN date_written
SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + date_written * interval '1 millisecond';
--id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful
CREATE TABLE answers (
  id SERIAL UNIQUE PRIMARY KEY,
  question_id INTEGER references questions(id),
  body character varying(1000) not null,
  date_written bigint,
  answerer character varying(60) not null,
  email text not null,
  reported boolean DEFAULT FALSE,
  helpful integer DEFAULT 0
);
COPY answers
from 'answers.csv' DELIMITER ',' CSV HEADER;
ALTER TABLE answers
ALTER COLUMN date_written
SET DATA TYPE timestamp with time zone USING timestamp with time zone 'epoch' + date_written * interval '1 millisecond';
CREATE TABLE answers_photos (
  id SERIAL UNIQUE PRIMARY KEY,
  answer_id INTEGER references answers(id),
  url text not null
);
COPY answers_photos
FROM 'answers_photos.csv' DELIMITER ',' CSV HEADER;
ALTER TABLE questions
ALTER COLUMN date_written
SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE answers
ALTER COLUMN date_written
SET DEFAULT CURRENT_TIMESTAMP;
