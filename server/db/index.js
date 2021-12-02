const { Pool } = require('pg');
require('dotenv').config();
const connectionString = process.env.DB_URL;
console.log(process.env.DB_URL);
const pool = new Pool({ connectionString });

module.exports = {
  query: (text, params, callback) => (
    pool.query(text, params, callback)
  ),
};
