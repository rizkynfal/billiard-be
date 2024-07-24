const excelJS = require("exceljs");
const ExcelModel = require("./excel_model");
const { ErrorHandler } = require("../../handler/error");
const api = require("../api_handler");
const BookingQueryHandler = require("../booking/repository/query/query_handler");
const { isEmpty } = require("validate.js");
const TransaksiQueryHandler = require("../transaksi/repository/query/query_handler");

class ExcelExporter {
  constructor() {
    this.model = new ExcelModel();
    this.queryBooking = new BookingQueryHandler();
    this.queryTransaksi = new TransaksiQueryHandler();
  }

  async downloadExcel(params) {
    const { menu } = params;
    const { error } = this.model.validate(params);
    if (error) {
      throw new ErrorHandler.BadRequestError(error);
    }
    try {
      var response;
      if (menu == 1) {
        await this.downloadExcelBooking().then(() => {
          response = "./excel/booking.xlsx";
        });
      } else if (menu == 2) {
        await this.downloadExcelTransaksi().then(() => {
          response = "./excel/transaksi.xlsx";
        });
      }
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async downloadExcelBooking() {
    await this.queryBooking
      .getBookingList({
        filterTanggal: "",
      })
      .then(async (e) => {
        if (isEmpty(e) || typeof e === undefined) {
          throw new ErrorHandler.ServerError();
        }
        await this.model.excelBookingModel(e);
      })
      .catch((err) => {
        throw new ErrorHandler.ServerError(err);
      });
  }
  async downloadExcelTransaksi() {
    await this.queryTransaksi
      .getTransaksiList({
        filterTanggal: "",
      })
      .then(async (e) => {
        if (isEmpty(e) || typeof e === undefined) {
          throw new ErrorHandler.ServerError();
        }
        await this.model.excelTransaksiModel(e);
      })
      .catch((err) => {
        throw new ErrorHandler.ServerError(err);
      });
  }
}
module.exports = ExcelExporter;
