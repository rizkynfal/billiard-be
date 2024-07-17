const { DB } = require("../../../config/db");
const { ErrorHandler } = require("../../../handler/error");
const { util } = require("../../../utils");
const ProdukQueryHandler = require("../query/query_handler");
const ProdukCommand = require("./command");
const ProdukCommandModel = require("./command_model");
const format = require("pg-format");
const errorHandler = ErrorHandler;
const queryHandler = new ProdukQueryHandler();
class ProdukCommandHandler {
  constructor() {
    this.db = new DB();
    this.model = new ProdukCommandModel();
  }
  async addProduk(body, file) {
    const data = body;

    let error = null;
    error = this.model.validateUserInput(data).error;
    const duplicateName = await queryHandler.getByNama(data.nama);
    if (duplicateName.rowCount > 0) {
      throw new errorHandler.BadRequestError(`Produk ${data.nama} Telah Ada`);
    }
    if (error) {
      throw new errorHandler.BadRequestError(error);
    } else {
      const totalProduk = await queryHandler.getAll();
      const hashedId = util.generateRandomNumber();
      const productId = "PR-" + (totalProduk.rowCount + 1) + "-" + hashedId;
      const base64Image = file.buffer.toString("base64");
      const values = [
        productId,
        data.nama,
        data.harga,
        data.deskripsi,
        false,
        base64Image,
        file.mimetype,
      ];

      const sql = {
        text: "INSERT INTO product_tb(product_id,nama,harga,deskripsi,is_deleted,foto_product,mime_type) VALUES($1,$2,$3,$4,$5,$6,$7)",
        values: values,
      };
      const command = new ProdukCommand(this.db.db, sql);
      try {
        await command.create().catch((err) => {
          throw new errorHandler.ServerError(err);
        });
        return {
          data: data,
        };
      } catch (error) {
        throw new errorHandler.ServerError(error);
      }
    }
  }
  async deleteProduk(body) {
    const data = body.data;
    try {
      const produkUsed = await this.usedProduk();
      var sql;
      for (let i = 0; i < data.length; i++) {
        produkUsed.rows.find((e) => e.nama == data[i].nama)
          ? (sql = {
              text: "UPDATE product_tb SET is_deleted = true WHERE nama = $1",
              values: [data[i].nama],
            })
          : (sql = {
              text: util.commandDeleteSQL("produk"),
              values: [data[i].nama],
            });

        var response = await this.db.db.query(sql);
      }
      return { deletedData: response.rowCount };
    } catch (error) {
      throw new errorHandler.ServerError(error);
    }
  }

  async usedProduk() {
    try {
      var sql = {
        text: "SELECT DISTINCT a.product_id, a.nama FROM product_tb a JOIN booking_tb b ON b.product_id = a.product_id",
      };
      var response = await this.db.db.query(sql);
      return response;
    } catch (error) {
      throw new errorHandler.ServerError(error);
    }
  }
}

module.exports = ProdukCommandHandler;
