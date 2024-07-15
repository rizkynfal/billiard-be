const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const QueryHandler = require("../user/repository/query/query_handler");
const CommandHandler = require("../user/repository/command/command_handler");
const queryHandler = new QueryHandler();
const commandHandler = new CommandHandler();
const { ErrorHandler } = require("../../handler/error");
const { apiConstants } = require("../../utils/index");
const TokenGenerator = require("./jwt_token");
const passport = require("passport");
// s
class Auth {
  constructor() {}
  async register(req, res) {
    const existingUser = await queryHandler.findUserByEmail(req.body);

    if (existingUser[0]) {
      throw new ErrorHandler.BadRequestError("Email Already Registered");
    } else {
      try {
        return await commandHandler.createUser(req.body);
      } catch (error) {
        throw new ErrorHandler.ServerError(error);
      }
    }
  }
  async login(req, res) {
    const { email, password } = req.body;
    var user = await queryHandler.findUserByEmail(req.body);
    if (!user[0]) {
      throw new ErrorHandler.BadRequestError("Email or Password is Incorrect");
    } else if (user) {
      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword)
        throw new ErrorHandler.BadRequestError(
          "Email or Password is Incorrect"
        );
    }
    try {
      const tokenGenerator = new TokenGenerator({ email: user[0].email });
      var response = await tokenGenerator.getAuthToken();

      
      // passport.serializeUser((user, done) => {
      //   done(null, false);
      // });
      // passport.deserializeUser((user, done) => {
      //   done(null, user);
      // });
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async logout(req, res) {
    res.clearCookie("token");
    // req.logout();
  }
  async refreshToken(req, res) {
    const { token, email } = req.body;

    try {
      if (token == null)
        throw new ErrorHandler.UnauthorizedError("Token Expired");
      const verifyToken = jwt.verify(
        token,
        apiConstants.TOKEN_SECRET.REFRESH_TOKEN,
        (err, user) => {
          if (err)
            throw new ErrorHandler.ForbiddenError("Forbidden, Invalid Token");
          return user;
        }
      );
      const tokenGenerator = new TokenGenerator({ email: verifyToken.email });
      const accessToken = await tokenGenerator.generateAccessToken();
      return { newToken: accessToken };
    } catch (error) {
      throw new ErrorHandler.ServerError();
    }
  }
}

module.exports = Auth;
