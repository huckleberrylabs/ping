import request from "request-promise-native";
import cheerio from "cheerio";
import Debug from "debug";

const debug = Debug("NewFoundLand");
// Change gender_cl from M to F
const URL =
  "https://lsnl.memberpro.net/ssl/main/body.cfm?menu=directory&page_no=1&records_perpage_qy=100000&person_nm=&first_nm=&city_nm=&location_nm=&gender_cl=F&area_ds=&language_cl=&member_status_cl=&mode=search";
request.get(URL);
