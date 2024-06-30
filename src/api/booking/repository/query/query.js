const { ErrorHandler } = require("../../../../handler/error");

class BookingQuery {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
  }
  async getBooking() {
    try {
      const res = await this.db.query(this.sql);
      return res.rows;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = BookingQuery;
