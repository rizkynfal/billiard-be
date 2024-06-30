const express = require("express");
require("dotenv");
const router = require("./src/router/index");
const { port } = require("./src/config/index");
const app = express();
const bodyParser = require("body-parser");
const { DB } = require("./src/config/db");
const passport = require("passport");
const session = require("express-session");
const { apiConstants } = require("./src/utils");
const db = new DB();
require("express-session");

class App {
  static listen() {
    Promise.all([db.connect()]).then(() => {
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());
      app.use(
        session({
          secret: apiConstants.TOKEN_SECRET.ACCESS_TOKEN,
          saveUninitialized: false,
          resave: true,
        })
      );
      app.use(passport.initialize());
      app.use(passport.session());
      app.listen(port, (err) => {
        if (err) {
          console.log(err);
          return process.exit(1);
        }
        console.log(`server is running on ${port}`);
      });

      router(app);
    });
  }
}

App.listen();
