import "babel-polyfill";
import { URL } from "url";
import cheerio from "cheerio";
import Debug from "debug";
// @ts-ignore
import { norm, scrapePageHTML, sliceBySubStrings } from "./lib";

const INBOUND_QUEUE = process.env.INBOUND_QUEUE || "service-scrape:waiting";

const NAMESPACE = "lawyers:saskatchewan";
const HOST = "lss.alinityapp.com";
const ORIGIN = "https://lss.alinityapp.com";
const URI_SEARCH_PATH = "/WebClient/RegistrantDirectory.aspx";
const URI_DETAIL_PATH = "/WebClient/RegistrantDirectoryPopup.aspx";
const URI_DETAIL_PARAMS = "?ScrollHeight=5000&MPEID=MPERegistrantDirectory";

const debug = Debug(NAMESPACE);

async function scrapeURLs(browser: { newPage: () => any }) {
  const page = await browser.newPage();
  await page.goto([ORIGIN, URI_SEARCH_PATH].join(""));
  await Promise.all([
    page.click('input[type="submit"]'),
    page.waitForSelector(".alnGrid")
  ]);
  const $ = cheerio.load(await page.content());
  page.close();
  let links = $(".alnGridItem a")
    .map((i, el) => $(el).attr("href"))
    .get()
    .map(item => ({
      conid: sliceBySubStrings(item, "CONID=", "&ORID="),
      orid: sliceBySubStrings(item, "&ORID=", "','modalRight'")
    }));
  links = links.concat(
    $(".alnGridAlternatingItem a")
      .map((i, el) => $(el).attr("href"))
      .get()
      .map(item => ({
        conid: sliceBySubStrings(item, "CONID=", "&ORID="),
        orid: sliceBySubStrings(item, "&ORID=", "','modalRight'")
      }))
  );
  links = links.map(item => {
    const pUri = new URL([ORIGIN, URI_DETAIL_PATH, URI_DETAIL_PARAMS].join(""));
    pUri.searchParams.set("conid", item.conid);
    pUri.searchParams.set("orid", item.orid);
    return pUri.toString();
  });
  return links;
}

function scrapeProfile(uri: any, $: any) {
  let address = "";
  let organization = "";
  if (
    $(".groupboxTDLabelContent")
      .eq(7)
      .html() !== null
  ) {
    const addressTemp = $(".groupboxTDLabelContent")
      .eq(7)
      .html()
      .trim()
      .split("<br>");
    organization = norm(addressTemp[0]);
    addressTemp.shift();
    address = norm(addressTemp.join(""));
  }
  const nameArray = $(".groupboxTDLabelContent")
    .eq(0)
    .text()
    .trim()
    .split(" ");
  const profile = {
    uri,
    fullName: norm(
      $(".groupboxTDLabelContent")
        .eq(0)
        .text()
    ),
    firstName: norm(nameArray[0]),
    lastName: norm(nameArray[nameArray.length - 1]),
    email: norm(
      $(".groupboxTDLabelContent")
        .eq(1)
        .text()
    ),
    gender: norm(
      $(".groupboxTDLabelContent")
        .eq(2)
        .text()
    ),
    barristerNumber: norm(
      $(".groupboxTDLabelContent")
        .eq(3)
        .text()
    ),
    admittedDate: norm(
      $(".groupboxTDLabelContent")
        .eq(4)
        .text()
    ),
    registrationType: norm(
      $(".groupboxTDLabelContent")
        .eq(5)
        .text()
    ),
    languages: norm(
      $(".groupboxTDLabelContent")
        .eq(6)
        .text()
    ),
    address,
    organization,
    phone: norm(
      $(".groupboxTDLabelContent")
        .eq(8)
        .text()
    ),
    fax: norm(
      $(".groupboxTDLabelContent")
        .eq(9)
        .text()
    ),
    website: norm(
      $(".groupboxTDLabelContent")
        .eq(10)
        .text()
    ),
    practiceRestrictions: norm(
      $(".groupboxTDLabelContent")
        .eq(11)
        .text()
    )
  };
  debug(profile);
  return profile;
}

async function scraper(uri: any, browser: any, callback: any) {
  const pUri = new URL(uri);
  if (pUri.host === HOST) {
    debug("Scraping...");
    if (pUri.pathname.indexOf(URI_SEARCH_PATH) !== -1) {
      const links = await scrapeURLs(browser);
      return Promise.all(
        links.map(async link =>
          callback({ uri: link, intermediate: INBOUND_QUEUE })
        )
      );
    } else if (pUri.pathname.indexOf(URI_DETAIL_PATH) !== -1) {
      const profile = await scrapeProfile(
        uri,
        await scrapePageHTML(uri, browser)
      );
      return callback({ data: profile });
    }
  }
  return null;
}

export default scraper;
