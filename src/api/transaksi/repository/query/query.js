const pg = require("../../../../config/db/db");
const { ErrorHandler } = require("../../../../handler/error");

class TransaksiQuery {
  constructor() {}
  async getAllTransaksi() {
    try {
      const query = `SELECT * FROM transaksi_tb`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransaksiById(data) {
    try {
      const query = `SELECT * FROM transaksi_tb WHERE transaksi_id = '${data.transaksiId}'`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransaksiByUserId(data) {
    try {
      const query = `SELECT * FROM transaksi_tb WHERE user_id = '${data.userId}'`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiQuery;
