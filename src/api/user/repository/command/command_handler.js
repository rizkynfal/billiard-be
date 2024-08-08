const errorHandler = require("../../../../handler/error").ErrorHandler;
const UserModel = require("./command_model");
const { DB } = require("../../../../config/db/conn");
const UserCommand = require("./command");
const { util } = require("../../../../utils");
const command = new UserCommand();
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
      try {
        const hashedId = util.generateRandomNumber();
        const userId = "USR-" + hashedId;

        const hashedPassword = await util.hashPassword(body.password);
        const data = {
          userId: userId,
          nama: body.nama,
          email: body.email,
          noHp: body.noHp,
          hashedPassword: hashedPassword,
          role: body.role,
        };
        var response = await command.createUser(data);

        return response;
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
        const data = {
          newPassword: newPassword,
          email: email,
        };
        var response = await command.userResetPass(data);
        if (!response) {
          throw new errorHandler.ServerError("Failed to reset pass");
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
      const data = {
        otp: otp,
        otpExpire: otpExpired,
        userId: user_id,
      };
      var response = await command.userUpdateOTP(data);
      return response;
    } catch (error) {
      throw new errorHandler.ServerError(error);
    }
  }
}

module.exports = UserCommandHandler;
