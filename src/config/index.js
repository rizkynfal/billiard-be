const { DB_ENVIRONMENT } = require("../utils");

require("dotenv").config();
const { PORT } = process.env;
const port = PORT || 8000;
const pgConfig = {
  user: DB_ENVIRONMENT.DB_USER,
  host: DB_ENVIRONMENT.DB_HOST,
  database: DB_ENVIRONMENT.DB_DATABASE,
  password: DB_ENVIRONMENT.DB_PASS,
  port: DB_ENVIRONMENT.DB_PORT,
  ssl: false,
};
module.exports = {
  port,
  pgConfig,
};
