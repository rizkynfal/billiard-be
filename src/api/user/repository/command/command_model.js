const joi = require("joi");

class UserCommandModel {
  constructor() {
    this.userSchema = joi.object({
      user_id: joi.string().required(),
      nama: joi.string().required(),
      email: joi.string().email(),
      noHp: joi.string(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      role: joi.number(),
    });
  }
  validateUserInput(user) {
    return this.userSchema.validate(user);
  }
}

module.exports = UserCommandModel;
