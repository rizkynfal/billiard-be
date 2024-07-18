const passport = require("passport");
const ProdukCommandHandler = require("../api/produk/command/command_handler");
const ProdukQueryHandler = require("../api/produk/query/query_handler");
const { authenticateToken } = require("../middleware/authentication");
const { util, apiConstants } = require("../utils");
const commandHandler = new ProdukCommandHandler();
const queryHandler = new ProdukQueryHandler();
const multer = require("multer");
const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

module.exports = (app) => {
  app.post(
    "/v1/product/addNew",
    authenticateToken,
    upload.single("foto_produk"),
    async (req, res) => {
      try {
        var response = await commandHandler.addProduk(req.body, req.file);
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
    }
  );
  app.get("/v1/product/getPhoto", authenticateToken, async (req, res) => {
    try {
      var response = await queryHandler.getPhoto();
      util.response(
        res,
        response,
        "Success",
        apiConstants.RESPONSE_CODES.OK,
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
  app.get("/v1/product/getAll", async (req, res) => {
    try {
      var response = await queryHandler.getAll();
      util.response(
        res,
        response,
        "Success",
        apiConstants.RESPONSE_CODES.OK,
        true
      );
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.delete("/v1/product/deleteById", authenticateToken, async (req, res) => {
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
