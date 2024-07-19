const { DB } = require("../../../../config/db/conn");
const { ErrorHandler } = require("../../../../handler/error");
const MidtransClient = require("../../../../service/midtrans_handler");
const { util } = require("../../../../utils");
const BookingQuery = require("./query");
const query = new BookingQuery();
class BookingQueryHandler {
  constructor() {
    this.db = new DB();
  }
  async getAllBookingList() {
    try {
      var response = await query.getAllBookingList();
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
      const data = {
        bookingId: param,
      };
      var response = await query.getBookingByBookingId(data);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getBookingByTransaksiId(param) {
    try {
      const data = {
        transaksiId: param,
      };
      var response = await query.getBookingByTransaksiId(data);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = BookingQueryHandler;
