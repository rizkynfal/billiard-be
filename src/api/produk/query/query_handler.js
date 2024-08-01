const ProdukQueryModel = require("./query_model");
const ProdukQuery = require("./query");
const { ErrorHandler } = require("../../../handler/error");
const { DB } = require("../../../config/db/conn");
const { util } = require("../../../utils");
const BookingQueryHandler = require("../../booking/repository/query/query_handler");
const { isEmpty } = require("validate.js");
const {
  transaksiHandler,
} = require("../../transaksi/repository/transaksi_handler");
const { JAM_AVAILABLE } = require("../../../utils/constant");
const bookingQuery = new BookingQueryHandler();
class ProdukQueryHandler {
  constructor() {
    this.db = new DB();
    this.model = new ProdukQueryModel();
    this.query = new ProdukQuery();
  }
  async getAllAvailableProduct(params) {
    const data = {
      tanggal: params.tanggal,
    };

    try {
      var defaultJam = JAM_AVAILABLE.JAM;

      const dataBookingByTanggal = await this.query.getAllBookedProduct(data);
      var responses;
      if (isEmpty(dataBookingByTanggal)) {
        responses = await this.getAll();
      } else {
        const transaksiData =
          await transaksiHandler.query.getTransactionTglPRid({
            tanggal: data.tanggal,
            produkId: dataBookingByTanggal[0].product_id,
          });
        if (!isEmpty(transaksiData)) {
          for (let i = 0; i < transaksiData.length; i++) {
            var booked = JSON.parse(transaksiData[i].booked);
            if (!isEmpty(booked)) {
              for (let j = 0; j < booked.length; j++) {
                var sameData = defaultJam.indexOf(booked[j]) || null;
                if (sameData > 0) {
                  var index = defaultJam.indexOf(booked[j]);
                  defaultJam.splice(index, 1);
                }
              }
            }
          }
        }
        if (isEmpty(defaultJam)) {
          responses = await this.query.getAllAvailableProduct(data);
        } else {
          responses = await this.getAll();
        }
      }
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
      var response = await this.query.getProductByNama(data);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getAll(data) {
    try {
      var response = await this.query.getAllProduct(data);
      var res = [];
      // for (let i = 0; i < response.length; i++) {
      //   res.push({
      //     no: i + 1,
      //     produkId: response[i].product_id,
      //     nama: response[i].nama,
      //     harga: response[i].harga,
      //     deskripsi: response[i].deskripsi,
      //   });
      // }
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getProdukById(param) {
    try {
      var response = await this.query.getProductById(param);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getProdukByNotId(param) {
    try {
      var response = await this.query.getPorductByNotId(param);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getPhoto() {
    try {
      var response = await this.query.getAllPhoto();
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
  async getPhotoById(param) {
    try {
      var response = await this.query.getPhotoById(param);
      return {
        mimeType: response[0].mime_type,
        fotoProduk: response[0].foto_product,
      };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getProdukJamAvailable(param) {
    const { error } = this.model.validateParamFindJam(param);
    if (error) {
      throw new ErrorHandler.BadRequestError(error);
    }

    try {
      var response = { produk: "", jamAvail: [] };
      const transaksiData = await transaksiHandler.query.getTransactionTglPRid(
        param
      );
      var dataProduk = await this.query.getProductById(param);
      var defaultJam = JAM_AVAILABLE.JAM;
      response = {
        produk: dataProduk,
      };

      if (!isEmpty(transaksiData)) {
        for (let i = 0; i < transaksiData.length; i++) {
          var booked = JSON.parse(transaksiData[i].booked);
          if (!isEmpty(booked)) {
            for (let j = 0; j < booked.length; j++) {
              var sameData = defaultJam.indexOf(booked[j]) || null;
              if (sameData > 0) {
                var index = defaultJam.indexOf(booked[j]);
                defaultJam.splice(index, 1);
              }
            }
          }
        }
        response.jamAvail = defaultJam;
      } else {
        response.jamAvail = defaultJam;
      }
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async usedProduk() {
    try {
      var response = await this.query.getUsedProduk();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}

module.exports = ProdukQueryHandler;
