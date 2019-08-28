// https://mapshaper.org/

const fs = require("fs");
const proj4 = require("proj4");
var geohash = require("ngeohash");

const year_list = [
  "gcsd000a08a_e.json",
  "gcsd000a09a_e.json",
  "gcsd000a10a_e.json",
  "lcsd000a12a_e.json",
  "lcsd000a13a_e.json",
  "lcsd000a14a_e.json",
  "lcsd000a15a_e.json",
  "lcsd000a17a_e.json",
  "lcsd000a18a_e.json"
];

const NAD83Projection =
  'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",49],PARAMETER["standard_parallel_2",77],PARAMETER["latitude_of_origin",63.390675],PARAMETER["central_meridian",-91.866667],PARAMETER["false_easting",6200000],PARAMETER["false_northing",3000000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';

function geohashConverterGCS(coord) {
  return geohash.encode(coord[0], coord[1], (precision = 4));
}
function geohashConverterLCS(coord) {
  return geohash.encode(
    proj4(NAD83Projection).inverse(coord)[0],
    proj4(NAD83Projection).inverse(coord)[1],
    (precision = 4)
  );
}

function removeDuplicateUsingSet(arr) {
  let unique_array = Array.from(new Set(arr));
  return unique_array;
}

function list_to_string(list) {
  var data = "";
  for (let i = 0; i < list.length; i++) {
    data += list[i] + "\n";
  }
  return data;
}

function converter(year_name) {
  geo_data = {};
  json_path = "./data/json/" + year_name;
  fs.readFile(json_path, (err, data) => {
    console.log("  - " + year_name);
    if (err) throw err;
    geo_data = JSON.parse(data);
    coord_list = [];
    feature_count = 0;
    coords_count = 0;

    feature_count = geo_data.features.length;
    // console.log(feature_count);
    for (let i = 0; i < feature_count; i++) {
      coords_count = geo_data.features[i].geometry.coordinates[0].length;
      // console.log(coords_count);
      for (let j = 0; j < coords_count; j++) {
        temp_coords = geo_data.features[i].geometry.coordinates[0][j];
        if (typeof temp_coords[0] != "object") {
          // console.log(temp_coords);
          coord = geohashConverterGCS(temp_coords);
          coord_list.push(coord);
        } else {
          for (let x = 0; x < temp_coords.length - 1; x++) {
            // console.log(temp_coords[x]);
            coord = geohashConverterGCS(temp_coords[x]);
            coord_list.push(coord);
          }
        }
      }
    }
    txt_path = "./data/result/" + year_name.split(".")[0] + ".txt";
    cleaned_coords = list_to_string(removeDuplicateUsingSet(coord_list));
    fs.writeFile(txt_path, cleaned_coords, err => {
      if (err) throw err;
    });
  });
}

// for (let k = 0; k < year_list.length; k++) {
//   year_name = year_list[k];
//   console.log("  -: " + year_name);
//   const result = async _ => {
//     await converter(year_name);
//   };
// }

//0-2 gcs
//3-8 lcs
year_name = year_list[0];
converter(year_name);
