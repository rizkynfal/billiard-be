const { ErrorHandler } = require("../../../../handler/error");
const pg = require("../../../../config/db/db");
class BookingCommand {
  constructor() {}
  async createBooking(data) {
    try {
      const query = `INSERT INTO booking_tb (booking_id, total_lama_sewa, user_id, product_id, tanggal_booking, transaksi_id, jam_booking) VALUES ('${data.orderId}', '${data.lamaSewa}', '${data.userId}', '${data.produkId}', '${data.tanggalBooking}', '${data.transaksiId}','${data.jamBooking}')`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = BookingCommand;
