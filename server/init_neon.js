const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

async function initDb() {
  if (!databaseUrl) {
    console.error("DATABASE_URL is missing");
    return;
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Neon");

    const sql = fs.readFileSync(path.join(__dirname, 'neon_schema.sql'), 'utf8');
    console.log("Running schema initialization...");
    await client.query(sql);
    console.log("Schema initialized successfully");
  } catch (err) {
    console.error("Error initializing schema:", err);
  } finally {
    await client.end();
  }
}

initDb();
