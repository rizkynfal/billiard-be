const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const QueryHandler = require("../user/repository/query/query_handler");
const CommandHandler = require("../user/repository/command/command_handler");
const queryHandler = new QueryHandler();
const commandHandler = new CommandHandler();
const { ErrorHandler } = require("../../handler/error");
const { apiConstants, util } = require("../../utils/index");
const TokenGenerator = require("./jwt_token");
const passport = require("passport");
const nodemailer = require("nodemailer");
const error = require("../../handler/error");

class Auth {
  constructor() {
    this.otp = "";
  }
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
      const tokenGenerator = new TokenGenerator({ user: user[0] });
      var response = await tokenGenerator.getAuthToken();
      return {
        token: response,
        user: { nama: user[0].nama, email: user[0].email, role: user[0].role },
      };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async logout(req, res) {
    res.clearCookie("token");
    // req.logout();
  }

  async resetPassword(req, res) {
    if (!req.body) {
      throw new ErrorHandler.BadRequestError("Request body invalid");
    }
    const { email, newPassword, otp } = req.body;

    var user = await queryHandler.findUserByEmail(req.body);

    if (!otp || user[0].otp != otp || Date(user[0].otp_expired) < Date.now()) {
      throw new ErrorHandler.BadRequestError("OTP Invalid");
    }

    try {
      var response = await commandHandler.userResetPassword(req.body);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }

  async requestOTP(req, res) {
    const { email } = req.body;
    var user = await queryHandler.findUserByEmail(req.body);
    if (!user[0]) {
      throw new ErrorHandler.BadRequestError("Email not found");
    }
    try {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const otpExpired = new Date();
      otpExpired.setMinutes(otpExpired.getMinutes() + 1);
      var result = await commandHandler.userUpdateOTP({
        user_id: user[0].user_id,
        otp: otp,
        otpExpired: otpExpired,
      });

      if (result.rowCount < 1) {
        throw new ErrorHandler.ServerError("Internal Server Error");
      }
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: apiConstants.GMAIL_OTP.GMAIL,
          pass: apiConstants.GMAIL_OTP.PASS,
        },
      });
      const mailOptions = {
        from: apiConstants.GMAIL_OTP.GMAIL,
        to: email,
        subject: "Password reset OTP",
        text: `Your OTP (It is expired after 1 min) : ${otp}`,
      };
      const { error, info } = await transporter.sendMail(mailOptions);

      if (error) {
        throw new ErrorHandler.ServerError(error);
      }
      return { email: email, otp: otp, otpExpire: otpExpired, info: info };
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
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
      throw new ErrorHandler.ServerError(error);
    }
  }
}

module.exports = Auth;
