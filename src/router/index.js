const { ErrorHandler } = require("../handler/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { routing } = require("../middleware/routing");

const passport = require("passport");
const { tesVersion } = require("../api/tes");
const { util } = require("../utils");
module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/v1", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    routing(req, res, app);
    next();
  });

  app.get("/", (req, res) => res.send("<h1>404 NOT FOUND</h1>"));
  app.get("/api", async (req, res) => {
    try {
      const response = await tesVersion(req, res);
      util.response(res, response, "ss", "", "");
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
};
