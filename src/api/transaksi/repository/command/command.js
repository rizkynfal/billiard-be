const { ErrorHandler } = require("../../../../handler/error");
const pg = require("../../../../config/db/db");

class TransaksiCommand {
  constructor() {}
  async createTransaksi(data) {
    const query = `INSERT INTO public.transaksi_tb(transaksi_id, user_id, tanggal_transaksi, status_transaksi, payment_method, total_lama_sewa, total_harga, produk, nama_penyewa, no_hp, jam_transaksi)  VALUES ('${data.transaksiId}', '${data.userId}', '${data.tanggalTransaksi}', '${data.status}', '${data.paymentMethod}', '${data.lamaSewa}', '${data.price}', '${data.produk}','${data.nama}','${data.noHp}','${data.jamTransaksi}')`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async updateTransaksiStatus(data) {
    const query = `UPDATE transaksi_tb SET status_transaksi = '${data.statusTransaksi}' , payment_method = '${data.paymenMethod}' WHERE transaksi_id LIKE '${data.transaksiId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async deleteTransaksiById(data) {
    const query = `DELETE FROM transaksi_tb WHERE transaksi_id ='${data.transaksiId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async deleteAllTransaksi() {
    const query = `DELETE FROM transaki_tb`;
    const res = await pg.dbQuery(query);
    return res;
  }
}
module.exports = TransaksiCommand;
