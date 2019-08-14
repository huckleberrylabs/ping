import { NowRequest, NowResponse } from "@now/node";
import axios from "axios";

export default async (req: NowRequest, res: NowResponse) => {
  var lat = req.query.lat;
  var lng = req.query.lng;
  var URL = `https://api.locallogic.co/v1/scores?lat=${lat}&lng=${lng}&key=${process.env.LOCAL_LOGIC_API_KEY}&fields=value,text,description,category,name,icon&locale=en`;
  const response = await axios.get(URL);
  res.send(response.data);
};
