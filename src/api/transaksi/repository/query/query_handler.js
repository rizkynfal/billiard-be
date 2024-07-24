const { isEmpty } = require("validate.js");
const { DB } = require("../../../../config/db/conn");
const { ErrorHandler } = require("../../../../handler/error");
const MidtransClient = require("../../../../service/midtrans_handler");
const { util } = require("../../../../utils");
const TransaksiQuery = require("./query");
const query = new TransaksiQuery();
const date = require("date-and-time");

class TransaksiQueryHandler {
  constructor() {
    this.db = new DB();
  }
  async getAllTransaksiList() {
    try {
      var response = await query.getAllTransaksi();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransaksiList(body) {
    const { filterTanggal, paymentSuccess } = body;
    try {
      var response;
      if (
        (typeof filterTanggal === undefined ||
          filterTanggal == null ||
          isEmpty(filterTanggal)) &&
        (typeof paymentSuccess === undefined ||
          paymentSuccess == null ||
          isEmpty(paymentSuccess))
      ) {
        response = await this.getAllTransaksiList();
      } else {
        response = await query.getTransaksiList(body);
      }
      var res = [];
      for (let i = 0; i < response.length; i++) {
        res.push({
          no: i + 1,
          transaksiId: response[i].transaksi_id,
          userId: response[i].user_id,
          tanggalTransaksi:
            util.formattedDate(new Date(response[i].tanggal_transaksi)) +
            " " +
            response[i].jam_transaksi,
          statusTransaksi: response[i].status_transaksi,
          paymentMethod: response[i].payment_method,
          lamaSewa: response[i].total_lama_sewa,
          totalHarga: response[i].total_harga,
          noMeja: response[i].nama_produk,
          namaPenyewa: response[i].nama_penyewa,
          noHp: response[i].no_hp,
          jamMain: response[i].jam_main,
        });
      }
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransacionStatus(param) {
    try {
      const midtransClient = new MidtransClient(param);
      var response = await midtransClient.getTransactionStatus();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionById(param) {
    try {
      var response = await query.getTransaksiById({ transaksiId: param });
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionTglPRid(param) {
    try {
      var response = await query.getTransaksiByProdukIdAndTanggal(param);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionByUserId(param) {
    try {
      var response = await query.getTransaksiByUserId({ userId: param });
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiQueryHandler;
