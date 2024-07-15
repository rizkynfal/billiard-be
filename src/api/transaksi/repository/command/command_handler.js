const { DB } = require("../../../../config/db");
const { ErrorHandler } = require("../../../../handler/error");
const UserQueryHandler = require("../../../user/repository/query/query_handler");
const BookingCommandModel = require("./command_model");
const MidtransClient = require("../../../../service/midtrans_handler");
const BookingCommand = require("./command");
const TransaksiCommand = require("./command");
const BookingCommandHandler = require("../../../booking/repository/command/command_handler");
const model = new BookingCommandModel();

class TransaksiCommandHandler {
  constructor() {
    this.db = new DB();
  }

  async createTransaksi(body) {
    const { email, produkList } = body;

    const userhandler = new UserQueryHandler();
    const user = await userhandler.findUserByEmail(body);

    var price = 0;
    var lamaSewa = produkList[0].jamAvailable.length;
    for (let i = 0; i < produkList.length; i++) {
      price += produkList[i].harga;
    }
    const data = {
      email: email,
      produk: produkList,
      price: price,
    };
    const { error } = model.validate(data);
    if (error) {
      throw new ErrorHandler.BadRequestError(error);
    }
    if (!user) {
      throw new ErrorHandler.ForbiddenError();
    }
    const hashedId = Math.random().toString(20).substring(2);
    const transaksiId = "Transaksi_id-" + hashedId;
    try {
      const midtrans = new MidtransClient(
        transaksiId,
        price,
        "gopay",
        user[0],
        produkList
      );
      var status = "pending";
      var response = await midtrans.createTransactionSnapPrefrence();

      var sql = {
        text: "INSERT INTO public.transaksi_tb(transaksi_id, customer_id, tanggal_transaksi, status_transaksi, payment_method, total_lama_sewa, total_harga, produk_list)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        values: [
          midtrans.order_id,
          user[0].user_id,
          Date(Date.now().toLocaleString()),
          status,
          midtrans.payment_type,
          lamaSewa,
          price,
          [produkList],
        ],
      };
      const command = new TransaksiCommand(this.db.db, sql);
      const book = new BookingCommandHandler();

      await command.create().then((e) => {
        var interval = setInterval(async () => {
          await midtrans
            .getTransactionStatus()
            .then(async (e) => {
              if (
                e.status_code == 201 ||
                e.transaction_status == "settlement" ||
                e.transaction_status == "success"
              ) {
                await book.createBooking({
                  order_id: midtrans.order_id,
                  lamaSewa: lamaSewa,
                  userId: user[0].user_id,
                  produkId: produkList[0].id,
                  tanggalBooking: Date(Date.now().toLocaleString()),
                });
                await this.updateTransaksiStatus({
                  transaksi_id: midtrans.order_id,
                  status: e.transaction_status,
                });
                clearInterval(interval);
              } else {
                await this.updateTransaksiStatus({
                  transaksi_id: midtrans.order_id,
                  status: e.transaction_status,
                });
              }
            })
            .catch((e) => {
              clearInterval(interval);
              throw new ErrorHandler.ServerError(e);
            });
        }, 20000);
      });

      return {
        res: {
          order_id: midtrans.order_id,
          email: user[0].email,
          date_transaction: Date(Date.now().toLocaleString()).split("GMT")
            .first,
          product: [produkList],
          total_price: price,
          status: status,
        },
        response,
      };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }

  async updateTransaksiStatus(body) {
    const { transaksi_id, status } = body;

    const sql = {
      text: `UPDATE transaksi_tb SET status_transaksi = $1 WHERE transaksi_id LIKE $2`,
      values: [status, transaksi_id],
    };
    try {
      const command = new TransaksiCommand(this.db.db, sql);
      await command.create(this.db.db, sql);
      return { data: "sukes" };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiCommandHandler;
