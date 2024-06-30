const { util, apiConstants } = require("../utils/index");
const { ErrorHandler } = require("../handler/error");
const bodyParser = require("body-parser");
const { authenticateToken } = require("../middleware/authentication");
const TransaksiCommandHandler = require("../api/transaksi/repository/command/command_handler");
const TransaksiQueryHandler = require("../api/transaksi/repository/query/query_handler");
const commandHandler = new TransaksiCommandHandler();
const queryHandler = new TransaksiQueryHandler();
module.exports = (app) => {
  app.use(bodyParser.json());
  app.get("/v1/transaksi/getAll", authenticateToken, async (req, res) => {
    try {
      var response = await queryHandler.getAllTransaksiList();
      util.response(res, response, "Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.post("/v1/transaksi/createTransaksi", authenticateToken, async (req, res) => {
    try {
      var response = await commandHandler.createTransaksi(req.body);

      util.response(res, response, "Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.get(
    "/v1/transaksi/getItemById/:orderId",
    authenticateToken,
    async (req, res) => {
      try {
        var response = await queryHandler.getTransactionById(
          req.params.orderId
        );
        util.response(res, response, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.get(
    "/v1/transaksi/getStatus/:order_id",
    authenticateToken,
    async (req, res) => {
      try {
        var response = await queryHandler.getTransacionStatus(
          req.params.order_id
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
