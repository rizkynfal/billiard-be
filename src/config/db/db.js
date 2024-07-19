const { pgConfig } = require("../index");
const { util } = require("../../utils");
const { DB } = require("./conn");

const dbQuery = async (query) => {
  try {
    const dbConfig = pgConfig;
    const conn = new DB(dbConfig);
    let db = await conn.getConnDB();
    if (db == undefined) {
      db = await conn.createConnectPool();
    }
    const client = await db.connect();
    const recordSet = () =>
      new Promise((resolve, reject) => {
        client.query(query, (err, result) => {
          client.release();
          if (err) {
            reject(console.log(`Postgres Connection: ${err.message}`));
          } else {
            const { rows } = result;
            resolve(rows);
          }
        });
      });
    return recordSet().catch((err) => {
      console.log(err);
      return err;
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};
module.exports = { dbQuery };
