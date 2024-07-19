const QueryHandler = require("../api/user/repository/query/query_handler");
const CommandHandler = require("../api/user/repository/command/command_handler");
const { util, apiConstants } = require("../utils");
const queryHandler = new QueryHandler();
const commandHandler = new CommandHandler();
const bodyParser = require("body-parser");
const authenticator = require("../middleware/authentication");
const passport = require("passport");
const Auth = require("../api/auth");
const auth = new Auth()
module.exports = (app) => {
  app.use(bodyParser.json());

  app.post(
    "/v1/user/create",
    authenticator.authenticateToken,
    async (req, res) => {
      try {
        const users = await commandHandler.createUser(req.body);
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
    authenticator.authenticateToken,
    async (req, res) => {
      const params = req.query;
      try {
        var users;
        users = await queryHandler.findUserByNameOrEmail(params);
        util.response(res, users, "Success", 200, true);
      } catch (error) {
        util.handleError(req, res, error);
      }
    }
  );
  app.post("/v1/user/resetPassword", async (req, res) => {
    try {
      var response = await auth.resetPassword(req, res);
      util.response(res, response, "Success Reset Password", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.post("/v1/user/requestOTP", async (req, res) => {
    try {
      var response = await auth.requestOTP(req, req);
      util.response(res, response, "Success send otp to email", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
};
