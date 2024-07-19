const { DB } = require("../../../../config/db/conn");
const { ErrorHandler } = require("../../../../handler/error");
const MidtransClient = require("../../../../service/midtrans_handler");
const { util } = require("../../../../utils");
const TransaksiQuery = require("./query");
const query = new TransaksiQuery();

class TransaksiQueryHandler {
  constructor() {
    this.db = new DB();
  }
  async getAllTransaksiList() {
    try {
      var response = await query.getAllTransaksi();
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
      var response = await query.getTransaksiById({ transaksiId: param });
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionByUserId(param) {
    try {
      var response = await query.getTransaksiByUserId({ userId: param });
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiQueryHandler;
