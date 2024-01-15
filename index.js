const puppeteer = require('puppeteer');
const urlpencarian = require('./isian');
const fs = require('fs');
const Lamar = require('./functionlamar');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

    await page.setViewport({ width: 1080, height: 1024 });
    await page.goto(`${urlpencarian}`, { waitUntil: 'networkidle2' });

    const jobCardSelector = '.CompactJobCardListsc__JobCardListContainer-sc-hzuvo1-0.gPGURO.stylessc__CompactJobCardList-sc-gkietk-0.dPHkNE > div';

    await page.waitForSelector(jobCardSelector);


    const jobDetails = await page.$$eval(jobCardSelector, jobCards =>
        jobCards.map((jobCard, index) => {
            const tidakadagaji = jobCard.querySelector('.CompactOpportunityCardsc__NotDisclosedMessage-sc-dkg8my-23.hivaYx')?.innerText;
            const no = index++
            const title = jobCard.querySelector('.CompactOpportunityCardsc__JobTitle-sc-dkg8my-9.hgMGcy')?.innerText;
            const gaji = jobCard.querySelector('.CompactOpportunityCardsc__SalaryWrapper-sc-dkg8my-29.gfPeyg')?.innerText || tidakadagaji;
            const NamaPT = jobCard.querySelector('.CompactOpportunityCardsc__CompanyLink-sc-dkg8my-10.iTRLWx')?.innerText
            const lokasi = jobCard.querySelector('.CardJobLocation__StyledTruncatedLocation-sc-1by41tq-1.kEinQH')?.innerText;
            const hari = jobCard.querySelector('.CompactOpportunityCardsc__OpportunityMeta-sc-dkg8my-20.kRwONg')?.innerText;
            const link = jobCard.querySelector('a.CompactOpportunityCardsc__CardAnchorWrapper-sc-dkg8my-24')?.href;


            return { no, title, NamaPT, gaji, lokasi, hari, link };
        })
    );
    await page.goto(`${urlpencarian}&page=2`, { waitUntil: 'networkidle2' });
    await page.waitForSelector(jobCardSelector);
    const jobDetails2 = await page.$$eval(jobCardSelector, jobCards =>
        jobCards.map((jobCard, index) => {
            const tidakadagaji = jobCard.querySelector('.CompactOpportunityCardsc__NotDisclosedMessage-sc-dkg8my-23.hivaYx')?.innerText;
            const no = index++
            const title = jobCard.querySelector('.CompactOpportunityCardsc__JobTitle-sc-dkg8my-9.hgMGcy')?.innerText;
            const gaji = jobCard.querySelector('.CompactOpportunityCardsc__SalaryWrapper-sc-dkg8my-29.gfPeyg')?.innerText || tidakadagaji;
            const NamaPT = jobCard.querySelector('.CompactOpportunityCardsc__CompanyLink-sc-dkg8my-10.iTRLWx')?.innerText
            const lokasi = jobCard.querySelector('.CardJobLocation__StyledTruncatedLocation-sc-1by41tq-1.kEinQH')?.innerText;
            const hari = jobCard.querySelector('.CompactOpportunityCardsc__OpportunityMeta-sc-dkg8my-20.kRwONg')?.innerText;
            const link = jobCard.querySelector('a.CompactOpportunityCardsc__CardAnchorWrapper-sc-dkg8my-24')?.href;


            return { no, title, NamaPT, gaji, lokasi, hari, link };
        })
    );
    const gabungan = [...jobDetails, ...jobDetails2]
    fs.writeFile('listsemua.json', JSON.stringify(gabungan, null, 2), err => {
        if (err) {
            console.error('Error menulis file', err);
        } else {
            console.log('List ada di listsemua.json');
        }
    });
    await browser.close();
    console.log('Menjalankan Function Lamar...');
    Lamar()
})();

