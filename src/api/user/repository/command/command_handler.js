const errorHandler = require("../../../../handler/error").ErrorHandler;
const UserModel = require("./command_model");
const { DB } = require("../../../../config/db/index");
const UserCommand = require("./command");
const bcrypt = require("bcryptjs");
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
      const hashedId = Math.random().toString(20).substring(2);
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const query = {
        text: "INSERT INTO user_tb(user_id,nama,email,no_hp,password,role) VALUES($1, $2, $3, $4, $5, $6)",
        values: [
          "USR-" + hashedId,
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
}

module.exports = UserCommandHandler;
