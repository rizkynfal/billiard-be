const joi = require("joi");

class ProdukCommandModel {
  constructor() {
    this.produkSchema = joi.object({
      noMeja: joi.string(),
      harga: joi.string().pattern(/^[0-9]+$/),
      deskripsi: joi.string().allow(null),
    });
  }
  validateProdukInput(produk) {
    return this.produkSchema.validate(produk);
  }
  validatePhoto(data) {
    var fotoSchema = joi
      .string()
      .valid("image/png", "image/jpeg", "image/jpg", "image/webp")
      .allow(null);

    return fotoSchema.validate(data);
  }
  validateProdukId(data) {
    var dataSchema = joi.object({
      produkId: joi.string().required(),
    });
    return dataSchema.validate(data);
  }
  validateProdukUpdate(data) {
    var produkSchema = joi.object({
      produkId: joi.string().required(),
      noMeja: joi.string().allow(null),
      harga: joi
        .string()
        .pattern(/^[0-9]+$/)
        .allow(null),
      deskripsi: joi.string().allow(null),
    });
    return produkSchema.validate(data);
  }
}

module.exports = ProdukCommandModel;
