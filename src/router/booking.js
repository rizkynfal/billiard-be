const { util, apiConstants } = require("../utils/index");
const bodyParser = require("body-parser");
const { authenticateToken } = require("../middleware/authentication");
const { apiHandler } = require("../api/api_handler");

module.exports = (app) => {
  app.use(bodyParser.json());
  app.get(
    "/v1/booking/getByTransaksiId",
    authenticateToken,
    async (req, res) => {
      try {
        var response =
          await apiHandler.bookingHandler.query.getBookingByTransaksiId(
            req.query.transaksiId
          );
        util.response(
          res,
          response,

          apiConstants.SUCCESS_MESSAGE.FETCH_SUCCESS,
          apiConstants.RESPONSE_CODES.OK,
          true
        );
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.get("/v1/booking/getByBookingId", authenticateToken, async (req, res) => {
    try {
      var response = await apiHandler.bookingHandler.query.getBookingById(
        req.query.bookingId
      );
      util.response(
        res,
        response,

        apiConstants.SUCCESS_MESSAGE.FETCH_SUCCESS,
        apiConstants.RESPONSE_CODES.OK,
        true
      );
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.get("/v1/booking/getBookingList", authenticateToken, async (req, res) => {
    try {
      var response = await apiHandler.bookingHandler.query.getBookingList(
        req.body
      );
      util.response(res, response, "Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
};
