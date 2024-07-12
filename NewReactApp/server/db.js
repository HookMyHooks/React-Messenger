// db.js
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'local_messenger',
  password: '1q2w3e',
  port: 5432,
});

module.exports = pool;
