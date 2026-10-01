// Import Pool class from pg module
const { Pool } = require('pg');

// Load environment variables
require('dotenv').config();

// Create a new Pool instance with the database configuration to manage connections
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Export an object with a single method to query the database
module.exports = {
  query: (text, params) => pool.query(text, params),
};
