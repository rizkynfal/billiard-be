const pg = require("pg");
require("dotenv").config();

const { ErrorHandler } = require("../../handler/error");

class DB {
  constructor(config) {
    this.connectionPool = [];
    this.config = config;
  }
  async createConnectPool() {
    try {
      const currConnnection = this.connectionPool.findIndex(
        (val) => val.config.toString() === config.toString()
      );
      if (currConnnection === -1) {
        const db = new pg.Pool(this.config);
        this.connectionPool.push({ config: this.config, conn: db });
        return db;
      } else {
        return currConnnection;
      }
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getConnDB() {
    const currConnnection = this.connectionPool.find(
      (val) => val.config.toString() === config.toString()
    );
    return currConnnection ? currConnnection.conn : undefined;
  }
}

exports.DB = DB;
