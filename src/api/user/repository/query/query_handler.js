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
        var response = await query.customGetUser(param);
        return {
          userId: response.user_id,
          nama: response.nama,
          email: response.email,
          noHp: response.no_hp,
          role: response.role,
        };
      } catch (error) {
        throw new ErrorHandler.ServerError(error);
      }
    }
  }
}

module.exports = UserQueryHandler;
