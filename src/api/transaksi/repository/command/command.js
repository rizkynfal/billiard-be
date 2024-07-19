const { ErrorHandler } = require("../../../../handler/error");
const pg = require("../../../../config/db/db");

class TransaksiCommand {
  constructor() {}
  async createTransaksi(data) {
    try {
      const query = `INSERT INTO public.transaksi_tb(transaksi_id, user_id, tanggal_transaksi, status_transaksi, payment_method, total_lama_sewa, total_harga, produk, nama_penyewa, no_hp)  VALUES ('${data.transaksiId}', '${data.userId}', '${data.tanggalTransaksi}', '${data.status}', '${data.paymentMethod}', '${data.lamaSewa}', '${data.price}', '${data.produk}','${data.nama}','${data.noHp}')`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async updateTransaksiStatus(data) {
    try {
      const query = `UPDATE transaksi_tb SET status_transaksi = ${data.statusTransaksi} , payment_method = ${data.paymenMethod} WHERE transaksi_id LIKE ${data.transaksiId}`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiCommand;
