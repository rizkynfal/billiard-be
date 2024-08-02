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
    const query = `SELECT b.product_id, b.nama, b.harga, b.deskripsi, (produk::json->'jamMain')::varchar as booked FROM transaksi_tb a JOIN product_tb b ON '${data.produkId}' = SPLIT_PART((a.produk::json->'produk_id')::varchar, '"', 2) AND b.product_id = '${data.produkId}' AND a.tanggal_transaksi = '${data.tanggal}'`;

    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiByProdukIdAndTanggalBookJoin(data) {
    const query = `SELECT b.product_id, b.nama, b.harga, b.deskripsi, (produk::json->'jamMain')::varchar as booked FROM transaksi_tb a JOIN product_tb b ON '${data.produkId}' = SPLIT_PART((a.produk::json->'produk_id')::varchar, '"', 2) AND b.product_id = '${data.produkId}' JOIN booking_tb c ON a.transaksi_id = c.transaksi_id  AND a.tanggal_transaksi = '${data.tanggal}'`;

    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiByUserIdAndTanggal(data) {
    const query = `SELECT a.transaksi_id,a.user_id,a.tanggal_transaksi,a.jam_transaksi, a.status_transaksi, a.total_lama_sewa, a.total_harga,a.produk, a.nama_penyewa, a.no_hp, b.product_id,b.nama as nama_meja, b.foto_product
    FROM transaksi_tb a JOIN product_tb b ON b.product_id = SPLIT_PART((a.produk::json->'produk_id')::varchar, '"', 2) AND a.user_id = '${data.userId}' AND a.tanggal_transaksi = '${data.tanggal}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiById(data) {
    const query = `SELECT a.transaksi_id, a.user_id,a.tanggal_transaksi,a.jam_transaksi, a.status_transaksi, a.total_lama_sewa, a.total_harga,a.produk, a.nama_penyewa, a.no_hp, b.product_id as product_id,b.nama as nama_meja, b.foto_product FROM transaksi_tb a JOIN product_tb b ON b.product_id = SPLIT_PART((a.produk::json->'produk_id')::varchar, '"', 2) AND a.transaksi_id = '${data.transaksiId}' AND a.is_deleted = false`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiByTanggal(data) {
    const query = `SELECT a.transaksi_id, a.user_id,a.tanggal_transaksi,a.jam_transaksi, a.status_transaksi, a.total_lama_sewa, a.total_harga,a.produk, a.nama_penyewa, a.no_hp, b.product_id as product_id,b.nama as nama_meja, b.foto_product FROM transaksi_tb a JOIN product_tb b ON b.product_id = SPLIT_PART((a.produk::json->'produk_id')::varchar, '"', 2) AND a.tanggal_transaksi = '${data.tanggal}' AND a.is_deleted = false`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiByUserId(data) {
    const query = `SELECT a.transaksi_id,a.user_id,a.tanggal_transaksi,a.jam_transaksi, a.status_transaksi, a.total_lama_sewa, a.total_harga,a.produk, a.nama_penyewa, a.no_hp, b.product_id,b.nama as nama_meja, b.foto_product
    FROM transaksi_tb a JOIN product_tb b ON b.product_id = SPLIT_PART((a.produk::json->'produk_id')::varchar, '"', 2) AND a.user_id = '${data.userId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getTransaksiList(data) {
    let sql = `SELECT * FROM transaksi_tb  `;
    let count = 0;

    if (data.namaPenyewa) {
      sql += ` JOIN user_tb ON user_tb.nama ILIKE '%${data.namaPenyewa}%'`;
    }
    if (data.filterTanggal) {
      if (count == 0) {
        sql += ` WHERE tanggal_transaksi BETWEEN '${
          data.filterTanggal.split(" - ")[0]
        }' AND '${data.filterTanggal.split(" - ")[1]}'`;
      } else {
        sql += ` tanggal_transaksi BETWEEN  '${
          data.filterTanggal.split(" - ")[0]
        }' AND '${data.filterTanggal.split(" - ")[1]}' `;
      }
      count++;
    }

    if (data.paymentSuccess) {
      if (count == 0) {
        sql += ` WHERE status_transaksi ILIKE '${data.paymentSuccess}'`;
      } else {
        sql += ` AND status_transaksi ILIKE '${data.paymentSuccess}' `;
      }
      count++;
    }
    sql += ` AND is_deleted <> true ORDER BY transaksi_tb.tanggal_transaksi`;

    const res = await pg.dbQuery(sql);
    return res;
  }
}
module.exports = TransaksiQuery;
