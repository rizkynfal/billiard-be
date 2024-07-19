const { util, apiConstants } = require("../utils/index");
const { ErrorHandler } = require("../handler/error");
const bodyParser = require("body-parser");
const { authenticateToken } = require("../middleware/authentication");
const BookingCommandHandler = require("../api/booking/repository/command/command_handler");
const BookingQueryHandler = require("../api/booking/repository/query/query_handler");
const commandHandler = new BookingCommandHandler();
const queryHandler = new BookingQueryHandler();

module.exports = (app) => {
  app.use(bodyParser.json());
  app.get(
    "/v1/booking/getByTransaksiId",
    authenticateToken,
    async (req, res) => {
      try {
        var response = await queryHandler.getBookingByTransaksiId(
          req.query.transaksiId
        );
        util.response(res, response, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.get("/v1/booking/getByBookingId", authenticateToken, async (req, res) => {
    try {
      var response = await queryHandler.getBookingById(req.query.bookingId);
      util.response(res, response, "Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.get("/v1/booking/getAll", authenticateToken, async (req, res) => {
    try {
      var response = await queryHandler.getAllBookingList();
      util.response(res, response, "Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
};
