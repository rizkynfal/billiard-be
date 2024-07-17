const joi = require("joi");

class ProdukCommandModel {
  constructor() {
    this.produkSchema = joi.object({
      nama: joi.string().required(),
      harga: joi.number().required(),
      deskripsi: joi.string().allow(null),
      foto_produk: joi
        .object({
          mimetype: joi
            .string()
            .valid("image/png", "image/jpeg", "image/jpg")
            .allow(null),
        })
        .unknown(true),
    });
  }
  validateUserInput(produk) {
    return this.produkSchema.validate(produk);
  }
}

module.exports = ProdukCommandModel;
