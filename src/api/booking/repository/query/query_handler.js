const { DB } = require("../../../../config/db");
const { ErrorHandler } = require("../../../../handler/error");
const MidtransClient = require("../../../../service/midtrans_handler");
const { util } = require("../../../../utils");
const BookingQuery = require("./query");

class BookingQueryHandler {
  constructor() {
    this.db = new DB();
  }
  async getAllBookingList() {
    try {
      const sql = util.queryGetAllSQL("booking");
      const query = new BookingQuery(this.db.db, sql);
      var response = await query.getBooking(sql);
      response = response.rows
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getBookingStatus(param) {
    try {
      const midtransClient = new MidtransClient(param);
      var response = await midtransClient.getTransactionStatus();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getBookingById(param) {
    try {
      const sql = {
        text: "SELECT * FROM booking_tb WHERE booking_id = $1",
        values: [param],
      };
      const query = new BookingQuery(this.db.db, sql);
      var response = await query.getBooking();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getBookingByTransaksiId(param) {
    try {
      const sql = {
        text: "SELECT * FROM booking_tb WHERE transaksi_id = $1",
        values: [param],
      };
      const query = new BookingQuery(this.db.db, sql);
      var response = await query.getBooking();
      return response.rows;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = BookingQueryHandler;
