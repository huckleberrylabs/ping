import axios from "axios";
import cheerio from "cheerio";
// @ts-ignore
import ObjectsToCsv from "objects-to-csv";

type agentData = {
  /*name: string; title: string;*/ email: string /*mobile: string */;
};

async function AgentScraper(/*PAGE_NUMBER: number*/): Promise<agentData[]> {
  const aData: agentData[] = [];
  //const names: any = [];
  //const titles: any = [];
  const emails: any = [];
  //const mobiles: any = [];
  const URL = `https://ontario.onepercentrealty.com/agents/location/`;
  try {
    const response = await axios.get(URL);
    const html = response.data;
    const $ = cheerio.load(html);
    /*$('h2[style*="width: 200px; word-wrap: break-word;"] > #text').each(
      function(i, element) {
        if (element.type === "text") {
          console.log($(element).text());
        }
        //names.push($($(element).text()));
      }
    );*/
    /*$("h2 > small").each(function(i, element) {
      console.log($(element).text());
      //titles.push($(element).text());
    });*/

    /*$("dl > dd").each(function(i, element) {
      console.log($(element).text());
      //mobiles.push($(element).text());
    });*/

    $("dd > a").each(function(i, element) {
      //console.log($(element).text());
      emails.push($(element).text());
    });
    for (let i = 0; i < emails.length; i++) {
      aData.push({
        //name: names[i],
        //title: titles[i],
        email: emails[i],
        //mobile: mobiles[i],
      });
    }
    //console.log(aData);
    return aData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

(async () => {
  /*for (let i = 6; i < 8; i++) {
    var aData: any = await AgentScraper(i);
    let csv = new ObjectsToCsv(aData);
    await csv.toDisk("./OnePercentRealtyData.csv", { append: true });
  }*/
  var aData: any = await AgentScraper();
  let csv = new ObjectsToCsv(aData);
  await csv.toDisk("./OnePercentRealtyData.csv", { append: true });

  AgentScraper();
})();
