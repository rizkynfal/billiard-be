const { DB } = require("../../../../config/db");
const { ErrorHandler } = require("../../../../handler/error");
const MidtransClient = require("../../../../service/midtrans_handler");
const { util } = require("../../../../utils");
const BookingQuery = require("./query");

class TransaksiQueryHandler {
  constructor() {
    this.db = new DB();
  }
  async getAllTransaksiList() {
    try {
      const sql = util.queryGetAllSQL("transaksi");
      const query = new BookingQuery(this.db.db, sql);
      var response = await query.getTransaksi(sql);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransacionStatus(param) {
    try {
      const midtransClient = new MidtransClient(param);
      var response = await midtransClient.getTransactionStatus();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionById(param) {
    try {
      const sql = {
        text: "SELECT * FROM transaksi_tb WHERE transaksi_id = $1",
        values: [param],
      };
      const query = new BookingQuery(this.db.db, sql);
      var response = await query.getTransaksi();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionByUserId(param) {
    try {
      const sql = {
        text: "SELECT * FROM transaksi_tb WHERE user_id = $1",
        values: [param],
      };
      const query = new BookingQuery(this.db.db, sql);
      var response = await query.getTransaksi();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiQueryHandler;
