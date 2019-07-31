import moment from "moment";
// @ts-ignore
import { retrieverFactory } from "../../../index";
import CanadianLawList from "../index";
import Company from "../Company";
import Search from "../Search";
import {
  Collection,
  Edge,
  Email,
  Facebook,
  LinkedIn,
  Organization,
  Person,
  Phone,
  Place,
  Tag,
  Twitter,
  Website
  // @ts-ignore
} from "../../../Entities";
import { any } from "bluebird";

const SOURCE = "canadianlawlist:contact";

const retriever = retrieverFactory.getRetriever(SOURCE);

async function validateURL(url: string): Promise<boolean> {
  try {
    const input = new URL(url);
    return (
      (await validateURL(url)) &&
      /\/listingdetail\/contact\/[^/]+\/$/.test(input.pathname)
    );
  } catch (error) {
    return false;
  }
}

async function index(): Promise<Array<string>> {
  const provincePartitions = await Search.partitionByProvince(
    "https://canadianlawlist.com/searchresult/?searchtype=lawyers"
  );
  const pagePartitions = await Promise.all(
    provincePartitions.map(Search.partitionByPagination)
  );
  return [].concat.apply([], pagePartitions);
}

async function extract(url: any) {
  const $ = await retriever.getStaticCheerio(url);
  const data = {
    name: String,
    titles: String,
    calledToBar: any,
    companies: any,
    description: String,
    career: String,
    tags: String,
    awards: String,
    education: String,
    memberships: String,
    personalWebPage: String
  };
  data.name = $("span[itemprop = 'name']").text();
  data.titles = $("span[itemprop = 'jobTitle']")
    .map((i: any, tr: any) =>
      $(tr)
        .text()
        .replace(":", "")
    )
    .get();
  if (
    $(".listingdetail_individualmaininfo")
      .text()
      .indexOf("Called to the bar") !== -1
  ) {
    data.calledToBar = $(".listingdetail_individualmaininfo")
      .text()
      .replace(/.*Called to the bar:/, "")
      .trim()
      .split(";")
      .map((string: any) => ({
        date: string.match(/\d{4}/)[0],
        jurisdiction: string.match(/\(([^)]+)\)/)[0].slice(1, -1)
      }));
  }
  // Companies
  data.companies = await Promise.all(
    $(".comany-item")
      .map(async (i: any, c: any) => {
        const company = {
          name: String,
          address: String,
          locality: String,
          region: String,
          postalCode: String,
          phone: any,
          email: String,
          website: String,
          linkedin: String,
          twitter: String,
          facebook: String
        };
        company.name = $("a[title = 'companylink']", c).text();
        company.address = $("span[itemprop = 'streetAddress'] div", c)
          .map((j: any, div: any) => $(div).text())
          .get()
          .join(", ");
        company.locality = $("span[itemprop = 'addressLocality']", c).text();
        company.region = $("span[itemprop = 'addressRegion']", c).text();
        company.postalCode = $("span[itemprop = 'postalCode']", c).text();
        const phone = $("span[itemprop = 'telephone']")
          .first()
          .text()
          .split("Ext:");
        company.phone = {
          number: phone[0],
          extension: Number
        };
        if (phone.length > 1) {
          company.phone.extension = phone[1];
        }
        company.email = $("span[itemprop = 'email']", c).text();
        company.website = $("a[title = 'websitelink']", c).attr("href");
        company.linkedin = $("a[title = 'Linkedin']", c).attr("href");
        company.twitter = $("a[title = 'Twitter']", c).attr("href");
        company.facebook = $("a[title = 'Facebook']", c).attr("href");
        return company;
      })
      .get()
  );

  const trArray = $(".listingdetail_enhanceddata tr")
    .map((i: any, tr: any) => $(tr).text())
    .get();

  // Description
  const description = trArray.filter((text: any) => text.startsWith("Profile"));
  if (description.length > 0) {
    data.description = description[0].replace("Profile", "");
  }

  // Career history
  const career = trArray.filter((text: any) => text.startsWith("Career"));
  if (career.length > 0) {
    data.career = career[0].replace("Career History", "");
  }

  // Tags
  const tags = trArray.filter((text: any) =>
    text.startsWith("Areas of Practice")
  );
  if (tags.length > 0) {
    data.tags = tags[0]
      .replace("Areas of Practice", "")
      .trim()
      .split("; ");
  }

  // Honours / Awards
  const awards = trArray.filter((text: any) => text.startsWith("Honour"));
  if (awards.length > 0) {
    data.awards = awards[0]
      .replace("Honour/Awards", "")
      .trim()
      .split(";");
  }

  // Education
  const education = trArray.filter((text: any) => text.startsWith("Education"));
  if (education.length > 0) {
    data.education = education[0]
      .replace("Education", "")
      .trim()
      .split(";\n");
  }

  // Memberships
  const memberships = trArray.filter((text: any) =>
    text.startsWith("Memberships")
  );
  if (memberships.length > 0) {
    data.memberships = memberships[0]
      .replace("Memberships", "")
      .trim()
      .split("; ");
  }

  // Personal Company Website Page
  const personalWebPage = trArray.filter((text: any) =>
    text.startsWith("Website")
  );
  if (personalWebPage.length > 0) {
    data.personalWebPage = personalWebPage[0].replace("Website Link", "");
  }
  return data;
}

async function process(params: { url: string }) {
  const data = await extract(params.url);
  const collection = new Collection(SOURCE, params.url);

  // Nodes
  const person = new Person();

  // Edges

  // Save
  collection.add();
  collection.commit();
}

export default {
  SOURCE,
  validateURL,
  index,
  extract,
  process
};
