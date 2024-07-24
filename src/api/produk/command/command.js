const { ErrorHandler } = require("../../../handler/error");
const ProdukQueryHandler = require("../query/query_handler");
const pg = require("../../../config/db/db");
class ProdukCommand {
  constructor() {}
  async createProduk(data) {
    const query = `INSERT INTO product_tb(product_id,nama,harga,deskripsi,is_deleted,foto_product,mime_type) VALUES('${data.productId}','${data.nama}','${data.harga}','${data.deskripsi}','${data.isDeleted}','${data.fotoProduk}','${data.mimeType}')`;
    const res = await pg.dbQuery(query);
    return res;
  }
  async addJamAvailableProduk(data) {
    const query = `INSERT INTO product_time_item_tb(product_id,time_available,tanggal) VALUES('${
      data.produkId
    }',ARRAY[${data.timeAvail.map((e) => `'${e}'`)}], '${data.tanggal}')`;

    const res = await pg.dbQuery(query);

    return res;
  }
  async updateProdukById(data) {
    const query = `UPDATE product_tb SET is_deleted = true WHERE product_id = '${data.produkId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }

  async deleteProdukById(data) {
    const query = `DELETE FROM product_tb WHERE product_id = '${data.produkId}'`;
    const res = await pg.dbQuery(query);
    return res;
  }
}
module.exports = ProdukCommand;
