// query
exports.queryGetAllSQL = (table) => {
  switch (table) {
    case "produk":
      return `SELECT * FROM product_tb`;
    case "user":
      return `SELECT * FROM usert_tb`;
    case "booking":
      return `SELECT * FROM booking_tb`;
    case "transaksi":
      return `SELECT * FROM transaksi_tb`;
    default:
      return "Table has not registered yet";
  }
};
// insertSql

exports.commandInsertSQL = (table) => {
  switch (table) {
    case "produk":
      return `INSERT INTO product_tb(product_id,nama,harga,deskripsi,is_deleted) VALUES($1,$2,$3,$4,$5)`;
    case "user":
      return "INSERT INTO user_tb(user_id,nama,email,no_hp,password,role) VALUES($1,$2,$3,$4,$5,$6)";
    default:
      return "Table has not registered yet";
  }
};
//delete SQl
exports.commandDeleteSQL = (table) => {
  switch (table) {
    case "produk":
      return `DELETE FROM product_tb WHERE product_id = $1 returning product_id`;
    case "user":
      return "INSERT INTO user_tb(user_id,nama,email,no_hp,password,role) VALUES($1,$2,$3,$4,$5,$6)";
    default:
      return "Table has not registered yet";
  }
};
