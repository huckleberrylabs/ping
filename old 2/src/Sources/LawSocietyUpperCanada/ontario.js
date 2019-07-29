import "babel-polyfill";
import async from "async";
import { URL } from "url";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import uuidv4 from "uuid/v4";
import Debug from "debug";

const debug = Debug("Ontario");
process.setMaxListeners(0);

// Ontario has 69,475 Lawyers and Paralegals in the database

const CHARS = "abcdefghijklmnopqrstuvwxyz";
const RECORDS_FOUND = "Total records returned for this search:";
const NARROW_SEARCH = "Please narrow your search";
const MINIMUM_SEARCH = "Please enter at least one";
const landingURI =
  "http://www2.lsuc.on.ca/LawyerParalegalDirectory/loadSearchPage.do";
const resultsURI =
  "http://www2.lsuc.on.ca/LawyerParalegalDirectory/searchMore.do?searchMore=next&startPoint=0";
const searchURI =
  "http://www2.lsuc.on.ca/LawyerParalegalDirectory/search.do?submitType=&searchType=STARTSWITH&memberType=B&lastName=a&firstName=&city=&postalCode=&practiceArea%5B0%5D.practiceAreaCheckBox=false&practiceArea%5B1%5D.practiceAreaCheckBox=false&practiceArea%5B2%5D.practiceAreaCheckBox=false&practiceArea%5B3%5D.practiceAreaCheckBox=false&practiceArea%5B4%5D.practiceAreaCheckBox=false&practiceArea%5B5%5D.practiceAreaCheckBox=false&practiceArea%5B6%5D.practiceAreaCheckBox=false&practiceArea%5B7%5D.practiceAreaCheckBox=false&practiceArea%5B8%5D.practiceAreaCheckBox=false&practiceArea%5B9%5D.practiceAreaCheckBox=false&practiceArea%5B10%5D.practiceAreaCheckBox=false&practiceArea%5B11%5D.practiceAreaCheckBox=false&practiceArea%5B12%5D.practiceAreaCheckBox=false&practiceArea%5B13%5D.practiceAreaCheckBox=false&practiceArea%5B14%5D.practiceAreaCheckBox=false&practiceArea%5B15%5D.practiceAreaCheckBox=false&practiceArea%5B16%5D.practiceAreaCheckBox=false&practiceArea%5B17%5D.practiceAreaCheckBox=false&practiceArea%5B18%5D.practiceAreaCheckBox=false&practiceArea%5B19%5D.practiceAreaCheckBox=false&practiceArea%5B20%5D.practiceAreaCheckBox=false&practiceArea%5B21%5D.practiceAreaCheckBox=false&practiceArea%5B22%5D.practiceAreaCheckBox=false&practiceArea%5B23%5D.practiceAreaCheckBox=false&practiceArea%5B24%5D.practiceAreaCheckBox=false&practiceArea%5B25%5D.practiceAreaCheckBox=false&practiceArea%5B26%5D.practiceAreaCheckBox=false&practiceArea%5B27%5D.practiceAreaCheckBox=false&practiceArea%5B28%5D.practiceAreaCheckBox=false&serviceInFrench=false&method=Submit";

// number of ms to delay between requests
const RATE_DELAY = 1000;

// wrap setTimeout into a promise so we can use async/await
const wait = async ms => new Promise(resolve => setTimeout(resolve, ms));

const extractAllNumbers = string => string.match(/\d+/g);

const saveProfile = async (browser, href) => {
  // debug('Hey', href);
  const page = await browser.newPage();
  await page.goto(["http://www2.lsuc.on.ca", href].join(""), {
    timeout: 0,
    waitUntil: "domcontentloaded",
  });
  const $ = cheerio.load(await page.content());
  await page.close();
  const fileName = [uuidv4(), ".html"].join("");
  debug("Writing To File: ", fileName.toString());
  fs.writeFile(
    path.join(process.cwd(), "data", "ontario", fileName),
    $("table div table").html(),
    "utf-8",
    err => {
      if (err) {
        debug(err);
      }
    }
  );
};

const crawlProfiles = async (browser, numPages) => {
  const pages = Array.from(Array(numPages).keys()).map(x => 10 * x);
  const hrefs = await Promise.all(
    pages.map(async pageNumber => {
      const paginationURI = new URL(resultsURI);
      paginationURI.searchParams.set("startPoint", pageNumber);
      const page = await browser.newPage();
      await page.goto(paginationURI.toString(), {
        timeout: 0,
        waitUntil: "domcontentloaded",
      });
      const $ = cheerio.load(await page.content(), {
        timeout: 0,
        waitUntil: "domcontentloaded",
      });
      await page.close();
      return $('td[bgcolor="#FFFFFF"] font a')
        .map((i, a) => $(a).attr("href"))
        .get();
    })
  );
  await Promise.all(
    [].concat(...hrefs).map(async href => saveProfile(browser, href))
  );
  browser.close();
};

const scrape = indexArray => {
  async.eachLimit(
    indexArray,
    2,
    async (index, done) => {
      const localSearchURI = new URL(searchURI);
      localSearchURI.searchParams.set("lastName", index.search);
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(landingURI, {
        timeout: 0,
        waitUntil: "domcontentloaded",
      });
      await page.goto(localSearchURI.toString(), {
        timeout: 0,
        waitUntil: "domcontentloaded",
      });
      await page.close();
      debug("Scraping: ", index.search);
      crawlProfiles(browser, Math.ceil(index.records / 10));
      done(null);
    },
    err => (err ? debug(err) : debug("done"))
  );
};

const recursiveScrape = async oldSearch => {
  async.each(CHARS.split(""), async char => {
    const newSearch = [oldSearch, char].join("");
    const localSearchURI = new URL(searchURI);
    localSearchURI.searchParams.set("lastName", newSearch);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(landingURI, { timeout: 0, waitUntil: "domcontentloaded" });
    await page.goto(localSearchURI.toString(), {
      timeout: 0,
      waitUntil: "domcontentloaded",
    });
    const $ = cheerio.load(await page.content());
    await page.close();
    debug("Scraping: ", newSearch);
    try {
      const records = $(`font:contains(${RECORDS_FOUND})`).text();
      if (records !== "") {
        const numRecords = Number(records.replace(RECORDS_FOUND, ""), 10);
        debug("Live Leaf:", newSearch, " with ", numRecords, " RECORDS");
        crawlProfiles(browser, Math.ceil(numRecords / 10));
      } else {
        const contentError = $(".content_error").text();
        if (
          contentError.indexOf(NARROW_SEARCH) !== -1 ||
          contentError.indexOf(MINIMUM_SEARCH) !== -1
        ) {
          debug("Search Too Broad: ", newSearch);
          recursiveScrape(newSearch);
          browser.close();
        } else if (contentError.indexOf("NO RECORDS") !== -1) {
          debug("Dead Leaf: ", newSearch);
          browser.close();
        } else {
          const sessionError = $("font.bold").text();
          if (sessionError.indexOf("session is expired") !== -1) {
            throw new Error("Session Is Expired");
          }
          throw new Error("Something Unexpected Happened");
        }
      }
    } catch (err) {
      debug(err.message);
      browser.close();
    }
  });
};

const recursiveIndex = (oldSearch, browser) =>
  CHARS.split("").map(async char => {
    const newSearch = [oldSearch, char].join("");
    const localSearchURI = new URL(searchURI);
    localSearchURI.searchParams.set("lastName", newSearch);
    const page = await browser.newPage();
    await page.goto(localSearchURI.toString(), {
      timeout: 0,
      waitUntil: "domcontentloaded",
    });
    const $ = cheerio.load(await page.content());
    await page.close();
    debug("Scraping: ", newSearch);
    const records = $(`font:contains(${RECORDS_FOUND})`).text();
    const contentError = $(".content_error").text();
    if (records !== "") {
      const numRecords = Number(records.replace(RECORDS_FOUND, ""), 10);
      debug("Live Leaf:", newSearch, " with ", numRecords, " RECORDS");
      return { search: newSearch, records: numRecords };
    } else if (
      contentError.indexOf(NARROW_SEARCH) !== -1 ||
      contentError.indexOf(MINIMUM_SEARCH) !== -1
    ) {
      debug("Search Too Broad: ", newSearch);
      await wait(RATE_DELAY);
      return {
        search: newSearch,
        records: await Promise.all(recursiveIndex(newSearch, browser)),
      };
    } else if (contentError.indexOf("NO RECORDS") !== -1) {
      debug("Dead Leaf: ", newSearch);
      return { search: newSearch, records: 0 };
    }
    return { search: newSearch, records: -1 };
  });

const flattenIndex = index => {
  if (typeof index.records === "number" && index.records > 0) {
    return index;
  } else if (Array.isArray(index.records)) {
    const result = index.records.map(item => flattenIndex(item));
    return [].concat(...result);
  } else if (Array.isArray(index)) {
    const result = index.map(item => flattenIndex(item));
    return [].concat(...result);
  }
};

const string = fs.readFileSync(
  path.join(process.cwd(), "data", "ontario", "map.json"),
  "utf8"
);
const index = JSON.parse(string);
const searches = flattenIndex(index).filter(i => i !== undefined);
debug(searches.map(i => i.records).reduce((a, b) => a + b, 0));
const lastSearchIndex = searches.findIndex(x => x.search === "zi");
scrape(searches.slice(lastSearchIndex));

/*
const string = fs.readFileSync(path.join(process.cwd(), 'data', 'ontario', 'map.json'), 'utf8');
debug(extractAllNumbers(string).map(str => Number(str)).reduce((a, b) => a + b, 0));
*/

/*
(async function index() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(landingURI, { timeout: 0, waitUntil: 'domcontentloaded' });
  const jsonMap = await Promise.all(recursiveIndex('', browser));
  await page.close();
  browser.close();
  debug(jsonMap);
  fs.writeFileSync(path.join(process.cwd(), 'data', 'ontario', 'map.json'), JSON.stringify(jsonMap, null, 4), 'utf-8', (err) => {
    if (err) {
      debug(err);
    }
  });
}());
*/

//recursiveScrape('aa');
