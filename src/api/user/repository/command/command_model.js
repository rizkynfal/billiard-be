const joi = require("joi");

class UserCommandModel {
  constructor() {
    this.userSchema = joi.object({
      nama: joi.string().required(),
      email: joi.string().email(),
      noHp: joi.string(),
      password: joi
        .string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      role: joi.number(),
    });
    this.resetPass = joi.object({
      email: joi.string().email().required(),
      newPassword: joi.string().required(),
      otp: joi.string().required(),
    });
  }
  validateUserInput(user) {
    return this.userSchema.validate(user);
  }
  validateResetPassword(resetPass) {
    return this.resetPass.validate(resetPass);
  }
}

module.exports = UserCommandModel;
