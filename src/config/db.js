const mysql2 = require("mysql2/promise");
const env = require("./env.js");

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Missing required database environment variables.");
}

const db = mysql2.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
});

module.exports = db;
