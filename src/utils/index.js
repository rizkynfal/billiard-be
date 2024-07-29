const { apiConstants, DB_ENVIRONMENT } = require("./constant");
const { generateRandomNumber, hashPassword, generateOTP } = require("./crypt");
const {
  queryGetAllSQL,
  commandInsertSQL,
  commandDeleteSQL,
} = require("./sqlQuery");
const date = require("date-and-time");

require("./constant");
class Utils {
  // response
  loggedInResponse() {
    var response = {};
  }
  response(res, data, message, status, success) {
    const responseObj = {
      success: success ?? apiConstants.RESPONSE_STATUS.SUCCESS,
      status: status ?? apiConstants.RESPONSE_CODES.OK,
      message: message ?? apiConstants.SUCCESS_MESSAGE.FETCH_SUCCESS,
      data: data ?? {},
    };
    res.status(status).json(responseObj);
  }
  responseFile(res, path, status) {
    res.status(status).sendFile(`${path}`, {
      root: "./src/public",
    });
  }
  handleError(req, res, err) {
    if (!res) return false;
    err = err || {};

    const msg = err.message
      ? err.message
      : apiConstants.FAILED_MESSAGE.INTERNAL_SERVER_ERROR;
    const code = err.statusCode
      ? err.statusCode
      : apiConstants.RESPONSE_CODES.SERVER_ERROR;
    this.response(res, {}, msg, code, false);
  }
  responseForValidation(res, errorArray, success, code = 400) {
    const responseObj = {
      message: "Invalid Request",
      errors: errorArray,
      success: success,
      responseCode: code,
    };
    res.json(responseObj);
  }
  setMidtransSnapOption(order_id, price, payment_type, user, product) {
    const option = {
      transaction_details: {
        order_id: `${order_id}`,
        gross_amount: `${price}`,
      },
      customer_details: {
        first_name: `${user.nama}`,
        email: user.email,
        phone: `${user.noHp}`,
      },

      page_expiry: {
        duration: 3,
        unit: "hours",
      },

      custom_field1: "KOMAAAAAAAAAAAAAAAAAAAAAAAAAANG",
      custom_field2: "custom field 2 content",
      custom_field3: "custom field 3 content",
    };
    return option;
  }
  // midtrans
  setMidtransOption(order_id, price, payment_type, user, product, method) {
    const options = {
      method: method,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Basic ${apiConstants.MIDTRANS_KEY.SERVER_KEY_ENCODED}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: `${order_id}`,
          gross_amount: `${price}`,
        },
        item_details: [
          {
            id: "ITEM1",
            price: `${product.price}`,
            quantity: 1,
            name: `${product.nama}`,
            merchant_name: "DPlace",
          },
        ],
        payment_type: payment_type,

        customer_details: {
          first_name: `${user[0].nama.split(" ").first}`,
          last_name: `${user[0].nama.split(" ").last}`,
          email: `${user[0].email}`,
          phone: `${user[0].noHp}`,
          customer_details_required_fields: ["email", "first_name", "phone"],
        },
        custom_field1: "tes 123",
        custom_field2: "tes 123",

        custom_expiry: { expiry_duration: 60, unit: "minute" },
      }),
    };
    return options;
  }
  // date
  formattedDateAndTime(input) {
    return input
      ? date.format(new Date(input), "DD/MM/YYYY HH:mm:ss")
      : date.format(new Date(), "DD/MM/YYYY HH:mm:ss");
  }
  formattedDate(input) {
    return input
      ? date.format(new Date(input), "DD/MM/YYYY")
      : date.format(new Date(), "DD/MM/YYYY");
  }
  formattedTime(input) {
    return input
      ? date.format(new Date(input), "HH:mm:ss")
      : date.format(new Date(), "HH:mm:ss");
  }
  // query
  queryGetAllSQL(table) {
    return queryGetAllSQL(table);
  }
  // insertSql

  commandInsertSQL(table) {
    return commandInsertSQL(table);
  }
  //delete SQl
  commandDeleteSQL(table) {
    return commandDeleteSQL(table);
  }
  // export crypt function
  generateRandomNumber() {
    return generateRandomNumber();
  }
  hashPassword(pass) {
    return hashPassword(pass);
  }
  generateOTP() {
    return generateOTP();
  }
}
const util = new Utils();
module.exports = {
  util,
  apiConstants,
  DB_ENVIRONMENT,
};
