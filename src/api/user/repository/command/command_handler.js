const errorHandler = require("../../../../handler/error").ErrorHandler;
const UserModel = require("./command_model");
const { DB } = require("../../../../config/db/index");
const UserCommand = require("./command");
const bcrypt = require("bcryptjs");
const { util } = require("../../../../utils");
class UserCommandHandler {
  constructor() {
    this.db = new DB();
    this.model = new UserModel();
  }

  async createUser(body) {
    const { error } = this.model.validateUserInput(body);
    if (error) {
      throw new errorHandler.BadRequestError(error);
    } else {
      const hashedId = util.generateRandomNumber();
      const userId = "USR-" + hashedId;

      const hashedPassword = await bcrypt.hash(body.password, 10);
      const query = {
        text: "INSERT INTO user_tb(user_id,nama,email,no_hp,password,role) VALUES($1, $2, $3, $4, $5, $6)",
        values: [
          userId,
          body.nama,
          body.email,
          body.noHp,
          hashedPassword,
          body.role,
        ],
      };
      const command = new UserCommand(this.db.db, query);
      try {
        await command
          .create()

          .catch((err) => {
            throw new errorHandler.ServerError(err);
          });
        return {
          nama: body.nama,
          email: body.email,
        };
      } catch (error) {
        throw new errorHandler.ServerError(error);
      }
    }
  }
  async userResetPassword(body) {
    const { email, newPassword, otp } = body;
    const { error } = this.model.validateResetPassword(body);

    if (error) {
      throw new errorHandler.BadRequestError(error);
    } else {
      try {
        const sql = {
          text: "UPDATE user_tb SET password = $1, otp = '', otp_expired=null WHERE email = $2 ",
          values: [newPassword, email],
        };
        var response = await this.db.db.query(sql);
        if (response.rowCount < 1) {
          throw new errorHandler.ServerError("Internal Server Error");
        }
        return { email: email };
      } catch (error) {
        throw new errorHandler.ServerError(error);
      }
    }
  }
  async userUpdateOTP(body) {
    const { user_id, otp, otpExpired } = body;
    if (!user_id || !otp || !otpExpired) {
      throw new errorHandler.BadRequestError("body invalid");
    }
    try {
      const sql = {
        text: "UPDATE user_tb SET otp = $1, otp_expired = $2 WHERE user_id = $3",
        values: [otp, otpExpired, user_id],
      };
      var response = await this.db.db.query(sql);
      return response;
    } catch (error) {
      throw new errorHandler.ServerError(error);
    }
  }
}

module.exports = UserCommandHandler;
