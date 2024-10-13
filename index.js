const puppeteer = require("puppeteer");
const urlpencarian = require("./isian");
const fs = require("fs");
const Lamar = require("./functionlamar");
const cookieData = require("./cookies.json");
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setCookie({
    name: "session",
    value: Cookies,
    domain: "glints.com",
  });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto(`${urlpencarian}`, { waitUntil: "networkidle2" });

  const nomorPaggination =
    ".AnchorPaginationsc__PaginationContainer-sc-8wke03-0.cqKlLw";
  await page.waitForSelector(nomorPaggination);

  const nomorHalaman = await page.$$eval(nomorPaggination, (paginations) =>
    paginations.map((pagination) => pagination.innerText)
  );
  const halamanArray = nomorHalaman[0]
    .split("\n")
    .filter((item) => item !== "...");
  const angkaTerakhir = halamanArray[halamanArray.length - 1];

  if (angkaTerakhir) {
    await addLink();
  }

  async function addLink() {
    let nomorUrut = 1;
    let gabungan = [];

    if (fs.existsSync("listsemua.json")) {
      const perikasa = fs.readFileSync("listsemua.json", "utf-8");

      if (perikasa.length > 1) {
        console.log(
          "File listsemua.json sudah ada dengan panjang data:",
          perikasa.length
        );
        gabungan = JSON.parse(perikasa);
        nomorUrut = gabungan[gabungan.length - 1].no + 1;
      }
    }

    console.log(
      `Terdapat`,
      angkaTerakhir,
      `pagination dan`,
      angkaTerakhir * 30,
      `data`
    );

    for (let index = 0; index < angkaTerakhir; index++) {
      console.log(`Mengambil data lamaran di halaman`, index + 1);
      await page.goto(`${urlpencarian}&page=${index + 1}`, {
        waitUntil: "networkidle2",
      });

      const cookies = cookieData.cookies;

      await page.setCookie(...cookies);

      const jobCardSelector =
        ".CompactJobCardListsc__JobCardListContainer-sc-hzuvo1-0.gPGURO.stylessc__CompactJobCardList-sc-gkietk-0.dPHkNE > div";

      await page.waitForSelector(jobCardSelector);

      const jobDetails = await page.$$eval(jobCardSelector, (jobCards) =>
        jobCards.map((jobCard) => {
          const tidakadagaji = jobCard.querySelector(
            ".CompactOpportunityCardsc__SalaryWrapper-sc-dkg8my-31.cdlTsx"
          )?.innerText;
          const title = jobCard.querySelector(
            ".CompactOpportunityCardsc__JobTitleSalaryWrapper-sc-dkg8my-10.iZSAsS"
          )?.innerText;
          const gaji =
            jobCard.querySelector(
              ".CompactOpportunityCardsc__SalaryWrapper-sc-dkg8my-31.cdlTsx"
            )?.innerText || tidakadagaji;
          const NamaPT = jobCard.querySelector(
            ".CompactOpportunityCardsc__CompanyLink-sc-dkg8my-12.gFOSRP"
          )?.innerText;
          const lokasi = jobCard.querySelector(
            ".CardJobLocation__StyledTruncatedLocation-sc-1by41tq-0.DgFSy"
          )?.innerText;
          const hari = jobCard.querySelector(
            ".CompactOpportunityCardsc__OpportunityMeta-sc-dkg8my-22.cqQwaq"
          )?.innerText;
          const link = jobCard.querySelector(
            ".CompactOpportunityCardsc__CardAnchorWrapper-sc-dkg8my-26.eQZSJa.job-search-results_job-card_link"
          )?.href;

          return { title, NamaPT, gaji, lokasi, hari, link };
        })
      );

      jobDetails.forEach((job) => {
        job.no = nomorUrut++;
      });

      gabungan = gabungan.concat(jobDetails);
    }

    fs.writeFileSync(
      "listsemua.json",
      JSON.stringify(gabungan, null, 2),
      (err) => {
        if (err) {
          console.error("Error menulis file", err);
        }
      }
    );

    console.log("Semua data telah ditambahkan ke listsemua.json");
  }

  await browser.close();

  console.log("Data berhasil ditambahkan ke listsemua.json");
  console.log("Menjalankan Function Lamar...");
  await Lamar()
})();
