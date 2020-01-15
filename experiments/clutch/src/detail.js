// TODO dont scrape entries where file is already present

/* 
Later

article#focus
article#portfolio
article#reviews
*/

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const Papa = require("papaparse");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const fileName = process.argv[2];
if (typeof fileName !== "string" || fileName.indexOf(".csv") === -1) {
  throw new Error("invalid file name provided");
}

const files = fs.readdirSync("details/");

const file = fs.readFileSync(fileName, "utf8");
const results = Papa.parse(file);

if (results.errors.length > 0) {
  console.error(results.errors);
  throw new Error("papa parse error");
}

if (results.data.some(entry => entry.length !== 7)) {
  throw new Error("data corrupt");
}

const index = results.data;

const date = new Date().valueOf();
const errorWriter = createCsvWriter({
  path: date + "-details-error.csv",
  header: ["profile"]
});

const CLUTCH_URL = "https://clutch.co";

const sleep = ms => new Promise(r => setTimeout(r, ms));

const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  process.once("SIGINT", () => browser.close());
  const page = await browser.newPage();
  for (let i = 0; i < index.length; i++) {
    const entry = index[i];
    const record = {
      id: entry[0],
      name: entry[1],
      tagline: entry[2],
      profile: entry[3],
      website: entry[4],
      directory: entry[5],
      page: entry[6]
    };
    try {
      await sleep(randomInt(1, 100));
      await page.goto(CLUTCH_URL + record.profile, {
        timeout: 1000000
      });
      const $ = cheerio.load(await page.content());
      // Summary
      const ctx = "article#summary";
      record.verified = $(".verification-wrapper-status __topstatus", ctx)
        .text()
        .trim();
      record.description = $("[property=description]", ctx)
        .text()
        .trim();
      record.min_project_size = $(".bordered-mobile-block .field-items", ctx)
        .eq(0)
        .text()
        .trim();
      record.avg_hourly_rate = $(".bordered-mobile-block .field-items", ctx)
        .eq(1)
        .text()
        .trim();
      record.num_employees = $(".bordered-mobile-block .field-items", ctx)
        .eq(2)
        .text()
        .trim();
      record.founded = $(".bordered-mobile-block .field-items", ctx)
        .eq(3)
        .text()
        .trim();
      record.locations = [];
      // locations
      $(".profile-map-block .vcard", ctx).map((i, el) => {
        const location = {
          headquarters: i === 0,
          address: $(el)
            .find(".street-address")
            .text()
            .trim(),
          locality: $(el)
            .find(".locality")
            .text()
            .trim(),
          region: $(el)
            .find(".region")
            .text()
            .trim(),
          postal_code: $(el)
            .find(".postal-code")
            .text()
            .trim(),
          country: $(el)
            .find(".country-name")
            .text()
            .trim(),
          phone: $(el)
            .find(".tel")
            .text()
            .trim()
        };
        record.locations.push(location);
      });
      fs.writeFileSync(
        "details/" + record.id + "-" + date + "-details.json",
        JSON.stringify(record, null, 2)
      );
      console.log(
        "progress: ",
        (i / index.length).toFixed(5),
        "%",
        "record: ",
        record.id
      );
    } catch (error) {
      console.log("error on ", record.profile, error);
      await errorWriter.writeRecords([{ directory: record.profile }]);
    }
  }
  await browser.close();
})();
