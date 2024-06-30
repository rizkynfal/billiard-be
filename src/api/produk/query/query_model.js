const joi = require("joi");

class ProdukQueryModel {
  constructor() {}
  validateParamFindByTanggal(tanggal) {
    const produkSchema = joi.object({
      tanggal: joi.date().required(),
    });
    return produkSchema.validate(tanggal);
  }
  validateParamFindByEmail(user) {
    const userSchema = joi.object({
      email: joi.string().email().required(),
    });
    return userSchema.validate(user);
  }
}

module.exports = ProdukQueryModel;
