const { ErrorHandler } = require("../../../../handler/error");
const pg = require("../../../../config/db/db");
class UserQuery {
  constructor() {}
  async getAllUser() {
    const query = `SELECT * FROM user_tb `;
    var res = await pg.dbQuery(query);
    return res[0];
  }
  async getUserByEmail(data) {
    const query = `SELECT * FROM user_tb WHERE email = '${data.email}'`;
    var res = await pg.dbQuery(query);
    return res;
  }
}
module.exports = UserQuery;
