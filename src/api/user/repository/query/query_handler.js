const { ErrorHandler } = require("../../../../handler/error");
const { DB } = require("../../../../config/db/conn");
const UserQueryModel = require("./query_model");
const UserQuery = require("./query");
const { text } = require("body-parser");
const query = new UserQuery();

class UserQueryHandler {
  constructor() {
    this.model = new UserQueryModel();
  }

  async findAll() {
    try {
      var response = await query.getAllUser();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError();
    }
  }

  async findUserByEmail(param) {
    if (param == null) throw new ErrorHandler.BadRequestError("Params null");
    const { error } = this.model.validateParamFindByEmail({
      email: param.email,
    });
    if (error) {
      throw new ErrorHandler.BadRequestError(error);
    } else {
      try {
        const data = {
          email: param.email,
        };
        var response = await query.getUserByEmail(data);

        return response;
      } catch (error) {
        throw new ErrorHandler.ServerError(error);
      }
    }
  }
  async findUserByNameOrEmail(param) {
    const { error } = this.model.validateParamFindByEmalOrName(param);
    if (error) {
      throw new ErrorHandler.BadRequestError(error);
    } else {
      try {
        let sql = `SELECT * FROM user_tb  `;
        let count = 0;
        let value = [];
        let conditions = [];

        if (typeof param.email !== "undefined") {
          if (count == 0) {
            conditions.push(`WHERE email ILIKE  $${conditions.length + 1}`);
          } else {
            conditions.push(`email ILIKE  $${conditions.length + 1}`);
          }
          value.push(`%${param.email}%`);
          count++;
        }
        if (typeof param.nama !== "undefined") {
          if (count == 0) {
            conditions.push(`WHERE nama ILIKE  $${conditions.length + 1}`);
          } else {
            conditions.push(`nama ILIKE  $${conditions.length + 1}`);
          }
          value.push(`%${param.nama}%`);
          count++;
        }
        sql += conditions.join(" OR ");

        const querySql = {
          text: sql,
          values: value,
        };

        var response = await query.getUser();
        return response;
      } catch (error) {
        throw new ErrorHandler.ServerError(error);
      }
    }
  }
}

module.exports = UserQueryHandler;
