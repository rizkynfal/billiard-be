const { isEmpty } = require("validate.js");
const { DB } = require("../../../../config/db/conn");
const { ErrorHandler } = require("../../../../handler/error");
const MidtransClient = require("../../../../service/midtrans_handler");
const { util } = require("../../../../utils");
const TransaksiQuery = require("./query");
const query = new TransaksiQuery();
const date = require("date-and-time");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const puppeteer = require("puppeteer");
const nodeHtmlToImage = require("node-html-to-image");
class TransaksiQueryHandler {
  constructor() {
    this.db = new DB();
  }
  async getAllTransaksiList() {
    try {
      var response = await query.getAllTransaksi();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransaksiList(body) {
    const { filterTanggal, paymentSuccess, namaPenyewa } = body;
    try {
      var response;
      if (
        (typeof filterTanggal === undefined ||
          filterTanggal == null ||
          isEmpty(filterTanggal)) &&
        (typeof paymentSuccess === undefined ||
          paymentSuccess == null ||
          isEmpty(paymentSuccess))
      ) {
        response = await this.getAllTransaksiList();
      } else {
        response = await query.getTransaksiList(body);
      }
      var res = [];
      for (let i = 0; i < response.length; i++) {
        res.push({
          no: i + 1,
          transaksiId: response[i].transaksi_id,
          userId: response[i].user_id,
          tanggalTransaksi:
            util.formattedDate(new Date(response[i].tanggal_transaksi)) +
            " " +
            response[i].jam_transaksi,
          statusTransaksi: response[i].status_transaksi,
          paymentMethod: response[i].payment_method,
          lamaSewa: response[i].total_lama_sewa,
          totalHarga: response[i].total_harga,
          noMeja: response[i].nama_produk,
          namaPenyewa: response[i].nama_penyewa,
          noHp: response[i].no_hp,
          jamMain: response[i].jam_main,
        });
      }
      return res;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransacionStatus(param) {
    try {
      const midtransClient = new MidtransClient(param);
      var response = await midtransClient.getTransactionStatus();
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionById(param) {
    try {
      var response = await query.getTransaksiById({ transaksiId: param });
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionTglPRid(param) {
    try {
      var response = await query.getTransaksiByProdukIdAndTanggal(param);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionUsrIdAndTanggal(param) {
    try {
      var response = await query.getTransaksiByUserIdAndTanggal(param);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionByTanggal(param) {
    try {
      var response = await query.getTransaksiByTanggal(param);
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionByUserId(param) {
    try {
      var res = await query.getTransaksiByUserId({ userId: param });
      var response = [];
      for (let i = 0; i < res.length; i++) {
        response.push({
          transaksiId: res[i].transaksi_id,
          userId: res[i].user_id,
          tanggalTransaksi:
            util.formattedDate(res[i].tanggal_transaksi) +
            " " +
            res[i].jam_transaksi,
          statusTransaksi: res[i].status_transaksi,
          lamaSewa: res[i].total_lama_sewa,
          totalHarga: res[i].total_harga,
          produk: res[i].produk,
          namaPenyewa: res[i].nama_penyewa,
          noHp: res[i].no_hp,
          productId: res[i].product_id,
          namaMeja: res[i].nama_meja,
          fotoProduct: res[i].foto_product,
        });
      }
      return response;
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
  async getTransactionPdf(param) {
    try {
      const dataTransaksi = await query.getTransaksiById({
        transaksiId: param.transaksiId,
      });
      const data = dataTransaksi[0];
      const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
      
  <div>
    <div as="div" className="relative z-10 font-body" onClose={onClose}>
      <div
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/25" />
      </div>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div>
            <div className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white p-10 text-left align-middle shadow-xl transition-all">
              <div className="absolute top-5 right-5 text-primaryBlack">
              </div>
              <div className="flex flex-col gap-10 pt-2">
                <div className="flex flex-col gap-5 divide-y-2 divide-primarySoftgray">
                  <div className="flex items-center justify-between ">
                    ${
                      data?.status_transaksi === "Success"
                        ? `<div className="flex items-center gap-3">
                          <div className="flex items-center justify-center rounded-full ">
                            <CheckCircle
                              size={40}
                              color="#00df16"
                              weight="fill"
                            />
                          </div>

                          <h1 className="text-20 font-semibold">
                            Transaksi Berhasil
                          </h1>
                        </div>`
                        : data?.status_transaksi
                        ? `<div className="flex items-center gap-3">
                          <div className="flex items-center justify-center rounded-full bg-primaryOrange">
                            <MinusCircle
                              size={32}
                              color="#ff6b00"
                              weight="fill"
                            />
                          </div>

                          <p className="text-16 font-semibold">
                            Transaksi Pending
                          </p>
                        </div>`
                        : ` <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center rounded-full ">
                            <XCircle
                              size={40}
                              color="#ff6262"
                              weight="fill"
                            />
                          </div>

                          <h1 className="text-20 font-semibold">
                            Transaksi Dibatalkan
                          </h1>
                        </div>`
                    }

                    <p className="text-12 text-primaryDarkgray font-semibold">
                      ${data?.transaksi_id}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-5">
                    {" "}
                    <p className="text-16 font-semibold text-primaryBlack">
                      Tanggal Transaksi
                    </p>
                    <p className="text-16 ">
                      ${
                        util.formattedDate(data?.tanggal_transaksi) +
                        " " +
                        data.jam_transaksi
                      }
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-16 font-semibold">Rincian Order</p>

                  <div className="flex flex-col gap-4 divide-y-2 divide-primarySoftgray border border-primaryOrange rounded-lg p-3">
                    <div className="flex flex-col gap-3">
                      <p className="text-12">Data Penyewa</p>
                      <div className="flex flex-col gap-1">
                        <p className="text-14 font-semibold">
                          ${data?.nama_penyewa}
                        </p>

                        <p className="text-12 text-primaryDarkgray font-semibold">
                          ${data?.no_hp}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                      <p className="text-12">Biaya Sewa</p>
                      <div className="flex items-center justify-between ">
                        <div className="flex items-center gap-3">
                          <Coins className="text-primaryOrange" size={12} />
                          <img
                            className="rounded-lg w-[52px] h-[52px] bg-black"
                            src=${`data:image/jpeg;base64,${data?.foto_product}`}
                          />
                          <div className="flex flex-col gap-1">
                            <p className="text-12">Meja ${data?.nama_meja}</p>
                            <p className="text-12 font-medium text-primaryDarkgray">
                              ${util.formattedDate(data?.tanggal_transaksi)}
                              ${data?.produk?.jamMain.map(
                                (hour, index) => hour + " "
                              )}
                            </p>
                          </div>
                        </div>
                        <p className="text-16 font-semibold">
                          Rp. ${data?.total_harga}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                      <p className="text-12">Biaya Tambahan</p>
                      <div className="flex items-center justify-between ">
                        <div className="flex items-center gap-3">
                          <Coins className="text-primaryOrange" size={12} />
                          <p className="text-12">Biaya Transaksi</p>
                        </div>

                        <p className="text-16 font-semibold">
                          Rp. 2000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-16 font-semibold">Total</p>
                  <p className="text-16 font-semibold">
                    Rp. ${data?.totalHarga + 2000}
                  </p>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
    </html> `;
      // Launch a headless browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set the HTML content
      // await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
      await page.goto("https://gobill.vercel.app/transaction-history", {
        waitUntil: "networkidle0",
      });

      // Set the viewport size
      await page.setViewport({ width: 800, height: 600 });

      // Capture screenshot
      const screenshotBuffer = await page.screenshot({ fullPage: true });

      // Close the browser
      await browser.close();

      // Create a new PDF document
      const doc = new PDFDocument();
      const pdfPath = "./src/public/invoice.pdf";

      // Pipe the PDF into a writable stream
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // Add the screenshot image to the PDF
      doc.image(screenshotBuffer, {
        fit: [500, 400],
        align: "center",
        valign: "center",
      });

      // Finalize the PDF and end the stream
      doc.end();

      // Wait for the PDF to be fully written
    } catch (error) {
      throw new ErrorHandler.ServerError(error);
    }
  }
}
module.exports = TransaksiQueryHandler;
