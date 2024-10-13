const fs = require("fs");
const puppeteer = require("puppeteer");
const cookieData = require("./cookies.json");

async function Lamar() {
  const dataBuffer = fs.readFileSync("listsemua.json");
  const data = JSON.parse(dataBuffer.toString());
  // console.log(data);
  const chromeExecutablePath =
    "C:\\Users\\RidwanTech\\AppData\\Local\\Google\\Chrome\\User Data";
  try {
    const browser = await puppeteer.launch({
      headless: true,
      // userDataDir: chromeExecutablePath,
      // ignoreDefaultArgs: ['--disable-extensions'],
      // args: ['--profile-directory=Default']
    });
    const page = await browser.newPage();
    const cookies = cookieData.cookies;

    await page.setCookie(...cookies);
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1080, height: 1024 });

    const buttonlamar =
      "#__next > div:nth-child(2) > div.NavigationComponentssc__DrawerContainer-sc-1aet6wg-0.PoGHL > div.MainContainersc__MainLayout-sc-xmyke8-0.desvou > div.MainContainersc__MainBody-sc-xmyke8-2.drnzBQ > div.GlintsContainer-sc-usaans-0.fNeuNN > div > main > div.TopFoldsc__JobOverViewInfoContainer-sc-1fbktg5-8.jxryeM > div.TopFoldsc__ButtonContainer-sc-1fbktg5-19.hSLEkX > div.TopFoldsc__ApplyButtonDesktop-sc-1fbktg5-20.RXCY > div > div > button";
    const buttonlamar2 =
      "#glints-portal-container > div > div > div.ModalStyle__StyledModalActions-sc-1694up4-4.dGzlNE > div > div";
    await page.goto(
      `https://glints.com/id/opportunities/jobs/full-stack-web-developer/47b926d7-99eb-4fbb-b45d-1acc90af496c?utm_referrer=explore"`,
      { waitUntil: "load" }
    );
    let indexLamaran = 0;
    console.log(
      `========== Mengirim Lamaran ke`,
      data.length,
      `Link ==========`
    );
    for (let jobData of data) {
      if (jobData && jobData.link) {
        try {
          await page.setViewport({ width: 1080, height: 1024 });
          await page.goto(`${jobData.link}`, { waitUntil: "load" });
          await page.waitForSelector(buttonlamar, {
            visible: true,
            timeout: 3000,
          });
          await page.click(buttonlamar);
          await page.waitForSelector(buttonlamar2, {
            visible: true,
            timeout: 3000,
          });
          await page.click(buttonlamar2);
          console.log(
            `[${indexLamaran}] Sukses melamar di ${jobData.NamaPT} (${jobData.title}) `
          );
        } catch (e) {
          fs.writeFile(
            "listgagallamar.json",
            JSON.stringify(data, null, 2),
            (err) => {
              if (err) {
                console.error("Error menulis file", err);
              } else {
                console.log(
                  `[${indexLamaran}] Gagal melamar di ${jobData.NamaPT} (${jobData.title}) karena sudah pernah melamar di PT tersebut`
                );
              }
            }
          );
        }
        indexLamaran++;
      }
    }
    console.log("Function Lamar Selesai");
    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
Lamar();
module.exports = Lamar;
