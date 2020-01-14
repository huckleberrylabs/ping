const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const date = new Date().toISOString();
const dataWriter = createCsvWriter({
  path: "../" + date + "-data.csv",
  header: ["id", "name", "tagline", "profile", "website", "directory", "page"]
});
const errorWriter = createCsvWriter({
  path: "../" + date + "-error.csv",
  header: ["directory", "page"]
});

/* 
article#summary

verified
description = [property=description] for each p get text
min project size = .bordered-mobile-block .field-items[0].text
avg. hourly rate = .bordered-mobile-block .field-items[1].text
employees = .bordered-mobile-block .field-items[2].text
founded = .bordered-mobile-block .field-items[3].text

for each .profile-map-block .vcard

	headquarters = is first in index?
	address = .street-address.text
	locality = .locality.text
	region = .region.text
	postal code = .postal-code.text
	country = .country-name.text
	phone = .tel.text


Later

article#focus
article#portfolio
article#reviews
*/

const CLUTCH_URL = "https://clutch.co/";
const DIRECTORIES = [
  "directory/mobile-application-developers",
  "web-developers",
  "web-designers",
  "it-services",
  "bpo",
  "seo-firms",
  "agencies"
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  process.once("SIGINT", () => browser.close());
  const page = await browser.newPage();

  for (let i = 0; i < DIRECTORIES.length; i++) {
    const directory = DIRECTORIES[i];
    const directoryURL = CLUTCH_URL + directory + "?page=";
    let hasResults = true;
    let pageNum = 1;
    try {
      while (hasResults) {
        await sleep(randomInt(1, 3000));
        await page.goto(directoryURL + pageNum, {
          timeout: 1000000
        });
        const $ = cheerio.load(await page.content());
        hasResults = $("li.provider-row").length > 0;
        if (hasResults) {
          console.log("extracting page: ", pageNum);
          $("li.provider-row").map(async (i, el) => {
            try {
              const entry = {
                id: $(el)
                  .children(".row")
                  .attr("data-clutch-nid"),
                name: $(el)
                  .find(".company-name")
                  .text()
                  .trim(),
                tagline: $(el)
                  .find(".tagline")
                  .text()
                  .trim(),
                profile: $(el)
                  .find(".company-name a")
                  .attr("href"),
                website: new URL(
                  $(el)
                    .find(".website-link a")
                    .attr("href")
                ).origin,
                directory: directory,
                page: pageNum
              };
              await dataWriter.writeRecords([entry]);
            } catch (error) {
              console.log(
                "error on ",
                directory,
                "page ",
                pageNum,
                ", element ",
                i
              );
            }
          });
          pageNum++;
        }
      }
    } catch (error) {
      console.log("error on ", directory, "page ", pageNum);
      await dataWriter.writeRecords([{ directory: directory, page: pageNum }]);
    }
  }
  await browser.close();
})();
