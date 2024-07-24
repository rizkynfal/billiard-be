const { DB } = require("../../../../config/db/conn");
const { ErrorHandler } = require("../../../../handler/error");
const UserQueryHandler = require("../../../user/repository/query/query_handler");
const BookingCommandModel = require("./command_model");
const BookingCommand = require("./command");
const { generateRandomNumber } = require("../../../../utils/crypt");
const model = new BookingCommandModel();
const command = new BookingCommand();

class BookingCommandHandler {
  constructor() {
    this.db = new DB();
  }

  async createBooking(body) {
    const {
      lamaSewa,
      userId,
      produkId,
      tanggalBooking,
      transaksiId,
      jamBooking,
    } = body;

    if (!userId) {
      throw new ErrorHandler.ForbiddenError();
    }
    try {
      const hashedId = generateRandomNumber();
      const orderId = "BK-" + hashedId;
      const data = {
        orderId: orderId,
        lamaSewa: lamaSewa,
        userId: userId,
        produkId: produkId,
        tanggalBooking: tanggalBooking,
        transaksiId: transaksiId,
        jamBooking: jamBooking,
      };
      await command.createBooking(data);

      return {
        res: {
          orderId: orderId,
          lamaSewa: lamaSewa,
          userId: userId,
          produkId: produkId,
          tanggalBooking: tanggalBooking + jamBooking,
        },
      };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = BookingCommandHandler;
