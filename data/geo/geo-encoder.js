const fs = require("fs");
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

function geohashConverterGCS(coord) {
  return geohash.encode(coord[0], coord[1], (precision = 4));
}
function geohashConverterLCS(coord) {
  return geohash.encode(coord[0] / 100000, coord[1] / 100000, (precision = 4));
}

function check_rep(hash, list) {
  for (let i = 0; i < list.length; i++) {
    if (hash == list[i]) return false;
  }
  // console.log("write: " + hash);
  return true;
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
        coord = geohashConverterGCS(
          geo_data.features[i].geometry.coordinates[0][j]
        );
        if (check_rep(coord, coord_list)) coord_list.push(coord);
      }
    }
    txt_path = "./data/result/" + year_name.split(".")[0] + ".txt";
    fs.writeFile(txt_path, list_to_string(coord_list), err => {
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

//0-8
// year_name = year_list[];
// converter(year_name);
