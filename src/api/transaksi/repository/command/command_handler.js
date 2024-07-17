const { DB } = require("../../../../config/db");
const { ErrorHandler } = require("../../../../handler/error");
const UserQueryHandler = require("../../../user/repository/query/query_handler");
const BookingCommandModel = require("./command_model");
const MidtransClient = require("../../../../service/midtrans_handler");
const BookingCommand = require("./command");
const TransaksiCommand = require("./command");
const BookingCommandHandler = require("../../../booking/repository/command/command_handler");
const { util } = require("../../../../utils");
const model = new BookingCommandModel();

class TransaksiCommandHandler {
  constructor() {
    this.db = new DB();
  }

  async createTransaksi(body) {
    const { email, tanggal_transaksi, produk } = body;

    const userhandler = new UserQueryHandler();
    const user = await userhandler.findUserByEmail(body);

    var price = 0;
    var lamaSewa =
      produk.jamMain.length > 1
        ? produk.jamMain.length
        : parseInt(produk.jamMain.last.split("-")[0].split(":")[0]) -
          parseInt(produk.jamMain[0].split("-")[0].split(":")[0]);

    price = produk.harga * lamaSewa;

    const data = {
      email: email,
      produk: produk,
      price: price,
    };
    const { error } = model.validate(data);
    if (error) {
      throw new ErrorHandler.BadRequestError(error);
    }
    if (!user) {
      throw new ErrorHandler.ForbiddenError("user not registered yet");
    }
    const hashedId = util.generateRandomNumber();
    const transaksiId = "TR-" + hashedId;
    try {
      const midtrans = new MidtransClient(
        transaksiId,
        price,
        "",
        user[0],
        produk
      );
      var status = "pending";
      var response = await midtrans.createTransactionSnapPrefrence();

      var sql = {
        text: "INSERT INTO public.transaksi_tb(transaksi_id, user_id, tanggal_transaksi, status_transaksi, payment_method, total_lama_sewa, total_harga, produk)  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        values: [
          midtrans.order_id,
          user[0].user_id,
          tanggal_transaksi,
          status,
          midtrans.payment_type,
          lamaSewa,
          price,
          produk,
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
                  produkId: produk.produk_id,
                  tanggalBooking: tanggal_transaksi,
                  transaksiId: midtrans.order_id,
                });
                await this.updateTransaksiStatus({
                  transaksi_id: midtrans.order_id,
                  status: "Success",
                  payment_method: e.issuer,
                });
                clearInterval(interval);
              } else {
                await this.updateTransaksiStatus({
                  transaksi_id: midtrans.order_id,
                  status: e.transaction_status,
                  payment_method: e.issuer,
                });
              }
              interval;
            })

            .catch((e) => {
              clearInterval(interval);
              throw new ErrorHandler.ServerError(e);
            });
        }, 20000);
      });

      return {
        res: {
          transaksiId: midtrans.order_id,
          email: user[0].email,
          date_transaction: tanggal_transaksi,
          product: produk,
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
    const { transaksi_id, status, payment_method } = body;

    const sql = {
      text: `UPDATE transaksi_tb SET status_transaksi = $1 , payment_method = $3 WHERE transaksi_id LIKE $2`,
      values: [status, transaksi_id, payment_method],
    };
    try {
      const command = new TransaksiCommand(this.db.db, sql);
      await command.create(this.db.db, sql);
      return { data: "sukses" };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiCommandHandler;
