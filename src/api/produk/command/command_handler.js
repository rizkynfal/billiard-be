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
  async addProduk(body) {
    const data = body.data;
    let error = null;
    for (let i = 0; i < data.length; i++) {
      error = this.model.validateUserInput(data[i]).error;
      const duplicateName = await queryHandler.getByNama(data[i].nama);
      if (duplicateName.length > 0)
        throw new errorHandler.BadRequestError(
          `Produk ${data[i].nama} Telah Ada`
        );
    }
    if (error) {
      throw new errorHandler.BadRequestError(error);
    } else {
      const values = data.map((e) => [e.nama, e.harga, e.deskripsi]);

      const sql = format(util.commandInsertSQL("produk"), values);
      const command = new ProdukCommand(this.db.db, sql);
      try {
        await command.create().catch((err) => {
          throw new errorHandler.ServerError(err);
        });
        return {
          data: data.map((e) => [e.nama, e.harga, e.deskripsi]),
        };
      } catch (error) {
        throw new errorHandler.ServerError(error);
      }
    }
  }
  async deleteProduk(body) {
    const data = body.data;
    try {
      for (let i = 0; i < data.length; i++) {
        var sql = {
          text: util.commandDeleteSQL("produk"),
          values: [data[i].nama],
        };

        var response = await this.db.db.query(sql);
      }
      return { deletedData: response.rowCount };
    } catch (error) {
      throw new errorHandler.ServerError(error);
    }
  }
}

module.exports = ProdukCommandHandler;
