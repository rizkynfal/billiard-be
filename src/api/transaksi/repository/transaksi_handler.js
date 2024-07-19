const TransaksiCommandHandler = require("./command/command_handler");
const TransaksiQueryHandler = require("./query/query_handler");
const command = new TransaksiCommandHandler();
const query = new TransaksiQueryHandler();
module.exports = {
  transaksiHandler: { command, query },
};
