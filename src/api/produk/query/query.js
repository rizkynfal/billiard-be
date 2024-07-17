const { ErrorHandler } = require("../../../handler/error");

class ProdukQuery {
  constructor(db) {
    this.db = db;
  }
  async getProduct(query) {
    try {
      const res = await this.db.query(query);
      return res;
    } catch (err) {
      throw new ErrorHandler.ServerError(err);
    }
  }
}
module.exports = ProdukQuery;
