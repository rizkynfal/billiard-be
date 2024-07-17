const ProdukQueryModel = require("./query_model");
const ProdukQuery = require("./query");
const { ErrorHandler } = require("../../../handler/error");
const { DB } = require("../../../config/db");
const { util } = require("../../../utils");

class ProdukQueryHandler {
  constructor() {
    this.db = new DB();
    this.model = new ProdukQueryModel();
    this.handler = new ProdukQuery(this.db.db);
  }
  async getAllAvailableProduct(params) {
    const sql = {
      text: `SELECT DISTINCT a.product_id,a.nama,a.deskripsi FROM product_tb a JOIN(SELECT * FROM booking_tb b WHERE b.tanggal_booking LIKE $1 || '%')b ON b.product_id <> a.product_id ORDER BY a.product_id`,
      values: [params.tanggal],
    };

    try {
      var responses;
      await this.db.db
        .query(sql)
        .then((a) => {
          responses =
            a.rows.length < 1 ? "Tidak ada produk yang available" : a.rows;
        })
        .catch((e) => {
          throw new ErrorHandler.ServerError(e);
        });

      return responses;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getByNama(nama) {
    try {
      const sql = {
        text: `SELECT nama FROM product_tb WHERE nama LIKE $1`,
        values: [nama],
      };

      var response = await this.handler.getProduct(sql);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getAll() {
    try {
      const sql = "SELECT * FROM product_tb GROUP BY product_id";

      var response = await this.handler.getProduct(sql);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}

module.exports = ProdukQueryHandler;
