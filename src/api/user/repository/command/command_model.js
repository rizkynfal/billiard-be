const joi = require("joi");

class UserCommandModel {
  constructor() {}
  validateUserInput(user) {
    const userSchema = joi.object({
      nama: joi.string().required(),
      email: joi.string().email(),
      noHp: joi.string(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      role: joi.number(),
    });
    return userSchema.validate(user);
  }
  validateResetPassword(resetPass) {
    const resetPassSchema = joi.object({
      email: joi.string().email().required(),
      newPassword: joi.string().required(),
      otp: joi.string().required(),
    });
    return resetPassSchema.validate(resetPass);
  }
}

module.exports = UserCommandModel;
