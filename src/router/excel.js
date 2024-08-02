const { apiHandler } = require("../api/api_handler");
const {
  authenticateToken,
  authenticateTokenAdmin,
} = require("../middleware/authentication");
const { util, apiConstants } = require("../utils");

module.exports = (app) => {
  app.get(
    "/v1/excel/downloadExcel",
    authenticateTokenAdmin,
    async (req, res) => {
      try {
        var response = await apiHandler.excelHandler.downloadExcel(req.query);

        util.responseFile(res, response, apiConstants.RESPONSE_CODES.OK);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
};
