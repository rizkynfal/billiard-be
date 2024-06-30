require("dotenv").config();
const { PORT } = process.env;
const port = PORT || 8000;
module.exports = {
  port,
};
