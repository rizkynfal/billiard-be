const { ErrorHandler } = require("../../../../handler/error");
const pg = require("../../../../config/db/db");
class BookingQuery {
  constructor() {}
  async getAllBookingList() {
    const query = `SELECT * FROM booking_tb`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getBookingByBookingId(data) {
    const query = `SELECT * FROM booking_tb WHERE booking_id = '${data.bookingId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getBookingByTransaksiId(data) {
    const query = `SELECT * FROM booking_tb WHERE transaksi_id = '${data.transaksiId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
}
module.exports = BookingQuery;
