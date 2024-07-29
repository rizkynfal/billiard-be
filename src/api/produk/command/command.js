const { ErrorHandler } = require("../../../handler/error");
const ProdukQueryHandler = require("../query/query_handler");
const pg = require("../../../config/db/db");
const { isEmpty } = require("validate.js");
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
  async updateProduk(data) {
    let query = `UPDATE product_tb `;
    var count = 0;

    if (typeof data.nama !== "undefined" && !isEmpty(data.nama)) {
      if (count == 0) {
        query = query + `SET  nama = 'MEJA ${data.nama}'`;
      } else {
        query = query + `,nama = 'MEJA ${data.nama}'`;
      }
      count++;
    }
    console.log(
      typeof data.harga !== "undefined" &&
        !isEmpty(data.harga) &&
        typeof data.harga !== "NaN" &&
        data.harga !== null + " " + data.harga
    );
    if (data.harga) {
      if (count == 0) {
        query = query + `SET  harga = '${data.harga}'`;
      } else {
        query = query + `,harga = '${data.harga}'`;
      }
      count++;
    }
    if (typeof data.deskripsi !== "undefined") {
      if (count == 0) {
        query = query + `SET  deskripsi = '${data.deskripsi}'`;
      } else {
        query = query + `,deskripsi = '${data.deskripsi}'`;
      }
      count++;
    }
    if (typeof data.fotoProduk !== "undefined") {
      if (count == 0) {
        query =
          query +
          `SET foto_product = '${data.fotoProduk}', mime_type = '${data.mimeType}'`;
      } else {
        query =
          query +
          `,foto_product = '${data.fotoProduk}', mime_type = '${data.mimeType}'`;
      }
      count++;
    }
    query = query + ` WHERE product_id = '${data.produkId}'`;

    const res = await pg.dbQuery(query);
    return res;
  }
}
module.exports = ProdukCommand;
