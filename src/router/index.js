const { ErrorHandler } = require("../handler/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { routing } = require("../middleware/routing");
const passport = require("passport");
const { util } = require("../utils");
const cors = require("cors");
const date = require('date-and-time') 

module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  // app.use(cors());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cors());

  app.use("/v1", (req, res, next) => {
    routing(req, res, app);
    next();
  });

  app.get("/", (req, res) => {
    const id = "TR-"+ Math.random().toString().substring(10) +"-"+  date.format((new Date(Date.now())),"DD-MM-YYYY")
    res.send(`"<h1>404 NOT FOUND</h1>" ${id} ++++ ${id.length}`);

  });
  app.get("/api", async (req, res) => {
    try {
      util.response(res, response, "ss", "", "");
    } catch (error) {
      util.handleError(req, res, error);
    }
  });
};
