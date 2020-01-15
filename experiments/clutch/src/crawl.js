const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const Papa = require("papaparse");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const fileName = process.argv[2];
if (typeof fileName !== "string" || fileName.indexOf(".csv") === -1) {
  throw new Error("invalid file name provided");
}

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
  path: date + "-crawler-error.csv",
  header: ["profile"]
});

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
  // TODO crawl
  await browser.close();
})();
