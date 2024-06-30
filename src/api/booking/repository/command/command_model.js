const Joi = require("joi");

class BookingCommandModel {
  constructor() {
    this.bookingScheme = Joi.object({
      email: Joi.string().email(),
      product: Joi.object(),
      price: Joi.number().integer(),
    });
  }
  validate(booking) {
    return this.bookingScheme.validate(booking);
  }
}
module.exports = BookingCommandModel;
