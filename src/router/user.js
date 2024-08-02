const { util, apiConstants } = require("../utils");
const bodyParser = require("body-parser");
const authenticator = require("../middleware/authentication");
const { apiHandler } = require("../api/api_handler");
module.exports = (app) => {
  app.use(bodyParser.json());

  app.post(
    "/v1/user/create",
    authenticator.authenticateTokenAdmin,
    async (req, res) => {
      try {
        const users = await apiHandler.userHandler.command.createUser(req.body);
        util.response(
          res,
          users,
          "Success",
          apiConstants.RESPONSE_CODES.CREATED,
          true
        );
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );

  app.get(
    "/v1/user/search",
    authenticator.authenticateTokenAdmin,
    async (req, res) => {
      const params = req.query;
      try {
        var users;
        users = await apiHandler.userHandler.query.findUserByNameOrEmail(
          params
        );
        util.response(res, users, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.post("/v1/user/resetPassword", async (req, res) => {
    try {
      var response = await apiHandler.auth.resetPassword(req, res);
      util.response(res, response, "Success Reset Password", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.post("/v1/user/requestOTP", async (req, res) => {
    try {
      var response = await apiHandler.auth.requestOTP(req, req);
      util.response(res, response, "Success send otp to email", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
};
