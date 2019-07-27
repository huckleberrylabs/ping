import { NowRequest, NowResponse } from "@now/node";
import { School } from "./school-model";
import uuid from "uuid/v4";
let schools: School[] = require("../data/school-data.json");
schools = schools.map((school: School) => ({ id: uuid(), ...school }));

export default async (req: NowRequest, res: NowResponse) => {
  if (req.query.id) {
    res.send(schools.filter(school => school.id === req.query.id)[0]);
  } else {
    res.send(schools);
  }
};
