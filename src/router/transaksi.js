const { util, apiConstants } = require("../utils/index");
const { ErrorHandler } = require("../handler/error");
const bodyParser = require("body-parser");
const { authenticateToken } = require("../middleware/authentication");
const { apiHandler } = require("../api/api_handler");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.get("/v1/transaksi/getAll", authenticateToken, async (req, res) => {
    try {
      var response =
        await apiHandler.transaksiHandler.query.getAllTransaksiList();
      util.response(res, response, "Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.post(
    "/v1/transaksi/createTransaksi",
    authenticateToken,
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
};
