const { DB } = require("../../../../config/db");
const { ErrorHandler } = require("../../../../handler/error");
const UserQueryHandler = require("../../../user/repository/query/query_handler");
const BookingCommandModel = require("./command_model");
const BookingCommand = require("./command");
const model = new BookingCommandModel();

class BookingCommandHandler {
  constructor() {
    this.db = new DB();
  }

  async createBooking(body) {
    const { order_id, lamaSewa, userId, produkId, tanggalBooking } = body;
    // // const { error } = model.validate(body);
    // const userhandler = new UserQueryHandler();
    // const user = await userhandler.findUserByEmail(body);
    // // if (error) {
    // //   throw new ErrorHandler.BadRequestError(error);
    // // }
    // var price = 0;

    // for (let i = 0; i < produkList.length; i++) {
    //   price += produkList[i].harga;
    // }
    if (!userId) {
      throw new ErrorHandler.ForbiddenError();
    }
    try {
      const sql = {
        text: `INSERT INTO booking_tb (booking_id, total_lama_sewa, user_id, product_id, tanggal_booking) VALUES ($1, $2, $3, $4, $5)`,
        values: [order_id, lamaSewa, userId, produkId, tanggalBooking],
      };
      const command = new BookingCommand(this.db.db, sql);
      await command.create();

      return {
        res: {
          orderId: order_id,
          lamaSewa: lamaSewa,
          userId: userId,
          produkId: produkId,
          tanggalBooking: tanggalBooking,
        },
      };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async createTransaction(body) {
    const fetch = require("node-fetch");

    const url = "https://api.sandbox.midtrans.com/v2/charge";
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Basic U0ItTWlkLXNlcnZlci1MX200RkhzV2hzbWRoWVpZUVdnSWtfWmI=`,
      },
      body: JSON.stringify({
        payment_type: "gopay",
        transaction_details: {
          order_id: "billiard-order-id-12788134",
          gross_amount: 100000,
        },
        customer_details: {
          first_name: "Budi",
          last_name: "Utomo",
          email: "budi.utomo@midtrans.com",
          phone: "081223323423",
          customer_details_required_fields: ["email", "first_name", "phone"],
        },
        custom_field1: "tes 123",
        custom_field2: "tes 123",

        custom_expiry: { expiry_duration: 60, unit: "minute" },
      }),
    };

    const response = await fetch(url, options);
    const dataTransaksi = await response.json();

    if (dataTransaksi.status_code != 201) {
      throw new ErrorHandler.BadRequestError();
    }
    return dataTransaksi;
  }
}
module.exports = BookingCommandHandler;
