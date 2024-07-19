const ProdukCommandHandler = require("./command/command_handler");
const ProdukQueryHandler = require("./query/query_handler");
const command = new ProdukCommandHandler();
const query = new ProdukQueryHandler();
module.exports = {
  produkHandler: { command, query },
};
