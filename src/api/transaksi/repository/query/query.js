const pg = require("../../../../config/db/db");
const { ErrorHandler } = require("../../../../handler/error");
var validate = require("validate.js");
class TransaksiQuery {
  constructor() {}
  async getAllTransaksi() {
    const query = `SELECT a.transaksi_id, b.nama as nama_penyewa, b.no_hp, a.total_lama_sewa, a.tanggal_transaksi,a.jam_transaksi,a.status_transaksi, a.total_harga, c.nama as nama_produk, a.payment_method, (a.produk::json->'jamMain') as jam_main 
      FROM transaksi_tb a JOIN user_tb b ON b.user_id = a.user_id JOIN product_tb c ON c.product_id = SPLIT_PART((a.produk::json->'produk_id')::varchar, '"', 2) WHERE a.is_deleted <> true ORDER BY tanggal_transaksi`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiByProdukIdAndTanggal(data) {
    const query = `SELECT b.product_id, b.nama, b.harga, b.deskripsi, (produk::json->'jamMain')::varchar as booked FROM transaksi_tb a JOIN product_tb b ON '${data.produkId}' = SPLIT_PART((a.produk::json->'produk_id')::varchar, '"', 2) 
	AND a.tanggal_transaksi = '${data.tanggal}' AND b.product_id = '${data.produkId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiById(data) {
    const query = `SELECT * FROM transaksi_tb WHERE transaksi_id = '${data.transaksiId}' AND is_deleted <> true`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiByUserId(data) {
    const query = `SELECT * FROM transaksi_tb WHERE user_id = '${data.userId}' AND is_deleted <> true`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiList(data) {
    let sql = `SELECT * FROM transaksi_tb  `;
    let count = 0;
    let value = [];
    let conditions = [];
    if (
      typeof data.filterTanggal !== "undefined" ||
      data.filterTanggal !== "" ||
      !validate.isEmpty(data.filterTanggal)
    ) {
      if (count == 0) {
        conditions.push(
          `WHERE tanggal_transaksi BETWEEN '${
            data.filterTanggal.split(" - ")[0]
          }' AND '${
            data.filterTanggal.split(" - ")[1]
          }  AND is_deleted <> true'`
        );
      } else {
        conditions.push(
          ` tanggal_transaksi BETWEEN  '${
            data.filterTanggal.split(" - ")[0]
          }' AND '${
            data.filterTanggal.split(" - ")[1]
          }' ORDER BY tanggal_transaksi ASC`
        );
      }
      value.push(`%${data.email}%`);
      count++;
    }

    if (
      typeof data.paymentSuccess !== undefined ||
      data.paymentSuccess !== "" ||
      !validate.isEmpty(data.paymentSuccess)
    ) {
      var statusTransaksi = data.paymentSuccess ? "Success" : "failed";
      if (count == 0) {
        conditions.push(
          `WHERE status_transaksi ILIKE '${statusTransaksi}' AND is_deleted <> true`
        );
      } else {
        conditions.push(
          ` status_transaksi ILIKE '${statusTransaksi}' ORDER BY tanggal_transaksi ASC`
        );
      }
      count++;
    }
    sql += conditions.join(" AND ");
    try {
      const res = await pg.dbQuery(sql);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiQuery;
