const pg = require("pg");
const { Pool, Client } = pg;
const fs = require("fs");
require("dotenv").config();
const { DB_ENVIRONMENT, util, apiConstants } = require("../../utils/index");
const { ErrorHandler } = require("../../handler/error");

class DB {
  constructor(
    user = DB_ENVIRONMENT.DB_USER,
    host = DB_ENVIRONMENT.DB_HOST,
    database = DB_ENVIRONMENT.DB_DATABASE,
    password = DB_ENVIRONMENT.DB_PASS,

    port = DB_ENVIRONMENT.DB_PORT
  ) {
    this.user = user;
    this.host = host;
    this.database = database;
    this.password = password;
    this.port = port;
    this.db = new Pool({
      user: this.user,
      host: this.host,
      database: this.database,
      password: this.password,
      port: this.port,
      ssl: true,
    });
  }
  async connect() {
    try {
      await this.db.connect();
      // console.log("db connected successfully");
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
      // console.log(error);
    }
  }
}

exports.DB = DB;
