const excelJS = require("exceljs");

const path = require("path");
const { ErrorHandler } = require("../../handler/error");
const Joi = require("joi");
class ExcelModel {
  constructor() {}
  validate(data) {
    var validateParams = Joi.object({
      menu: Joi.required(),
    });
    return validateParams.validate(data);
  }
  async excelBookingModel(data) {
    try {
      const workbook = new excelJS.Workbook();
      const worksheet = workbook.addWorksheet("booking");

      worksheet.columns = [
        {
          header: "ID Booking",
          key: "bookingId",
        },
        {
          header: "Nama Customer",
          key: "namaPenyewa",
        },
        { header: "No HP Customer", key: "noHp" },
        { header: "Lama Sewa", key: "lamaSewa" },
        { header: "Tanggal Booking", key: "tanggalBooking" },
        { header: "Meja", key: "noMeja" },
      ];
      data.forEach((element) => {
        worksheet.addRow(element);
      });

      var excel = await workbook.xlsx.writeFile(
        "./src/public/excel/booking.xlsx"
      );

      workbook.removeWorksheetEx(worksheet);
      return excel;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async excelTransaksiModel(data) {
    try {
      const workbook = new excelJS.Workbook();
      const worksheet = workbook.addWorksheet("transaksi");

      worksheet.columns = [
        {
          header: "ID Transaksi",
          key: "transaksiId",
        },
        {
          header: "Nama Customer",
          key: "namaPenyewa",
        },
        { header: "No HP Customer", key: "noHp" },
        { header: "Lama Sewa", key: "lamaSewa" },
        { header: "Tanggal Transaksi", key: "tanggalTransaksi" },
        { header: "Meja", key: "noMeja" },
        { header: "Metode Bayar", key: "paymentMethod" },
        { header: "Status Transaksi", key: "statusTransaksi" },
        { header: "Nominal Transaksi", key: "totalHarga" },
      ];
      data.forEach((element) => {
        worksheet.addRow(element);
      });

      var excel = await workbook.xlsx.writeFile(
        "./src/public/excel/transaksi.xlsx"
      );

      workbook.removeWorksheetEx(worksheet);
      return excel;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = ExcelModel;
