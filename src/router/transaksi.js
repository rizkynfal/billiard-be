const { util, apiConstants } = require("../utils/index");
const { ErrorHandler } = require("../handler/error");
const bodyParser = require("body-parser");
const {
  authenticateTokenAdmin,
  authenticateToken,
  authenticateTokenCustomer,
} = require("../middleware/authentication");
const { apiHandler } = require("../api/api_handler");

module.exports = (app) => {
  app.use(bodyParser.json());
  // create endpoint
  app.post(
    "/v1/transaksi/createTransaksi",
    authenticateTokenCustomer,
    async (req, res) => {
      try {
        var response =
          await apiHandler.transaksiHandler.command.createTransaksi(req.body);

        util.response(res, response, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  //

  // get endpoint
  app.get(
    "/v1/transaksi/getTransaksiList",
    authenticateTokenAdmin,
    async (req, res) => {
      try {
        var response = await apiHandler.transaksiHandler.query.getTransaksiList(
          req.body
        );
        util.response(res, response, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.get(
    "/v1/transaksi/getTransaksiById",
    authenticateToken,
    async (req, res) => {
      try {
        var response =
          await apiHandler.transaksiHandler.query.getTransactionById(
            req.query.transaksiId
          );
        util.response(res, response, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.get(
    "/v1/transaksi/getTransaksiByUserId",
    authenticateToken,
    async (req, res) => {
      try {
        var response =
          await apiHandler.transaksiHandler.query.getTransactionByUserId(
            req.query.userId
          );
        util.response(res, response, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.get(
    "/v1/transaksi/getTransaksiByTanggal",
    authenticateToken,
    async (req, res) => {
      try {
        var response =
          await apiHandler.transaksiHandler.query.getTransactionByTanggal(
            req.query
          );
        util.response(res, response, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.get(
    "/v1/transaksi/getTransaksiByUserIdAndTanggal",
    authenticateToken,
    async (req, res) => {
      try {
        var response =
          await apiHandler.transaksiHandler.query.getTransactionUsrIdAndTanggal(
            req.query
          );
        util.response(res, response, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.get(
    "/v1/transaksi/getStatusById",
    authenticateToken,
    async (req, res) => {
      try {
        var response =
          await apiHandler.transaksiHandler.query.getTransacionStatus(
            req.query.transaksiId
          );
        util.response(
          res,
          response,
          apiConstants.SUCCESS_MESSAGE.FETCH_SUCCESS,
          200,
          true
        );
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  //
  // delete endpoint
  app.delete(
    "/v1/transaksi/deleteTransaksi",
    authenticateToken,
    async (req, res) => {
      try {
        var response =
          await apiHandler.transaksiHandler.command.deleteTransaksiById(
            req.query
          );
        util.response(
          res,
          response,
          apiConstants.SUCCESS_MESSAGE.DELETE_SUCCESS,
          200,
          true
        );
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.delete(
    "/v1/transaksi/deleteAllTransaksi",
    authenticateToken,
    async (req, res) => {
      try {
        var response =
          await apiHandler.transaksiHandler.command.deleteTransaksiAll();
        util.response(
          res,
          response,
          apiConstants.SUCCESS_MESSAGE.DELETE_SUCCESS,
          200,
          true
        );
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  // pdf
  app.get(
    "/v1/transaksi/getInvoicePdf",
    authenticateToken,
    async (req, res) => {
      try {
        await apiHandler.transaksiHandler.query
          .getTransactionPdf(req.query)
          .then(() => {
            util.responseFile(
              res,
              "/invoice.pdf",
              apiConstants.RESPONSE_CODES.OK
            );
          });
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
};
