import uuid from "uuid/v4";
import express from "express";
import axios from "axios";
import { GOOGLE_API_KEY, LL_API_KEY } from "./scraper/config";
let schools: School[] = require("../data/school-data.json");

export type School = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  address: string;
  status: string;
  province: string;
  type: string;
};

schools = schools.map((school: School) => ({ id: uuid(), ...school }));
const app = express();
const port = 4000;

(async () => {
  app.get("/api/schools", function(req, res) {
    res.send(schools);
  });

  app.get("/api/schools/:id", function(req, res) {
    res.send(schools.filter(school => school.id === req.params["id"])[0]);
  });

  app.get("/api/autocomplete", async function(req, res) {
    const ADDRESS_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${
      req.query.input
    }&types=address&location=56.130366,-106.346771&radius=3500000&strictbounds&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(ADDRESS_URL);
    res.send(response.data.predictions);
  });

  app.get("/api/geocode", async function(req, res) {
    const URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${
      req.query.input
    }&inputtype=textquery&fields=geometry&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(URL);
    const location = response.data.candidates[0].geometry.location;
    const coordinates = {
      latitude: location.lat,
      longitude: location.lng,
    };
    res.send(coordinates);
  });

  app.get("/api/local-logic/scores", async function(req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var URL = `https://api.locallogic.co/v1/scores?lat=${lat}&lng=${lng}&key=${LL_API_KEY}&fields=value,text,description,category,name,icon&locale=en`;
    const response = await axios.get(URL);
    res.send(response.data);
  });

  app.get("/api/local-logic/nearby", async function(req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var URL = `https://api.locallogic.co/v1/nearby?key=${LL_API_KEY}&lat=${lat}&lng=${lng}`;
    const response = await axios.get(URL);
    res.send(response.data);
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();
