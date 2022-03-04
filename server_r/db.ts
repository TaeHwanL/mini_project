import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  password: "940330",
  host: "localhost",
  port: 5432,
  database: "postgres",
});

module.exports = pool;
