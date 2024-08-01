const { ErrorHandler } = require("../../../handler/error");
const pg = require("../../../config/db/db");
class ProdukQuery {
  constructor() {}

  async getAllProduct(data) {
    let query = "SELECT DISTINCT * FROM product_tb";
    if (data && data.noMeja) {
      query += ` WHERE nama = '${"MEJA " + data.noMeja}' `;
    }
    query += " ORDER BY nama";
    const res = await pg.dbQuery(query);
    return res;
  }
  async getAllPhoto() {
    const query = `SELECT mime_type,foto_product FROM product_tb GROUP BY product_id`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getPhotoById(data) {
    const query = `SELECT mime_type,foto_product FROM product_tb WHERE product_id ='${data.produkId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getProductByNama(data) {
    const query = `SELECT nama FROM product_tb WHERE nama ILIKE '${data.nama}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getProductById(data) {
    const query = `SELECT * FROM product_tb WHERE product_id = '${data.produkId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async getUsedProduk() {
    try {
      const query = `SELECT DISTINCT a.product_id, a.nama FROM product_tb a JOIN booking_tb b ON b.product_id = a.product_id`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (err) {
      throw new ErrorHandler.ServerError(err);
    }
  }
  async getAllAvailableProduct(data) {
    const query = `SELECT DISTINCT a.product_id, a.nama, a.harga, a.deskripsi, a.foto_product, a.mime_type FROM product_tb a JOIN(SELECT * FROM booking_tb b WHERE b.tanggal_booking = '${data.tanggal}')b ON b.product_id <> a.product_id ORDER BY a.nama`;

    const res = await pg.dbQuery(query);
    return res;
  }
  async getAllBookedProduct(data) {
    const query = `SELECT DISTINCT a.product_id, a.nama, a.harga, a.deskripsi, a.foto_product, a.mime_type FROM product_tb a JOIN(SELECT * FROM booking_tb b WHERE b.tanggal_booking = '${data.tanggal}')b ON b.product_id = a.product_id ORDER BY a.nama`;

    const res = await pg.dbQuery(query);
    return res;
  }
  async getProdukJamAvailable(data) {
    const query = `SELECT * FROM product_time_item_tb WHERE product_id = ${data.id} AND tanggal =${data.tanggal} ORDER BY a.nama`;
    const res = await pg.dbQuery(query);
    return res;
  }
}
module.exports = ProdukQuery;
