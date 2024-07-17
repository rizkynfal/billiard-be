const Joi = require("joi");

class TransaksiCommandModel {
  constructor() {
    this.bookingScheme = Joi.object({
      email: Joi.string().email(),
      produk: Joi.object().required(),
      price: Joi.number().integer(),
    });
  }
  validate(booking) {
    return this.bookingScheme.validate(booking);
  }
}
module.exports = TransaksiCommandModel;
