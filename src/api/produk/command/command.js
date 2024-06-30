const { ErrorHandler } = require("../../../handler/error");
const ProdukQueryHandler = require("../query/query_handler");

class ProdukCommand {
  constructor(db, query) {
    this.db = db;
    this.query = query;
  }
  async create() {
    try {
      const res = await this.db.query(this.query);
      return res;
    } catch (err) {
      throw new ErrorHandler.ServerError(err);
    }
  }
  async delete() {
    try {
      const res = await this.db.query(this.query);
      return res;
    } catch (err) {
      throw new ErrorHandler.ServerError(err);
    }
  }
}
module.exports = ProdukCommand;
