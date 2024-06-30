const joi = require("joi");

class ProdukCommandModel {
  constructor() {
    this.produkSchema = joi.object({
      nama: joi.string().required(),
      harga: joi.number().required(),
      deskripsi: joi.string().allow(null),
    });
  }
  validateUserInput(produk) {
    return this.produkSchema.validate(produk);
  }
}

module.exports = ProdukCommandModel;
