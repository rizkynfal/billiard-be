const passport = require("passport");
const ProdukCommandHandler = require("../api/produk/command/command_handler");
const ProdukQueryHandler = require("../api/produk/query/query_handler");
const { authenticateToken } = require("../middleware/authentication");
const { util, apiConstants } = require("../utils");
const commandHandler = new ProdukCommandHandler();
const queryHandler = new ProdukQueryHandler();
const LocalStrategy = require("passport-local").Strategy;

module.exports = (app) => {
  app.post("/v1/product/addNew", authenticateToken, async (req, res) => {
    try {
      var response = await commandHandler.addProduk(req.body);
      util.response(
        res,
        response,
        `Successfully Insert Data`,
        apiConstants.RESPONSE_CODES.CREATED,
        true
      );
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.get(
    "/v1/product/getAllAvailable",
    authenticateToken,
    async (req, res) => {
      try {
        var response = await queryHandler.getAllAvailableProduct(req.query);
        util.response(
          res,
          response,
          "Successfully",
          apiConstants.RESPONSE_CODES.OK,
          true
        );
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.delete("/v1/product/delete", authenticateToken, async (req, res) => {
    try {
      var response = await commandHandler.deleteProduk(req.body);
      util.response(
        res,
        response,
        "Successfully",
        apiConstants.RESPONSE_CODES.OK,
        true
      );
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
};
