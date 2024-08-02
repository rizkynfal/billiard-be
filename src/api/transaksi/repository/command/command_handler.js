const { DB } = require("../../../../config/db/conn");
const { ErrorHandler } = require("../../../../handler/error");
const UserQueryHandler = require("../../../user/repository/query/query_handler");
const TransaksiCommandModel = require("./command_model");
const MidtransClient = require("../../../../service/midtrans_handler");
const TransaksiCommand = require("./command");
const BookingCommandHandler = require("../../../booking/repository/command/command_handler");
const { util } = require("../../../../utils");
const model = new TransaksiCommandModel();
const command = new TransaksiCommand();
const date = require("date-and-time");
const { isEmpty } = require("validate.js");
class TransaksiCommandHandler {
  constructor() {}

  async createTransaksi(body) {
    const { email, nama, noHp, tglTransaksi, produk } = body;

    const userhandler = new UserQueryHandler();
    const user = await userhandler.findUserByEmail(body);

    const tanggal = tglTransaksi
      ? tglTransaksi.split(" ")[0].toString()
      : util.formattedDate();

    const jamTransaksi = tglTransaksi
      ? tglTransaksi.split(" ")[1].toString()
      : util.formattedTime();
    var price = 0;

    var lamaSewa =
      produk.jamMain.length > 1
        ? produk.jamMain.length
        : parseInt(produk.jamMain[0].split("-")[1].split(":")[0]) -
          parseInt(produk.jamMain[0].split("-")[0].split(":")[0]);

    price = produk.totalHarga;
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
      console.log(dataTr);
      var dataTr = {
        transaksiId: midtrans.order_id,
        userId: user[0].user_id,
        tanggalTransaksi: tanggal,
        jamTransaksi: jamTransaksi,
        status: status,
        paymentMethod: midtrans.payment_type,
        lamaSewa: lamaSewa,
        price: price,
        produk: JSON.stringify(produk),
        nama: nama ?? user[0].nama,
        noHp: noHp ?? user[0].no_hp,
      };

      const book = new BookingCommandHandler();

      await command.createTransaksi(dataTr).then((e) => {
        var interval = setInterval(async () => {
          await midtrans
            .getTransactionStatus()
            .then(async (e) => {
              if (
                e.status_code === 201 ||
                e.transaction_status === "settlement" ||
                e.transaction_status === "success"
              ) {
                await book.createBooking({
                  order_id: midtrans.order_id,
                  lamaSewa: lamaSewa,
                  userId: user[0].user_id,
                  produkId: produk.produk_id,
                  tanggalBooking: tanggal,
                  transaksiId: midtrans.order_id,
                  jamBooking: jamTransaksi,
                });

                await this.updateTransaksiStatus({
                  transaksi_id: midtrans.order_id,
                  status: "Success",
                  payment_method:
                    typeof e.issuer === undefined || e.issuer == null
                      ? "-"
                      : e.issuer,
                });
                clearInterval(interval);
              } else {
                await this.updateTransaksiStatus({
                  transaksi_id: midtrans.order_id,
                  status:
                    typeof e.transaction_status === undefined ||
                    e.transaction_status == null
                      ? "failed"
                      : e.transaction_status,
                  payment_method:
                    typeof e.issuer === undefined || e.issuer == null
                      ? "-"
                      : e.issuer,
                });
              }
              interval;
            })

            .catch((e) => {
              clearInterval(interval);
              throw new ErrorHandler.ServerError(e);
            });
        }, 30000);
      });

      return {
        transaksi: {
          transaksiId: midtrans.order_id,
          email: user[0].email,
          date_transaction: tanggal,
          product: produk,
          total_price: price,
          status: status,
        },
        responseMidtrans: { response },
      };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }

  async updateTransaksiStatus(body) {
    const { transaksi_id, status, payment_method } = body;

    const data = {
      statusTransaksi: status,
      transaksiId: transaksi_id,
      paymenMethod: payment_method,
    };
    try {
      await command.updateTransaksiStatus(data);
      return { data: "sukses" };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async deleteTransaksiById(params) {
    const { transaksiId } = params;
    if (typeof transaksiId === undefined || isEmpty(transaksiId)) {
      throw new ErrorHandler.BadRequestError("Invalid Transaksi Id");
    }

    try {
      var response = await command.deleteTransaksiById(params);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async deleteTransaksiAll() {
    try {
      var response = await command.deleteAllTransaksi();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiCommandHandler;
