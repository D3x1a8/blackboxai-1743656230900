const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'pritesh',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'yaalgo_db',
  password: process.env.DB_PASSWORD || 'admin@123',
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
