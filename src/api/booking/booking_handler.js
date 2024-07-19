const BookingCommandHandler = require("./repository/command/command_handler");
const BookingQueryHandler = require("./repository/query/query_handler");
const command = new BookingCommandHandler();
const query = new BookingQueryHandler();
module.exports = {
  bookingHandler: { command, query },
};
