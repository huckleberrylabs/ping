import { URL } from "url";
import Debug from "debug";
import axios from "axios";
import cheerio from "cheerio";
import uuidv5 from "uuid/v5";
import uuidv4 from "uuid/v4";
import moment from "moment";
import {
  norm,
  normProvinces,
  phoneValidator,
  emailValidator,
  urlValidator,
  keywordExtractor
  // @ts-ignore
} from "./lib";

// http://www.canlaw.org

const NAMESPACE = "law:canlaw";
const HOST = "www.canlaw.org";
const PATHNAME_DETAIL = "cl/lawyers/lawyer_detail";
const MAX_LAWYER_ID = 72111;

const debug = Debug(NAMESPACE);

// Returns the Profile URIs
const scrapeLawyerProfile = async (
  request: {
    uri: any;
    name: string;
    calledToBar: string;
    degrees: string;
    phone: string;
    email: string;
    firm: string;
    website: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    specialties: void[];
    freeConsultation: boolean;
    acceptsLegalAid: boolean;
    intermediate: boolean;
  },
  callback: (arg0: any) => void
) => {
  const result = await axios({
    method: "get",
    url: request.uri,
    headers: {
      Cookie: "PHPSESSID=96e1fe450d3f2adc31ebee7009682f0d",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
    }
  });
  const $ = cheerio.load(result.data, { decodeEntities: false });
  const response = request;
  const tableRowsText = $("td")
    .map((i: any, tr: any) => $(tr).text())
    .get();

  // Name
  const name = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) => text.indexOf("Name:") > -1
  );
  if (name.length > 0) {
    response.name = name[0].replace("Name:", "").trim();
  }

  // Called To Bar
  const calledToBar = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) =>
      text.indexOf("Called to Bar:") > -1
  );
  if (calledToBar.length > 0) {
    response.calledToBar = calledToBar[0].replace("Called to Bar:", "").trim();
  }

  // Degrees
  const degrees = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) =>
      text.indexOf("Degrees:") > -1
  );
  if (degrees.length > 0) {
    response.degrees = degrees[0].replace("Degrees:", "").trim();
  }

  // Phone
  const phone = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) => text.indexOf("Tel:") > -1
  );
  if (phone.length > 0) {
    response.phone = phone[0].replace("Tel:", "").trim();
  }

  // Email
  const email = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) => text.indexOf("Email:") > -1
  );
  if (email.length > 0) {
    response.email = email[0].replace("Email:", "").trim();
  }

  // Firm
  const firm = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) =>
      text.indexOf("Company:") > -1
  );
  if (firm.length > 0) {
    response.firm = firm[0]
      .replace("Company:", "")
      .replace("Click to view all Lawyers in this company.", "")
      .trim();
  }

  // Website
  const website = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) =>
      text.indexOf("Website:") > -1
  );
  if (website.length > 0) {
    response.website = website[0].replace("Website:", "").trim();
  }

  // Address
  const address = tableRowsText
    .filter(
      (text: { indexOf: (arg0: string) => number }) =>
        text.indexOf("Address") > -1
    )
    .map(
      (text: {
        replace: (
          arg0: string,
          arg1: string
        ) => {
          replace: (
            arg0: string,
            arg1: string
          ) => {
            replace: (arg0: string, arg1: string) => { trim: () => void };
          };
        };
      }) =>
        text
          .replace("Address 1:", "")
          .replace("Address 2:", "")
          .replace("Address 3:", "")
          .trim()
    )
    .filter((text: string) => text !== "");

  response.address = address.join(", ");

  // City
  const city = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) => text.indexOf("City:") > -1
  );
  if (city.length > 0) {
    response.city = city[0].replace("City:", "").trim();
  }

  // Province
  const province = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) =>
      text.indexOf("Province:") > -1
  );
  if (province.length > 0) {
    response.province = province[0].replace("Province:", "").trim();
  }

  // Postal Code
  const postalCode = tableRowsText.filter(
    (text: { indexOf: (arg0: string) => number }) =>
      text.indexOf("Postal Code:") > -1
  );
  if (postalCode.length > 0) {
    response.postalCode = postalCode[0].replace("Postal Code:", "").trim();
  }

  // Specialties
  const specialties = tableRowsText
    .filter(
      (text: { indexOf: (arg0: string) => number }) =>
        text.indexOf("area of practice:") > -1
    )
    .map(
      (text: {
        replace: (
          arg0: string,
          arg1: string
        ) => {
          replace: (
            arg0: string,
            arg1: string
          ) => {
            replace: (
              arg0: string,
              arg1: string
            ) => {
              replace: (arg0: string, arg1: string) => { trim: () => void };
            };
          };
        };
      }) =>
        text
          .replace("Primary area of practice:", "")
          .replace("Secondary area of practice:", "")
          .replace("Tertiary area of practice:", "")
          .replace("Other area of practice:", "")
          .trim()
    );

  if (
    specialties.filter(
      (text: { indexOf: (arg0: string) => number }) =>
        text.indexOf("Not suppplied by lawyer") > -1
    ).length === 0
  ) {
    response.specialties = [...Array.from(new Set(specialties))];
  }

  // Free Consultation
  const consultation = tableRowsText
    .filter(
      (text: { indexOf: (arg0: string) => number }) =>
        text.indexOf("Provides a free initial consultation?") > -1
    )[0]
    .replace("Provides a free initial consultation?", "")
    .trim();
  if (consultation.indexOf("No") > -1) {
    response.freeConsultation = false;
  }
  if (consultation.indexOf("Yes") > -1) {
    response.freeConsultation = true;
  }

  // Accepts Legal Aid Clients
  const legalAid = tableRowsText
    .filter(
      (text: { indexOf: (arg0: string) => number }) =>
        text.indexOf("Accept Legal Aid clients?") > -1
    )[0]
    .replace("Accept Legal Aid clients?", "")
    .trim();
  if (legalAid.indexOf("No") > -1) {
    response.acceptsLegalAid = false;
  }
  if (legalAid.indexOf("Yes") > -1) {
    response.acceptsLegalAid = true;
  }

  response.intermediate = false;
  debug("RESPONSE: ", response);
  return callback(response);
};

function requestIsValid(request: any) {
  const pUri = new URL(request.uri);
  return pUri.host === HOST;
}

// Returns the Profile URIs
const generateProfileURIs = async (request: any, callback: any) => {
  debug("Generating URIs...");
  const ids = Array.from(Array(MAX_LAWYER_ID).keys());
  return Promise.all(
    ids.map(i => {
      const response = request;
      response.intermediate = true;
      response.uri = [
        "http://www.canlaw.org/cl/lawyers/lawyer_detail.php?lid=",
        i
      ].join("");
      return callback(response);
    })
  );
};

// Main Extract Function
const extractor = async (request: any, browser: any, callback: any) => {
  const pUri = new URL(request.uri);
  if (pUri.host === HOST) {
    debug("Scraping...");
    if (pUri.pathname.indexOf(PATHNAME_DETAIL) === -1) {
      generateProfileURIs(request, callback);
    } else if (pUri.pathname.indexOf(PATHNAME_DETAIL) !== -1) {
      return scrapeLawyerProfile(request, callback);
    }
  }
  return null;
};

// Main Transform Function
const transformer = async (request: any, callback: any) => {
  if (requestIsValid(request)) {
    debug("Request Validated, Transforming...");

    // Normalization

    // Persons
    const personName = norm(request.name);

    let personTags: never[] | any[] | Iterable<any> = [];
    if (typeof request.specialties !== "undefined") {
      personTags = request.specialties.filter(
        (text: {
          length: number;
          split: (arg0: string) => { length: number };
        }) => text.length >= 1 && text.split(" ").length <= 3
      );
      const extractedKeywords = await Promise.all(
        request.specialties
          .filter(
            (text: { split: (arg0: string) => { length: number } }) =>
              text.split(" ").length > 3
          )
          .map((text: any) => keywordExtractor(text))
      );
      personTags = [].concat.apply(
        personTags,
        extractedKeywords.map(e => e.keyphrases)
      );
      personTags = personTags.map((text: any) => norm(text));
      personTags = [...Array.from(new Set(personTags))];
    }

    const personDesignations = [];
    if (moment(request.calledToBar, "YYYY").isValid()) {
      personDesignations.push({
        title: "lawyer",
        issuer: null,
        dateIssued: moment(request.calledToBar, "YYYY"),
        status: null
      });
    }
    if (request.degrees.length > 1) {
      const degrees = request.degrees.split(",");
      degrees.map((degree: { trim: () => void }) =>
        personDesignations.push({
          title: degree.trim(),
          issuer: null,
          dateIssued: null,
          status: null
        })
      );
    }

    const personOffersFreeConsultation = request.freeConsultation;
    const personAcceptsLegalAid = request.acceptsLegalAid;

    // Organizations
    const organizationName = norm(request.firm);

    // Places
    const address =
      norm(request.address).length > 1 ? norm(request.address) : undefined;
    const city = norm(request.city).length > 1 ? norm(request.city) : undefined;
    const province =
      norm(request.province).length > 1
        ? normProvinces(norm(request.province))
        : undefined;
    const postalCode =
      norm(request.postalCode.replace(" ", "")).length > 1
        ? norm(request.postalCode.replace(" ", ""))
        : undefined;

    // IDs
    const personID = uuidv4();
    const organizationID = uuidv4();
    const placeID = uuidv4();
    const sourceID = uuidv5(request.uri, uuidv5.URL);

    // Transform
    const response = {
      data: [
        {
          id: personID,
          entityType: "PERSON",
          retrievedAt: request.iat,
          source: sourceID,
          // caslScreenshot: null,
          name: personName,
          description: null,
          tags: personTags,
          designations: personDesignations,
          organizations: [organizationID],
          places: [placeID],
          resources: [],
          offersFreeConsultation: personOffersFreeConsultation,
          acceptsLegalAid: personAcceptsLegalAid
        },
        {
          id: organizationID,
          entityType: "ORGANIZATION",
          retrievedAt: request.iat,
          source: sourceID,
          // caslScreenshot: null,
          name: organizationName,
          description: null,
          tags: [],
          persons: [personID],
          places: [placeID],
          resources: []
        },
        {
          id: placeID,
          entityType: "PLACE",
          retrievedAt: request.iat,
          source: sourceID,
          // caslScreenshot: null,
          address,
          locality: city,
          region: province,
          country: "canada",
          postalCode: postalCode
        },
        {
          id: sourceID,
          entityType: "RESOURCE",
          uri: request.uri,
          name: "www.canlaw.org",
          resourceType: "DATABASE"
          // caslCompliant: false,
        }
      ]
    };

    // Resources
    const phone = await phoneValidator(request.phone);
    const email = await emailValidator(request.email);
    const website = await urlValidator(request.website);

    if (phone.valid) {
      const phoneID = uuidv5(phone.uri, uuidv5.URL);
      const phoneObject = {
        id: phoneID,
        entityType: "RESOURCE",
        uri: phone.uri,
        name: phone.internationalFormat,
        resourceType: "PHONE",
        // caslCompliant: false,
        valid: phone.valid,
        localFormat: phone.localFormat,
        countryPrefix: phone.countryPrefix,
        countryCode: phone.countryCode,
        countryName: norm(phone.countryName),
        locality: norm(phone.location),
        carrier: norm(phone.carrier),
        lineType: phone.lineType
      };
      response.data.push(phoneObject);
      response.data[0].resources.push(phoneID);
    }

    if (email.valid) {
      const emailID = uuidv5(email.uri, uuidv5.URL);
      const emailObject = {
        id: emailID,
        entityType: "RESOURCE",
        uri: email.uri,
        name: email.name,
        resourceType: "EMAIL"
        // caslCompliant: false,
      };
      response.data.push(emailObject);
      response.data[0].resources.push(emailID);
    }

    if (website.valid) {
      const websiteID = uuidv5(website.href, uuidv5.URL);
      const websiteObject = {
        id: websiteID,
        entityType: "RESOURCE",
        uri: website.href,
        name: website.hostname,
        resourceType: "WEBSITE"
        // caslCompliant: false,
      };
      response.data.push(websiteObject);
      response.data[1].resources.push(websiteID);
    }
    callback(response);
  }
  return null;
};

// Main Load Function
const loader = async (request: any, db: any) => {
  // Get the documents collection
  debug("loader loading");
  const collection = db.collection("law");
  // Insert some documents
  const result = await collection.insertMany(request.data);
  debug(result);
};

export { extractor, transformer, loader };
