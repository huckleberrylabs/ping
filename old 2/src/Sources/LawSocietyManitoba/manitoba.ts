import "babel-polyfill";
import { URL } from "url";
import cheerio from "cheerio";
import Debug from "debug";
import { norm, scrapePageHTML, sliceBySubStrings } from "./lib";

const INBOUND_QUEUE = process.env.INBOUND_QUEUE || "service-scrape:waiting";

const NAMESPACE = "lawyers:manitoba";
const HOST = "portal.lawsociety.mb.ca";
const ORIGIN = "https://portal.lawsociety.mb.ca";
const URI_SEARCH_PATH = "/Lookup2/recordlist.php";
const URI_SEARCH_PARAMS = "?-skip=0&-max=100";
const PAGE_SIZE = 100;

const debug = Debug(NAMESPACE);

function scrapeProfiles($) {
  const numCells = $(".browse_cell").get().length;
  const profiles = [];
  for (let index = 0; index < numCells; index += 4) {
    const cellArray = $(".browse_cell")
      .eq(index)
      .html()
      .replace("&#xA0;", " ")
      .split("<br>");
    debug(
      $(".browse_cell")
        .eq(index)
        .html()
        .replace("&#xA0;", " ")
        .split("<br>")
    );
    const profile = {
      name: sliceBySubStrings(cellArray[0], "<strong>", "</strong>")
        .split(",")
        .reverse()
        .join(" "),
      address: norm([cellArray[2], cellArray[3]].join(" ")),
      phone: norm(cellArray[4].replace("Phone:", "")),
      fax: norm(cellArray[5].replace("Fax:", "")),
      email: norm(cellArray[6].replace("Email:", "")),
      calledToBar: norm(
        $(".browse_cell")
          .eq(index + 1)
          .text()
      ),
      organization: norm(
        $(".browse_cell")
          .eq(index + 2)
          .text()
      ),
      status: norm(
        $(".browse_cell")
          .eq(index + 3)
          .text()
      )
    };
    profiles.push(profile);
  }
  debug(profiles);
  return profiles;
}

function generateURLs($) {
  const numResults = parseInt(
    sliceBySubStrings(norm($(".recordlist_nav_range").text()), "of"),
    10
  );
  const pUri = new URL([ORIGIN, URI_SEARCH_PATH, URI_SEARCH_PARAMS].join(""));
  const urls = [];
  for (let index = 0; index < numResults; index += PAGE_SIZE) {
    pUri.searchParams.set("-skip", index);
    urls.push(pUri.toString());
  }
  debug(urls);
  return urls;
}

async function scraper(
  uri: { indexOf: (arg0: string) => number },
  browser: any,
  callback: {
    (arg0: {
      data: {
        name: any;
        address: any;
        phone: any;
        fax: any;
        email: any;
        calledToBar: any;
        organization: any;
        status: any;
      };
    }): void;
    (arg0: { uri: any; intermediate: any }): void;
  }
) {
  const pUri = new URL(uri);
  if (pUri.host === HOST) {
    debug("Scraping...");
    if (uri.indexOf("?-skip=") !== -1) {
      const profiles = await scrapeProfiles(await scrapePageHTML(uri, browser));
      return Promise.all(
        profiles.map(async profile => callback({ data: profile }))
      );
    }
    const links = await generateURLs(await scrapePageHTML(uri, browser));
    return Promise.all(
      links.map(async link =>
        callback({ uri: link, intermediate: INBOUND_QUEUE })
      )
    );
  }
  return null;
}

export default scraper;
