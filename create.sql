-- id,product_id,body,date_written,asker_name,asker_email,reported,helpful
CREATE TABLE questions (
  id SERIAL UNIQUE PRIMARY KEY,
  product_id INTEGER not null,
  body character varying(1000),
  date_written bigint,
  asker character varying(60),
  email text,
  reported boolean,
  helpful INTEGER
);
COPY questions
from 'questions.csv' DELIMITER ',' CSV HEADER;
ALTER TABLE questions
ALTER COLUMN date_written
SET DATA TYPE timestamp with time zone
USING timestamp with timezone 'epoch' + date_written * interval '1 millisecond';
