// TODO: Finish Lawyer and Firm Profile Scrapers

import { URL } from "url";
import Debug from "debug";
// @ts-ignore
import { scrapePageHTML } from "./lib";

// https://canadalawyerlist.com/browse.php

const NAMESPACE = "law:canada-lawyer-list";
const HOST = "canadalawyerlist.com";
const ORIGIN = "https://canadalawyerlist.com";
const PATHNAME_BROWSE = "/browser";
const PATHNAME_CITY = "/city/";
const PATHNAME_DETAIL_LAWYER = "/lawyer/";
const PATHNAME_DETAIL_FIRM = "/firm/";
const RESULTS_PER_PAGE = 25;

const debug = Debug(NAMESPACE);

// Returns the Profile of a Lawyer
const scrapeLawyerProfile = async (
  request: any,
  browser: any,
  callback: any
) => {
  const $ = await scrapePageHTML(request.uri, browser);
  const response = request;
  response.intermediate = false;
  debug(response);
  return callback(response);
};

// Returns the Profile of a Firm
const scrapeFirmProfile = async (request: any, browser: any, callback: any) => {
  const $ = await scrapePageHTML(request.uri, browser);
  const response = request;
  response.intermediate = false;
  debug(response);
  return callback(response);
};

// Returns the Profile URIs From One Page of Results
const scrapeHrefs = async (request: any, browser: any, callback: any) => {
  debug("Scraping Result URIs...");
  const $ = await scrapePageHTML(request.uri, browser);
  const links = $("a");
  return Promise.all(
    links
      .map((_i: any, a: any) => $(a).attr("href"))
      .get()
      .filter(
        (href: { indexOf: { (arg0: string): number } }) =>
          href.indexOf("https://canadalawyerlist.com/lawyer/") !== -1 ||
          href.indexOf("https://canadalawyerlist.com/firm/") !== -1
      )
      .map((href: any) => {
        const response = request;
        response.intermediate = true;
        response.uri = href;
        return callback(response);
      })
  );
};

// Returns the Number of Records for the Search
const scrapeNumRecords = async (uri: any, browser: any) => {
  const $ = await scrapePageHTML(uri, browser);
  return Number(
    $(".subHeading .highlight")
      .last()
      .text()
  );
};

// Returns URIs that partition the Search Space by Page
const partitionSearchByPagination = async (
  request: any,
  browser: any,
  callback: any
) => {
  debug("Partitioning the Province Search Space by Page...");
  const numRecords = await scrapeNumRecords(request.uri, browser);
  const pages = Array.from(
    Array(Math.ceil(numRecords / RESULTS_PER_PAGE)).keys()
  );
  return Promise.all(
    pages.map(async pageNumber => {
      const pUri = new URL(request.uri);
      // @ts-ignore
      pUri.searchParams.set("page", pageNumber);
      const response = request;
      response.intermediate = true;
      response.uri = pUri.toString();
      return callback(response);
    })
  );
};

// Partitions Search Space By City
const partitionSearchByCity = async (
  request: any,
  browser: any,
  callback: any
) => {
  debug("Partitioning the Province Search Space by City...");
  const $ = await scrapePageHTML(request.uri, browser);
  const links = $("a");
  return Promise.all(
    links
      .map((i: any, a: any) => $(a).attr("href"))
      .get()
      .filter(
        (href: { indexOf: (arg0: string) => number }) =>
          href.indexOf("https://canadalawyerlist.com/city/") !== -1
      )
      .map((href: any) => {
        const response = request;
        response.intermediate = true;
        response.uri = href;
        return callback(response);
      })
  );
};

// Main Scraper Function
const extractor = async (request: any, browser: any, callback: any) => {
  const pUri = new URL(request.uri);
  if (pUri.host === HOST) {
    debug("Scraping...");
    if (pUri.pathname.indexOf(PATHNAME_BROWSE) !== -1) {
      return partitionSearchByCity(request, browser, callback);
    } else if (pUri.pathname.indexOf(PATHNAME_CITY) !== -1) {
      if (pUri.searchParams.get("page") === null) {
        return partitionSearchByPagination(request, browser, callback);
      }
      return scrapeHrefs(request, browser, callback);
    } else if (pUri.pathname.indexOf(PATHNAME_DETAIL_LAWYER) !== -1) {
      return scrapeLawyerProfile(request, browser, callback);
    } else if (pUri.pathname.indexOf(PATHNAME_DETAIL_FIRM) !== -1) {
      return scrapeFirmProfile(request, browser, callback);
    }
  }
  return null;
};

export { extractor };
