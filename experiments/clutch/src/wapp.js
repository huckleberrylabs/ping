const fs = require("fs");
const Papa = require("papaparse");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const Wappalyzer = require("wappalyzer");

const fileName = process.argv[2];
if (typeof fileName !== "string" || fileName.indexOf(".csv") === -1) {
  throw new Error("invalid file name provided");
}

const file = fs.readFileSync(fileName, "utf8");
const results = Papa.parse(file);

if (results.errors.length > 0) {
  console.error(results.errors);
  throw new Error("papa parse error");
}

if (results.data.some(entry => entry.length !== 7)) {
  throw new Error("data corrupt");
}

const index = results.data;

const date = new Date().valueOf();
const errorWriter = createCsvWriter({
  path: date + "-wapp-error.csv",
  header: ["profile"]
});

const options = {
  browser: "puppeteer",
  debug: false,
  delay: 250,
  maxDepth: 3,
  maxUrls: 10,
  maxWait: 10000,
  recursive: true,
  htmlMaxCols: 2000,
  htmlMaxRows: 2000
};

(async () => {
  for (let i = 0; i < index.length; i++) {
    const entry = index[i];
    const record = {
      id: entry[0],
      name: entry[1],
      tagline: entry[2],
      profile: entry[3],
      website: entry[4],
      directory: entry[5],
      page: entry[6]
    };
    try {
      const wappalyzer = new Wappalyzer(record.website, options);
      const json = await wappalyzer.analyze();
      json.website = record.website;
      json.id = record.id;
      fs.writeFileSync(
        "wapp/" + record.id + "-" + date + "-wapp.json",
        JSON.stringify(json, null, 2)
      );
      console.log(
        "progress: ",
        (i / index.length).toFixed(5),
        "%",
        "record: ",
        record.id
      );
    } catch (error) {
      console.log("error on ", record.website, error);
      await errorWriter.writeRecords([{ directory: record.profile }]);
    }
  }
})();
