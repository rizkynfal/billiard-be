const ProdukQueryModel = require("./query_model");
const ProdukQuery = require("./query");
const { ErrorHandler } = require("../../../handler/error");
const { DB } = require("../../../config/db/conn");
const { util } = require("../../../utils");

class ProdukQueryHandler {
  constructor() {
    this.db = new DB();
    this.model = new ProdukQueryModel();
    this.handler = new ProdukQuery();
  }
  async getAllAvailableProduct(params) {
    const data = {
      tanggal: params.tanggal,
    };

    try {
      var responses = await this.handler.getAllAvailableProduct(data);
      return responses;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getByNama(nama) {
    try {
      const data = {
        nama: nama,
      };
      var response = await this.handler.getProductByNama(data);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getAll() {
    try {
      var response = await this.handler.getAllProduct();
      var res = [];
      for (let i = 0; i < response.length; i++) {
        res.push({
          no: i + 1,
          produkId: response[i].product_id,
          nama: response[i].nama,
          harga: response[i].harga,
          deskripsi: response[i].deskripsi,
        });
      }
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getPhoto() {
    try {
      var response = await this.handler.getAllPhoto();
      var res = [];
      if (response.length >= 1) {
        for (let i = 0; i < response.length; i++) {
          res.push({
            no: i + 1,
            mimeType: response[i].mime_type,
            fotoProduk: response[i].foto_product,
          });
        }
      }
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}

module.exports = ProdukQueryHandler;
