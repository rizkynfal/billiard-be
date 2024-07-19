const { ErrorHandler } = require("../../../handler/error");
const pg = require("../../../config/db/db");
class ProdukQuery {
  constructor() {}

  async getAllProduct() {
    try {
      const query = "SELECT * FROM product_tb";
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getAllPhoto() {
    try {
      const query = `SELECT mime_type,foto_product FROM product_tb GROUP BY product_id`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getPhotoById(data) {
    try {
      const query = `SELECT mime_type,foto_product FROM product_tb WHERE product_id ='${data.produkId}'`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getProductByNama(data) {
    try {
      const query = `SELECT nama FROM product_tb WHERE nama LIKE '${data.nama}'`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getAllAvailableProduct(data) {
    try {
      const query = `SELECT DISTINCT a.product_id,a.nama,a.deskripsi FROM product_tb a JOIN(SELECT * FROM booking_tb b WHERE b.tanggal_booking LIKE '${data.tanggal}' || '%')b ON b.product_id <> a.product_id ORDER BY a.product_id`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = ProdukQuery;
