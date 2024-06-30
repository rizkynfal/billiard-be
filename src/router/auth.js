const Auth = require("../api/auth");
const { util, apiConstants } = require("../utils");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = new Auth();
module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.post("/v1/auth/login", async (req, res, next) => {
    try {
      var response = await auth.login(req, res);

      util.response(res, response, "Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.post("/v1/auth/register", async (req, res) => {
    try {
      var response = await auth.register(req, res);

      util.response(res, response, "Registrasi Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.post("/v1/auth/refreshToken", async (req, res) => {
    try {
      var response = await auth.refreshToken(req, res);
      util.response(res, response, "Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
  app.get("/v1/auth/logout", async (req, res) => {
    try {
      var response = await auth.logout(req, res);
      util.response(res, response, "Success", 200, true);
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
};
