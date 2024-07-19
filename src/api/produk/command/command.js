const { ErrorHandler } = require("../../../handler/error");
const ProdukQueryHandler = require("../query/query_handler");
const pg = require("../../../config/db/db");
class ProdukCommand {
  constructor() {}
  async createProduk(data) {
    try {
      const query = `INSERT INTO product_tb(product_id,nama,harga,deskripsi,is_deleted,foto_product,mime_type) VALUES(${data.productId},${data.nama},${data.harga},${data.deskripsi},${data.isDeleted},${data.fotoProduk},${data.mimeType})`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (err) {
      throw new ErrorHandler.ServerError(err);
    }
  }
  async updateProdukById(data) {
    try {
      const query = `UPDATE product_tb SET is_deleted = true WHERE product_id = '${data.produkId}'`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (err) {
      throw new ErrorHandler.ServerError(err);
    }
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
  async deleteProdukById(data) {
    try {
      const query = `DELETE FROM product_tb WHERE product_id = ${data.produkId}`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (err) {
      throw new ErrorHandler.ServerError(err);
    }
  }
}
module.exports = ProdukCommand;
