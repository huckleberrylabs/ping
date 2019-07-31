import "babel-polyfill";
import { URL } from "url";
import Debug from "debug";
import { norm, scrapePageHTML, scrapeHrefs } from "./lib";

const INBOUND_QUEUE = process.env.INBOUND_QUEUE || "service-scrape:waiting";

const NAMESPACE = "lawyers:alberta";
const HOST = "lsa.memberpro.net";
const ORIGIN = "https://lsa.memberpro.net";
const URI_SEARCH_PATH = "/ssl/main/body.cfm";
const URI_DETAIL_PATH = "/main/body.cfm";
const GENDER_QUERY_PARAMS = ["M", "F"];
const ROOT_SEARCH =
  "https://lsa.memberpro.net/ssl/main/body.cfm?menu=directory&page_no=1&records_perpage_qy=100000&person_nm=&first_nm=&city_nm=&location_nm=&area_ds=&language_cl=&member_status_cl=&mode=search";
const PROFILE_PATH =
  "https://lsa.memberpro.net/main/body.cfm?menu=directory&submenu=directoryPractisingMember";

const debug = Debug(NAMESPACE);

// Scrapes profile and returns in JSON format
function scrapeProfile(uri: any, $: any) {
  const temp = $(".content")
    .clone()
    .children()
    .remove()
    .end()
    .text()
    .trim()
    .split("\n");
  const firm = norm(temp[0]);
  temp.shift();
  const address = norm(temp.join(" "));
  const profile = {
    uri,
    name: norm($(".content-heading").text()),
    gender:
      $(".table-result")
        .text()
        .indexOf("Male") !== -1
        ? "male"
        : "female",
    status: norm($(".table-result:nth-of-type(2)").text()),
    enrollmentDate: norm($(".table-result:nth-of-type(3)").text()),
    phones: $(".table-auto tr td")
      .filter(
        (i: any, el: any) =>
          $(el)
            .text()
            .search(/[0-9]{4}/) !== -1
      )
      .map((i: any, el: any) =>
        norm(
          $(el)
            .text()
            .replace(/[A-z]/g, "")
        )
      )
      .toArray(),
    specialties: norm(
      $(".table-result")
        .filter(
          (i: any, el: any) =>
            $(el)
              .text()
              .indexOf("%") !== -1
        )
        .text()
    ).replace(")", ") "),
    firm,
    address
  };
  return profile;
}

// Returns URIs that Partition the Search Space by Gender
function partitionSearchByGender() {
  return GENDER_QUERY_PARAMS.map(gender => {
    const pUri = new URL(ROOT_SEARCH);
    pUri.searchParams.set("gender_cl", gender);
    return pUri.toString();
  });
}

// Main Scraper Function
async function scraper(uri: any, browser: any, callback: any) {
  const pUri = new URL(uri);
  if (pUri.host === HOST) {
    debug("Scraping...");
    if (
      pUri.pathname.indexOf(URI_SEARCH_PATH) === -1 &&
      pUri.pathname.indexOf(URI_DETAIL_PATH) === -1
    ) {
      debug("Partitioning the Search Space by Gender.");
      return Promise.all(
        partitionSearchByGender().map(async genderedURI =>
          callback({ intermediate: INBOUND_QUEUE, uri: genderedURI })
        )
      );
    } else if (pUri.pathname.indexOf(URI_SEARCH_PATH) !== -1) {
      const links = await scrapeHrefs(
        uri,
        await scrapePageHTML(uri, browser),
        (href: { indexOf: (arg0: string) => number }) =>
          href.indexOf(PROFILE_PATH) !== -1
      );
      return Promise.all(
        links.map(async (link: any) =>
          callback({ intermediate: INBOUND_QUEUE, uri: link })
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
