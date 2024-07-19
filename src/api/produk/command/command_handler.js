const { DB } = require("../../../config/db/conn");
const { ErrorHandler } = require("../../../handler/error");
const { util } = require("../../../utils");
const ProdukQueryHandler = require("../query/query_handler");
const ProdukCommand = require("./command");
const ProdukCommandModel = require("./command_model");
const format = require("pg-format");
const errorHandler = ErrorHandler;
const queryHandler = new ProdukQueryHandler();
const command = new ProdukCommand();

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
      const data = {
        productId: productId,
        nama: data.nama,
        harga: data.harga,
        deskripsi: data.deskripsi,
        isDeleted: false,
        fotoProduk: base64Image,
        mimeType: file.mimetype,
      };
      try {
        await command.createProduk(data).catch((err) => {
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
    const data = body;
    try {
      const produkUsed = await this.usedProduk();
      var response = produkUsed.find((e) => e.product_id == data.produkId)
        ? command.updateProdukById({ produkId: data.produkId })
        : command.deleteProdukById({ produkId: data.produkId });
      return { deletedData: response };
    } catch (error) {
      throw new errorHandler.ServerError(error);
    }
  }

  async usedProduk() {
    try {
      var response = await command.getUsedProduk();
      return response;
    } catch (error) {
      throw new errorHandler.ServerError(error);
    }
  }
}

module.exports = ProdukCommandHandler;
