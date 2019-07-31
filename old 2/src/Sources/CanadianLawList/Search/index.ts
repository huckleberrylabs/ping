// @ts-ignore
import Task, { TaskArrayPromise } from "../../../Entities/Task";
// @ts-ignore
import { retrieverFactory } from "../../../index";
import CanadianLawList from "../index";
import Contact from "../Contact";
import Company from "../Company";

const SOURCE = "canadianlawlist:search";

const retriever = retrieverFactory.getRetriever(SOURCE);

export const RESULTS_PER_PAGE = 10;
export const SEARCH_PARAM_TYPES = ["lawyers", "firms"];
export const SEARCH_PARAM_PROVINCES = [
  "ab",
  "bc",
  "mb",
  "nb",
  "nl",
  "ns",
  "nt",
  "nu",
  "on",
  "pe",
  "qc",
  "sk",
  "yt"
];

export async function validateURL(url: string): Promise<boolean> {
  try {
    const input = new URL(url);
    const isValid =
      (await CanadianLawList.validateURL(url)) &&
      input.pathname.startsWith("/searchresult") &&
      SEARCH_PARAM_TYPES.includes(
        input.searchParams.get("searchtype") || "{}"
      ) &&
      SEARCH_PARAM_PROVINCES.includes(
        input.searchParams.get("province") || "{}"
      );
    return isValid;
  } catch (error) {
    return false;
  }
}

// Return number of results for single page
export async function getNumberOfResults(url: string): Promise<number> {
  const $ = await retriever.getStaticCheerio(url);
  return Number(
    $(".searchresult_foundinfo")
      .text()
      .match(/\d+/g)
  );
}

// Return total number of results
export async function getTotalNumberOfResults(url: string): Promise<number> {
  const urls = await partitionByProvince(url);
  const resultsArray = await Promise.all(urls.map(getNumberOfResults));
  return resultsArray.reduce((a, b) => a + b, 0);
}

// Returns URIs that partition the search space by search yype
export async function partitionByType(url: string): Promise<Array<string>> {
  return SEARCH_PARAM_TYPES.map(type => {
    const input = new URL(url);
    input.searchParams.set("searchtype", type);
    return input.toString();
  });
}

// Returns URIs that partition the search space by province
export async function partitionByProvince(url: string): Promise<Array<string>> {
  return SEARCH_PARAM_PROVINCES.map(province => {
    const input = new URL(url);
    input.searchParams.set("province", province);
    return input.toString();
  });
}

// Returns URIs that partition the search space by page number
export async function partitionByPagination(
  url: string
): Promise<Array<string>> {
  const numResults = await getNumberOfResults(url);
  const pages = Array.from(
    Array(Math.ceil(numResults / RESULTS_PER_PAGE)).keys()
  );
  return pages.map(pageNumber => {
    const input = new URL(url);
    input.searchParams.set("page", String(pageNumber));
    return input.toString();
  });
}

export async function index(): TaskArrayPromise {
  const urls = await partitionByType(
    "https://canadianlawlist.com/searchresult"
  );
  const urls2 = [].concat.apply(
    [],
    await Promise.all(urls.map(partitionByProvince))
  );
  const urls3 = [].concat.apply(
    [],
    await Promise.all(urls2.map(partitionByPagination))
  );
  return urls3.map(url =>
    Task(CanadianLawList.namespace, "processSearch", { url })
  );
}

export async function process(params: { url: string }): TaskArrayPromise {
  const $ = await retriever.getStaticCheerio(params.url);
  const input = new URL(params.url);
  const allLinks = $("a")
    .map((i: any, a: any) => $(a).attr("href"))
    .get()
    .filter((href: { startsWith: (arg0: string) => void }) =>
      href.startsWith("/")
    )
    .map((href: any) => ["https://canadianlawlist.com", href].join(""));

  let filteredLinks = [];

  for (let i = 0; i < allLinks.length; i++) {
    if (input.searchParams.get("searchtype") === "lawyers") {
      if (await Contact.validateURL(allLinks[i])) {
        filteredLinks.push(
          Task(CanadianLawList.namespace, "processContact", {
            url: allLinks[i]
          })
        );
      }
    } else if (input.searchParams.get("searchtype") === "firms") {
      if (await Company.validateURL(params.url)(allLinks[i])) {
        filteredLinks.push(
          Task(CanadianLawList.namespace, "processCompany", {
            url: allLinks[i]
          })
        );
      }
    }
  }
  return filteredLinks;
}

const Search = {
  SOURCE,
  RESULTS_PER_PAGE,
  SEARCH_PARAM_TYPES,
  SEARCH_PARAM_PROVINCES,
  validateURL,
  getNumberOfResults,
  getTotalNumberOfResults,
  partitionByType,
  partitionByProvince,
  partitionByPagination,
  index,
  process
};

export default Search;
