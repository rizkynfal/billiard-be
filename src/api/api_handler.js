const Auth = require("./auth");
const auth = new Auth();
const { bookingHandler } = require("./booking/booking_handler");
const ExcelExporter = require("./excel/excel_exporter");
const { produkHandler } = require("./produk/produk_handler");
const {
  transaksiHandler,
} = require("./transaksi/repository/transaksi_handler");
const { userHandler } = require("./user/user_handler");
const excelHandler = new ExcelExporter();
module.exports = {
  apiHandler: {
    bookingHandler,
    produkHandler,
    transaksiHandler,
    userHandler,
    auth,
    excelHandler,
  },
};
