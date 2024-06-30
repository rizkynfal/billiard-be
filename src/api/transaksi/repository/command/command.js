const { ErrorHandler } = require("../../../../handler/error");

class TransaksiCommand {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
  }
  async create() {
    try {
      const res = await this.db.query(this.sql);
      return res.rows;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiCommand;
