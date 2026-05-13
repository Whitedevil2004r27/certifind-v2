const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.warn("⚠️ WARNING: Missing DATABASE_URL in server environment.");
}

const sql = neon(databaseUrl);

module.exports = sql;

