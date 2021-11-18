const { Pool } = require('pg');

const pool = new Pool({
  user: '',
  host: 'localhost',
  database: 'qa',
  password: '',
  port: 5432,
});


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}