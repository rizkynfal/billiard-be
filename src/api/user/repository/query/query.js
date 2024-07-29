const { ErrorHandler } = require("../../../../handler/error");
const pg = require("../../../../config/db/db");
class UserQuery {
  constructor() {}
  async customGetUser(data) {
    let sql = `SELECT * FROM user_tb  `;
    let count = 0;
    let value = [];
    let conditions = [];

    if (typeof data.email !== undefined) {
      if (count == 0) {
        conditions.push(`WHERE email ILIKE  $${conditions.length + 1}`);
      } else {
        conditions.push(`email ILIKE  $${conditions.length + 1}`);
      }
      value.push(`%${data.email}%`);
      count++;
    }
    if (typeof data.nama !== undefined) {
      if (count == 0) {
        conditions.push(`WHERE nama ILIKE  $${conditions.length + 1}`);
      } else {
        conditions.push(`nama ILIKE  $${conditions.length + 1}`);
      }
      value.push(`%${data.nama}%`);
      count++;
    }
    sql += conditions.join(" OR ");

    const querySql = {
      text: sql,
      values: value,
    };
    var res = await pg.dbQuery(querySql);
    return res[0];
  }
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
