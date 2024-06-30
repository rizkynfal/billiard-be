const { ErrorHandler } = require("../../../../handler/error");

class UserQuery {
  constructor(db, query) {
    this.db = db;
    this.query = query;
  }
  async getUser() {
  
    try {
      const res = await this.db.query(this.query);
      return res.rows;
    } catch (err) {
      throw new ErrorHandler.ServerError();
    }
  }
}
module.exports = UserQuery;
