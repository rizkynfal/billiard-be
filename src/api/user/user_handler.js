const UserCommandHandler = require("./repository/command/command_handler");
const UserQueryHandler = require("./repository/query/query_handler");
const command = new UserCommandHandler();
const query = new UserQueryHandler();
module.exports = {
  userHandler: { command, query },
};
