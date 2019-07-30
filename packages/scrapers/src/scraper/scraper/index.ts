import axios from "axios";
import cheerio from "cheerio";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

type schoolAddresses = { address: string; status: string };
type coordinates = { lat: number; lng: number };
type school = { name: string; rank: number; href: string };

export async function coordinateCalculator(
  address: string,
  error_frequency: number
): Promise<coordinates> {
  var coordinate: coordinates;
  const ADDRESS_URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${address}&inputtype=textquery&fields=formatted_address,geometry&key=${GOOGLE_API_KEY}`;
  try {
    const response = await axios.get(ADDRESS_URL);
    coordinate = {
      lat: response.data.candidates[0].geometry.location.lat,
      lng: response.data.candidates[0].geometry.location.lng,
    };

    return coordinate;
  } catch (error) {
    console.log("entered error");
    console.log(error_frequency);
    if (error_frequency == 0) {
      var new_address: string = "";
      for (var i = address.length - 1; i > address.length - 4; i--) {
        new_address = address.charAt(i) + new_address;
      }
      console.log("length:" + address.length + " i:" + i);
      if (address.charAt(i) == " ") {
        for (var i = address.length - 5; i > address.length - 8; i--) {
          new_address = address.charAt(i) + new_address;
        }
      } else {
        for (var i = address.length - 4; i > address.length - 7; i--) {
          new_address = address.charAt(i) + new_address;
        }
      }
      console.log(new_address);
      error_frequency = 1;
      var coordinate: coordinates = await coordinateCalculator(new_address, 1);
      return coordinate;
    } else {
      console.log(error_frequency);
      console.log("entered else");
      coordinate = { lat: 0, lng: 0 };
      return coordinate;
    }
  }
}

export async function rankingsData(
  SchoolLevel: string,
  province: string
): Promise<school[]> {
  const schools: school[] = [];
  const SCHOOL_RANKING_URL = `http://${province}.compareschoolrankings.org/${SchoolLevel}/SchoolsByRankLocationName.aspx`;
  var link: string[] = [];
  try {
    const response = await axios.get(SCHOOL_RANKING_URL);
    const html = response.data;
    const $ = cheerio.load(html);
    const rows = $("table.rating").find("tr");
    $("a", ".tdcell").each(function(i, element) {
      link[i] = $(element).attr("href");
    });

    // iterating through the cells in array
    rows.map((index: number, currentCell: CheerioElement) => {
      // scraping school name data (4th column in table)
      const schoolName: string = $(currentCell)
        .children("td.tdcell:nth-child(4)")
        .text();

      // scraping rating data (5th column in table)
      /* const schoolCity: string = $(currentCell)
        .children("td.tdcell:nth-child(5)")
        .text(); */
      // scraping rating data (6th column in table)
      const schoolRank: number = Number(
        $(currentCell)
          .children("td.tdcell:nth-child(6)")
          .text()
      );
      schools.push({
        name: schoolName,
        rank: schoolRank,
        href: link[index - 2],
      });
    });
    return schools;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function schooldAddressData(href: string, province: string) {
  var schoolAddress: schoolAddresses;
  schoolAddress = { address: "", status: "" };
  const SCHOOL_ADDRESS_URL = `http://${province}.compareschoolrankings.org/${href}`;
  try {
    const response = await axios.get(SCHOOL_ADDRESS_URL);
    const html = response.data;
    const $ = cheerio.load(html);
    $("span").each(function(i, element) {
      if (
        $(element).attr("id") == "ctl00_ContentPlaceHolder1_SchoolInfoDisplay"
      ) {
        schoolAddress.status = $($(element).contents()[2]).text();
        schoolAddress.address =
          $($(element).contents()[4]).text() +
          " " +
          $($(element).contents()[6]).text();
      }
    });
    return schoolAddress;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
