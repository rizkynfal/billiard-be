const fetch = require("node-fetch");
const axios = require("axios").default;
const { util, apiConstants } = require("../utils");
const midtransClient = require("midtrans-client");
const { ErrorHandler } = require("../handler/error");
const url = "https://api.sandbox.midtrans.com/v2/charge";
class MidtransClient {
  constructor(order_id, price, payment_type, user, product) {
    this.order_id = order_id;
    this.price = price;
    this.payment_type = payment_type;
    this.user = user;
    this.product = product;
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: apiConstants.MIDTRANS_KEY.SERVER_KEY,
      clientKey: apiConstants.MIDTRANS_KEY.CLIENT_KEY,
    });
  }
  async createTransactionSnapPrefrence() {
    const options = util.setMidtransSnapOption(
      this.order_id,
      this.price,
      this.payment_type,
      this.user,
      this.product
    );

    return await this.snap.createTransaction(options);
  }
  async createTransactionAPIPrefrene() {
    if (dataTransaksi.status_code != 201) {
      throw new ErrorHandler.BadRequestError();
    }
    const option = util.setMidtransOption(
      this.order_id,
      this.price,
      this.payment_type,
      this.user,
      this.product,
      "POST"
    );
    const response = await axios.get(url);
    const dataTransaksi = await response.json();
  }
  async getTransactionStatus() {
    const fetch = require("node-fetch");

    const url = `https://api.sandbox.midtrans.com/v2/${this.order_id}/status`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Basic ${apiConstants.MIDTRANS_KEY.SERVER_KEY_ENCODED}`,
      },
    };

    const response = await fetch(url, options);
    return response.json();
  }
}

module.exports = MidtransClient;
