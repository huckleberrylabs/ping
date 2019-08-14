import {
  rankingsData,
  coordinateCalculator,
  schooldAddressData,
} from "./scraper";
import fs from "fs";

export async function schoolDataCollector() {
  type fullSchoolData = {
    name: string;
    rating: number;
    address: string;
    status: string;
    latitude: number;
    longitude: number;
    province: string;
    type: string;
  };

  var schoolData: fullSchoolData[] = [];

  var province: string = "";
  var level: string = "";
  for (var i = 0; i < 7; i++) {
    if (i == 0) {
      province = "ontario";
      level = "secondary";
    }
    if (i == 1) {
      province = "ontario";
      level = "elementary";
    }
    if (i == 2) {
      province = "britishcolumbia";
      level = "secondary";
    }
    if (i == 3) {
      province = "britishcolumbia";
      level = "elementary";
    }
    if (i == 4) {
      province = "quebec";
      level = "secondary";
    }
    if (i == 5) {
      province = "alberta";
      level = "elementary";
    }
    if (i == 6) {
      province = "alberta";
      level = "high";
    }
    const data: Array<{
      name: string;
      rank: number;
      href: string;
    }> = await rankingsData(level, province);
    console.log(data.length);
    for (var j = 2; j < data.length; j++) {
      const dataAddress: any = await schooldAddressData(data[j].href, province);
      const coord: any = await coordinateCalculator(dataAddress.address, 0);
      schoolData.push({
        name: data[j].name,
        rating: data[j].rank,
        address: dataAddress.address,
        status: dataAddress.status,
        latitude: coord.lat,
        longitude: coord.lng,
        province: province,
        type: level,
      });
      console.log(schoolData);
    }
  }
  let json = JSON.stringify(schoolData);
  fs.writeFile("./data/school-data.json", json, (err: any) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}
