const { DB } = require("../../../config/db/conn");
const { ErrorHandler } = require("../../../handler/error");
const { util } = require("../../../utils");
const { JAM_AVAILABLE } = require("../../../utils/constant");
const ProdukQueryHandler = require("../query/query_handler");
const ProdukCommand = require("./command");
const ProdukCommandModel = require("./command_model");
const format = require("pg-format");
const errorHandler = ErrorHandler;
const queryHandler = new ProdukQueryHandler();
const command = new ProdukCommand();

class ProdukCommandHandler {
  constructor() {
    this.model = new ProdukCommandModel();
  }
  async addJamAvailable() {
    const today = new Date();

    try {
      const allProduk = await queryHandler.getAll();
      for (let i = 0; i < 30; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        for (let i = 0; i < allProduk.length; i++) {
          const data = {
            produkId: allProduk[i].product_id,
            timeAvail: [
              "11:00 - 12:00",
              "12:00 - 13:00",
              "13:00 - 14:00",
              "14:00 - 15:00",
              "15:00 - 16:00",
              "16:00 - 17:00",
              "17:00 - 18:00",
              "18:00 - 19:00",
              "19:00 - 20:00",
              "20:00 - 21:00",
              "21:00 - 22:00",
            ],
            tanggal: util.formattedDate(futureDate.toLocaleDateString()),
          };

          await command.addJamAvailableProduk(data);
        }
      }
      return "sukses";
    } catch (error) {
      throw new errorHandler.ServerError(error);
    }
  }
  async addProduk(body, file) {
    const data = body;

    let error = null;
    error = this.model.validateUserInput(data).error;

    var namaProduk = ("MEJA " + data.noMeja).toUpperCase();
    const harga = data.harga;
    const deskripsi = data.deskripsi;
    const mimeType = file.mimetype;

    const duplicateName = await queryHandler.getByNama(namaProduk);
    if (duplicateName.length > 0) {
      throw new errorHandler.BadRequestError(`Produk ${namaProduk} Telah Ada`);
    }
    if (error) {
      throw new errorHandler.BadRequestError(error);
    } else {
      const totalProduk = await queryHandler.getAll();
      const hashedId = util.generateRandomNumber();
      const productId = "PR-" + (totalProduk.length + 1) + "-" + hashedId;
      const base64Image = file.buffer.toString("base64");

      const data = {
        productId: productId,
        nama: namaProduk,
        harga: harga,
        deskripsi: deskripsi,
        isDeleted: false,
        fotoProduk: base64Image,
        mimeType: mimeType,
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
      const produkUsed = await queryHandler.usedProduk();
      var response = produkUsed.find((e) => e.product_id == data.produkId)
        ? command.updateProdukById({ produkId: data.produkId })
        : command.deleteProdukById({ produkId: data.produkId });
      return { deletedData: response };
    } catch (error) {
      throw new errorHandler.ServerError(error);
    }
  }
}

module.exports = ProdukCommandHandler;
