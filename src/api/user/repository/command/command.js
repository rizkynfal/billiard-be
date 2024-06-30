const { ErrorHandler } = require("../../../../handler/error");

class UserCommand {
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
}
module.exports = UserCommand;
