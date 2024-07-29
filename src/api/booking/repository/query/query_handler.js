const { isEmpty } = require("validate.js");
const { DB } = require("../../../../config/db/conn");
const { ErrorHandler } = require("../../../../handler/error");
const MidtransClient = require("../../../../service/midtrans_handler");
const { util } = require("../../../../utils");
const BookingQuery = require("./query");
const query = new BookingQuery();
class BookingQueryHandler {
  constructor() {
    this.db = new DB();
  }
  async getAllBookingList() {
    try {
      var response = await query.getAllBookingList();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getBookingByTanggal(params) {
    try {
      var response = await query.getBookingByTanggal(params);

      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getBookingList(body) {
    const { filterTanggal, namaPenyewa } = body;

    try {
      var response;
      if (
        typeof filterTanggal === undefined ||
        filterTanggal == null ||
        isEmpty(filterTanggal)
      ) {
        response = await this.getAllBookingList();
      } else {
        response = await query.getBookingList(body);
      }
      var res = [];

      for (let i = 0; i < response.length; i++) {
        var booked = JSON.parse(response[i].booked);
        res.push({
          no: i + 1,
          bookingId: response[i].booking_id,
          tanggalBooking:
            util.formattedDate(new Date(response[i].tanggal_booking)) +
            " " +
            booked[0].split(" - ")[0] +
            " - " +
            booked[booked.length - 1].split(" - ")[1],
          transaksiId: response[i].transaksi_id,
          produkId: response[i].product_id,
          namaPenyewa: response[i].nama_penyewa,
          noHp: response[i].no_hp,
          lamaSewa: response[i].total_lama_sewa,
          noMeja: response[i].nama,
        });
      }
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getBookingStatus(param) {
    try {
      const midtransClient = new MidtransClient(param);
      var response = await midtransClient.getTransactionStatus();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getBookingById(param) {
    try {
      const data = {
        bookingId: param,
      };
      console.log(param);
      var response = await query.getBookingByBookingId(data);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getBookingByTransaksiId(param) {
    try {
      const data = {
        transaksiId: param,
      };
      var response = await query.getBookingByTransaksiId(data);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = BookingQueryHandler;
