const pg = require("../../../../config/db/db");
const { ErrorHandler } = require("../../../../handler/error");
// const pg = require("../../../../config/db/db");

class UserCommand {
  constructor() {}
  async createUser(data) {
    const query = `INSERT INTO user_tb(user_id,nama,email,no_hp,password,role) VALUES('${data.userId}', '${data.nama}', '${data.email}', '${data.noHp}', '${data.hashedPassword}', '${data.role}')`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async userResetPass(data) {
    const query = `SET datestyle = dmy;UPDATE user_tb SET password = '${data.newPassword}', otp = '', otp_expired=null WHERE email = '${data.email}' `;
    const res = await pg.dbQuery(query);
    return res;
  }
  async userUpdateOTP(data) {
    const query = `SET datestyle = dmy;UPDATE user_tb SET otp = '${data.otp}', otp_expired = '${data.otpExpire}' WHERE user_id = '${data.userId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
}
module.exports = UserCommand;
