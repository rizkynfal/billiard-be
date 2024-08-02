const {
  authenticateTokenCustomer,
  authenticateToken,
  authenticateTokenAdmin,
} = require("../middleware/authentication");
const { util, apiConstants } = require("../utils");
const multer = require("multer");
const { apiHandler } = require("../api/api_handler");
const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

module.exports = (app) => {
  app.post(
    "/v1/product/addNew",
    authenticateTokenAdmin,
    upload.single("foto_produk"),
    async (req, res) => {
      try {
        var response = await apiHandler.produkHandler.command.addProduk(
          req.body,
          req.file
        );
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
  app.patch(
    "/v1/product/updateProduk",
    upload.any(),
    authenticateTokenAdmin,
    async (req, res) => {
      try {
        let file = req.file ?? null;

        var response = await apiHandler.produkHandler.command.updateProduk(
          req.body,
          file
        );
        util.response(
          res,
          response,
          apiConstants.SUCCESS_MESSAGE.UPDATE_SUCCESS,
          apiConstants.RESPONSE_CODES.OK,
          true
        );
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.post(
    "/v1/product/addJamAvailable",
    authenticateTokenAdmin,
    async (req, res) => {
      try {
        var response = await apiHandler.produkHandler.command.addJamAvailable();
        util.response(
          res,
          response,
          apiConstants.SUCCESS_MESSAGE.INSERT_SUCCESS,
          true
        );
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  //
  app.get("/v1/product/getAllPhoto", async (req, res) => {
    try {
      var response = await apiHandler.produkHandler.query.getPhoto();
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

  app.get("/v1/product/getPhotoById", async (req, res) => {
    try {
      var response = await apiHandler.produkHandler.query.getPhotoById(
        req.query
      );
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
  app.post("/v1/product/getProdukJamAvailable", async (req, res) => {
    try {
      var response = await apiHandler.produkHandler.query.getProdukJamAvailable(
        req.body
      );
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
  app.get(
    "/v1/product/getAllAvailable",

    async (req, res) => {
      try {
        var response =
          await apiHandler.produkHandler.query.getAllAvailableProduct(
            req.query
          );
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
      var response = await apiHandler.produkHandler.query.getAll(req.body);
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
  app.delete(
    "/v1/product/deleteById",
    authenticateTokenAdmin,
    async (req, res) => {
      try {
        var response = await apiHandler.produkHandler.command.deleteProduk(
          req.body
        );
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
  app.post(
    "/v1/product/getProdukJamAvailable",
    authenticateToken,
    async (req, res) => {
      try {
        var response =
          await apiHandler.produkHandler.query.getProdukJamAvailable(req.body);
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
};
