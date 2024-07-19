const { ErrorHandler } = require("../../../../handler/error");
const pg = require("../../../../config/db/db");

class UserCommand {
  constructor() {}
  async createUser(data) {
    try {
      const query = `INSERT INTO user_tb(user_id,nama,email,no_hp,password,role) VALUES('${data.userId}', '${data.nama}', '${data.email}', '${data.noHp}', '${data.hashedPassword}', '${data.role})'`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (err) {
      throw new ErrorHandler.ServerError(err);
    }
  }
  async userResetPass(data) {
    try {
      const query = `UPDATE user_tb SET password = '${data.newPassword}', otp = '', otp_expired=null WHERE email = '${data.email}' `;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(err);
    }
  }
  async userUpdateOTP(data) {
    try {
      const query = `UPDATE user_tb SET otp = '${data.otp}', otp_expired = '${data.otpExpire}' WHERE user_id = '${data.userId}'`;
      const res = await pg.dbQuery(query);
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(err);
    }
  }
}
module.exports = UserCommand;
