import moment from "moment";
import { retrieverFactory } from "../../../index";
import CanadianLawList from "../index";
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
  Website,
} from "../../../Entities";

const SOURCE = "canadianlawlist:company";

const retriever = retrieverFactory.getRetriever(SOURCE);

async function validateURL(url: string): Promise<boolean> {
  try {
    const input = new URL(url);
    const isValid =
      (await CanadianLawList.validateURL(url)) &&
      /\/listingdetail\/company\/[^/]+\/$/.test(input.pathname);
    return isValid;
  } catch (error) {
    return false;
  }
}

async function index(): Promise<Array<string>> {
  const provincePartitions = await CanadianLawList.partitionByProvince(
    "https://canadianlawlist.com/searchresult/?searchtype=firms"
  );
  const pagePartitions = await Promise.all(
    provincePartitions.map(CanadianLawList.partitionByPagination)
  );
  return [].concat.apply([], pagePartitions);
}

async function extract(url: string): Object {
  const $ = await retriever.getStaticCheerio(url);
  const data = {};
  data.name = $("span[itemprop = 'name']").text();
  data.address = $("div", $("span[itemprop = 'streetAddress']").first())
    .map((j, div) => $(div).text())
    .get()
    .join(", ");
  data.locality = $("span[itemprop = 'addressLocality']")
    .first()
    .text();
  data.region = $("span[itemprop = 'addressRegion']")
    .first()
    .text();
  data.postalCode = $("span[itemprop = 'postalCode']")
    .first()
    .text();
  const phone = $("span[itemprop = 'telephone']")
    .first()
    .text()
    .split("Ext:");
  data.phone = {
    number: phone[0],
  };
  if (phone.length > 1) {
    data.phone.extension = phone[1];
  }
  data.email = $("span[itemprop = 'email']")
    .first()
    .text();
  data.website = $("a[title = 'websitelink']").text();
  data.linkedin = $("a[title = 'Linkedin']").attr("href");
  data.twitter = $("a[title = 'Twitter']").attr("href");
  data.facebook = $("a[title = 'Facebook']").attr("href");
  const tableRowsTextArray = $(".listingdetail_enhanceddata tr")
    .map((i, tr) => $(tr).text())
    .get();
  // Areas of practice
  const tags = tableRowsTextArray.filter(
    text => text.indexOf("Areas of Practice") === 0
  );
  if (tags.length > 0) {
    data.tags = tags[0]
      .replace("Areas of Practice", "")
      .trim()
      .split("; ");
  }
  // Description
  const description = tableRowsTextArray.filter(
    text => text.indexOf("Firm Profile") === 0
  );
  if (description.length > 0) {
    data.description = description[0].replace("Firm Profile", "");
  }
  // Lawyer profiles
  data.lawyers = $(".listingdetail_individual_item h3 a")
    .map((i, a) => ({
      name: $(a).text(),
      url: `https://canadianlawlist.com${$(a).attr("href")}`,
    }))
    .get();
  return data;
}

async function process(params: { url: string }): void {
  const data = await extract(params.url);
  const collection = new Collection(SOURCE, params.url);

  // Nodes
  const organization = new Organization({
    name: data.name,
    description: data.description,
  });
  const place = new Place({
    address: data.address,
    locality: data.locality,
    region: data.region,
    country: "Canada",
    postalCode: data.postalCode,
  });
  const phone = new Phone(data.phone, {
    place: place,
  });
  const email = new Email(data.email);
  const website = new Website(data.website);
  const linkedin = new LinkedIn(data.linkedin);
  const twitter = new Twitter(data.twitter);
  const facebook = new Website(data.facebook);
  const tags = data.tags.map(tag => new Tag(tag));
  const people = data.lawyers.map(person => new Person({ name: person.name }));

  // Edge
  const organizationPlace = new Edge(organization, place);
  const organizationPhone = new Edge(organization, phone);
  const organizationEmail = new Edge(organization, email);
  const organizationWebsite = new Edge(organization, website);
  const organizationLinkedIn = new Edge(organization, linkedin);
  const organizationTwitter = new Edge(organization, twitter);
  const organizationFacebook = new Edge(organization, facebook);
  const organizationTags = tags.map(tag => new Edge(organization, tag));
  const organizationPeople = people.map(
    person => new Edge(organization, person)
  );
  // Save
  collection.add(
    ...tags,
    ...people,
    ...organizationTags,
    ...organizationPeople,
    organization,
    place,
    phone,
    email,
    website,
    linkedin,
    twitter,
    facebook,
    organizationPlace,
    organizationPhone,
    organizationEmail,
    organizationWebsite,
    organizationLinkedIn,
    organizationTwitter,
    organizationFacebook
  );
  collection.commit();
}

const Company = {
  SOURCE,
  validateURL,
  index,
  extract,
  process,
};
