import json2csv from "json2csv";
import cheerio from "cheerio";
import { sliceBySubStrings } from "./lib";
import fs from "fs";

const stream = fs.createWriteStream("results.csv", { encoding: "utf8" });
const fNames = [];
const files = [];
const csv = "";

const labels = {
  fullName: "Contact Information Full Name",
  mailingName: "Mailing Name",
  licenseType: "Licence Type",
  realEstateInsured: "Real Estate Insured †",
  status: "Status Definitions",
  businessName: "Business Name",
  businessAddress: "Business Address",
  phone: "Phone",
  fax: "Fax",
  city: "City",
  email: "Email address",
  specialties: "Main Area(s) of Law/Legal Services",
  trusteeships: "Trusteeships",
  practiceRestrictions: "Current Practice Restrictions",
  regulatoryProceedings: "Current Regulatory Proceedings",
  disciplineHistory: "Discipline History",
  serviceInFrench: "Offers Services in French?",
  infoWithheld:
    "Contact information withheld. Contact the Law Society's Resource Centre by email at lawsociety@lsuc.on.ca or call 416-947-3315 (1-800-668-7380 ext. 3315).",
};

const Json2csvParser = json2csv.Parser;
const json2csvParser = new Json2csvParser({
  fields: Object.keys(labels),
  header: false,
  withBOM: true,
});

function onFileContent(filename, content) {
  const $ = cheerio.load(content);
  const entry = {};
  let contentString = $.text().replace(/\s\s+/g, " ");
  // Extract French Service
  if (contentString.indexOf(labels.serviceInFrench) !== -1) {
    entry.serviceInFrench = "yes";
    contentString = contentString.slice(
      0,
      contentString.indexOf(labels.serviceInFrench)
    );
  } else {
    entry.serviceInFrench = "no";
  }
  // Extract Discipline History
  if (contentString.indexOf(labels.disciplineHistory) !== -1) {
    entry.disciplineHistory = sliceBySubStrings(
      contentString,
      labels.disciplineHistory
    );
    contentString = contentString.slice(
      0,
      contentString.indexOf(labels.disciplineHistory)
    );
  }
  // Extract Regulatory Proceedings
  if (contentString.indexOf(labels.regulatoryProceedings) !== -1) {
    entry.regulatoryProceedings = sliceBySubStrings(
      contentString,
      labels.regulatoryProceedings
    );
    contentString = contentString.slice(
      0,
      contentString.indexOf(labels.regulatoryProceedings)
    );
  }
  // Extract Practice Restrictions
  if (contentString.indexOf(labels.practiceRestrictions) !== -1) {
    entry.practiceRestrictions = sliceBySubStrings(
      contentString,
      labels.practiceRestrictions
    );
    contentString = contentString.slice(
      0,
      contentString.indexOf(labels.practiceRestrictions)
    );
  }
  // Extract Trusteeships
  if (contentString.indexOf(labels.trusteeships) !== -1) {
    entry.trusteeships = sliceBySubStrings(contentString, labels.trusteeships);
    contentString = contentString.slice(
      0,
      contentString.indexOf(labels.trusteeships)
    );
  }

  if (contentString.indexOf(labels.infoWithheld) !== -1) {
    entry.city = sliceBySubStrings(
      contentString,
      labels.city,
      labels.infoWithheld
    );
    entry.status = sliceBySubStrings(contentString, labels.status, labels.city);
    entry.specialties = sliceBySubStrings(
      contentString,
      labels.specialties,
      labels.status
    );

    if (contentString.indexOf(labels.realEstateInsured) !== -1) {
      entry.licenseType = sliceBySubStrings(
        contentString,
        labels.licenseType,
        labels.realEstateInsured
      );
      entry.realEstateInsured = sliceBySubStrings(
        contentString,
        labels.realEstateInsured,
        labels.specialties
      );
    } else {
      entry.licenseType = sliceBySubStrings(
        contentString,
        labels.licenseType,
        labels.specialties
      );
    }
  } else {
    entry.specialties = sliceBySubStrings(contentString, labels.specialties);
    entry.email = sliceBySubStrings(
      contentString,
      labels.email,
      labels.specialties
    );
    entry.fax = sliceBySubStrings(contentString, labels.fax, labels.email);
    entry.phone = sliceBySubStrings(contentString, labels.phone, labels.fax);
    contentString = contentString.slice(0, contentString.indexOf(labels.phone));

    if (contentString.indexOf(labels.realEstateInsured) !== -1) {
      entry.licenseType = sliceBySubStrings(
        contentString,
        labels.licenseType,
        labels.realEstateInsured
      );
      entry.realEstateInsured = sliceBySubStrings(
        contentString,
        labels.realEstateInsured,
        labels.status
      );
    } else {
      entry.licenseType = sliceBySubStrings(
        contentString,
        labels.licenseType,
        labels.status
      );
    }

    entry.status = sliceBySubStrings(
      contentString,
      labels.status,
      labels.businessName
    );

    const cityCount = (contentString.match(/City/g) || []).length;
    if (contentString.indexOf(labels.city) === -1) {
      entry.businessName = sliceBySubStrings(
        contentString,
        labels.businessName,
        labels.businessAddress
      );
      entry.businessAddress = sliceBySubStrings(
        contentString,
        labels.businessAddress
      );
    } else if (cityCount === 1) {
      if (
        contentString.indexOf(labels.city) >
        contentString.indexOf(labels.businessAddress)
      ) {
        entry.businessName = sliceBySubStrings(
          contentString,
          labels.businessName,
          labels.businessAddress
        );
        entry.businessAddress = sliceBySubStrings(
          contentString,
          labels.businessAddress,
          labels.city
        );
        entry.city = sliceBySubStrings(contentString, labels.city);
      } else if (
        contentString.indexOf(labels.city) <
        contentString.indexOf(labels.businessAddress)
      ) {
        entry.businessName = sliceBySubStrings(
          contentString,
          labels.businessName,
          labels.city
        );
        entry.city = sliceBySubStrings(
          contentString,
          labels.city,
          labels.businessAddress
        );
        entry.businessAddress = sliceBySubStrings(
          contentString,
          labels.businessAddress
        );
      }
    } else if (cityCount > 1) {
      entry.businessName = sliceBySubStrings(
        contentString,
        labels.businessName,
        labels.businessAddress
      );
      entry.businessAddress = sliceBySubStrings(
        contentString,
        labels.businessAddress
      );
    }
  }

  entry.mailingName = sliceBySubStrings(
    contentString,
    labels.mailingName,
    labels.licenseType
  );
  entry.fullName = sliceBySubStrings(
    contentString,
    labels.fullName,
    labels.mailingName
  );

  Object.keys(labels).forEach(label => {
    if (!entry.hasOwnProperty(label)) {
      entry[label] = "null";
    }
    entry[label] = entry[label].trim();
    if (entry[label] === "") {
      entry[label] = "null";
    }
  });

  // To CSV
  stream.write([json2csvParser.parse(entry), "\n"].join(""));
}

function extractTokens(content) {
  const $ = cheerio.load(content);
  const contentString = $.text().replace(/\s\s+/g, " ");
  let output = "";
  const result = Object.entries(labels).map(label => ({
    label: label[0],
    index: contentString.indexOf(label[1]),
  }));
  result.sort((a, b) => a.index - b.index);
  result.filter(item => item.index !== -1).forEach(item => {
    output = output.concat(",");
    output = output.concat(item.label);
  });
  output = output.slice(1);
  output = output.concat("\n");
  stream.write(output);
}

function renameFile(oldName, content) {
  const $ = cheerio.load(content);
  const contentString = $.text().replace(/\s\s+/g, " ");
  const name = sliceBySubStrings(
    contentString,
    labels.fullName,
    labels.mailingName
  )
    .trim()
    .replace(/\s/g, "-");
  const newName = ["data/ontario2/", name, ".html"].join("");
  if (fNames.filter(item => item.indexOf(newName) !== -1).length === 0) {
    fNames.push(newName);
    fs.rename(oldName, ["data/ontario2/", newName, ".html"].join(""), err => {
      if (err) console.log(`ERROR: ${err}`);
    });
  } else {
    console.log(fNames.filter(item => item.indexOf(newName) !== -1), newName);
    console.log("duplicate found");
  }
}

function readFiles(dirname) {
  fs.readdir(dirname, (err, filenames) => {
    if (err) {
      console.log(err);
      return;
    }
    filenames.forEach(filename => {
      const content = fs.readFileSync(dirname + filename, "utf-8");
      // renameFile(dirname + filename, content);
      onFileContent(filename, content);
      // extractTokens(content);
    });
  });
}

stream.once("open", () => {
  readFiles("data/ontario/");
});
