import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";
import { cities, positions } from "./categories";

type Entry = {
  company: string;
  title: string;
  city: string;
  salary: number;
  experience: number;
  pfa: boolean;
  absolvent: boolean;
  timestamp: string;
  keywords: string;
};

async function scrapeBy(
  categoryName: string,
  category: string
): Promise<Entry[]> {
  try {
    const res = await axios.post(
      "http://www.cashit.ro/",
      {
        [categoryName]: category,
      },
      {
        headers: {
          Referer: "http://www.cashit.ro/",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0",
          Host: "www.cashit.ro",
          Cookie:
            "session=eyJjc3JmX3Rva2VuIjoiMTI5NjQ1NWI1MzNiMDM5Mjc2OWNhNzZkOGU2MWQ3MmQwNmFlYmVlMSJ9.EA90Ig.UnMdNSAMIxvcu0k9b6m05Oa5LsE",
        },
      }
    );
    const $ = cheerio.load(res.data);
    return $("tbody tr")
      .map((index, element) => {
        const pfaIcon = $(element)
          .find("td:nth-of-type(6)")
          .html();
        let pfa;
        if (pfaIcon) {
          pfa = pfaIcon.indexOf("green") > -1 ? true : false;
        }

        const absolventIcon = $(element)
          .find("td:nth-of-type(7)")
          .html();
        let absolvent;
        if (absolventIcon) {
          absolvent = absolventIcon.indexOf("green") > -1 ? true : false;
        }

        return {
          company: $(element)
            .find("td:nth-of-type(1)")
            .text()
            .trim(),
          salary: Number(
            $(element)
              .find("td:nth-of-type(2)")
              .text()
              .trim()
          ),
          title: $(element)
            .find("td:nth-of-type(3)")
            .text()
            .trim(),
          city: $(element)
            .find("td:nth-of-type(4)")
            .text()
            .trim(),
          experience: Number(
            $(element)
              .find("td:nth-of-type(5)")
              .text()
              .trim()
          ),
          pfa,
          absolvent,
          timestamp: $(element)
            .find("td:nth-of-type(8)")
            .text()
            .trim(),
          keywords: $(element)
            .find("td:nth-of-type(9)")
            .text()
            .trim(),
        };
      })
      .get();
  } catch (error) {
    console.log(error);
    return [];
  }
}

(async () => {
  const data: Entry[] = [];
  const byCity = await Promise.all(
    cities.map(async city => scrapeBy("city", city))
  );
  byCity.forEach(entryArray => {
    entryArray.forEach(entry => data.push(entry));
  });
  const byPosition = await Promise.all(
    positions.map(async position => scrapeBy("position", position))
  );
  byPosition.forEach(entryArray => {
    entryArray.forEach(entry => data.push(entry));
  });
  console.log("Results Found: ", data.length);

  fs.writeFile("data.json", JSON.stringify(data), function(err: any) {
    if (err) {
      console.log(err);
    }
  });
})();
