const pg = require("../../../../config/db/db");
class BookingQuery {
  constructor() {}
  async getAllBookingList() {
    const query = `SELECT  a.booking_id, a.tanggal_booking, a.jam_booking, b.email, b.nama as nama_penyewa, b.no_hp,c.transaksi_id, d.product_id, c.total_lama_sewa, d.nama FROM booking_tb a 
    JOIN user_tb b ON a.user_id = b.user_id 
    JOIN transaksi_tb c ON a.transaksi_id = c.transaksi_id 
    JOIN product_tb d ON a.product_id = d.product_id ORDER BY a.tanggal_booking`;
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
  async getBookingByTanggal(data) {
    const query = `SELECT * FROM booking_tb WHERE tanggal_booking = '${data.tanggal}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getBookingList(data) {
    const query = `SELECT * FROM booking_tb WHERE tanggal_booking BETWEEN '${
      data.filterTanggal.split(" - ")[0]
    }' AND '${
      data.filterTanggal.split(" - ")[1]
    }' ORDER BY tanggal_booking ASC`;
    const res = await pg.dbQuery(query);
    return res;
  }
}
module.exports = BookingQuery;
