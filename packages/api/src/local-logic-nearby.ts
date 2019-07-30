import { NowRequest, NowResponse } from "@now/node";
import axios from "axios";

export default async (req: NowRequest, res: NowResponse) => {
  var lat = req.query.lat;
  var lng = req.query.lng;
  var URL = `https://api.locallogic.co/v1/nearby?key=${process.env.LOCAL_LOGIC_API_KEY}&lat=${lat}&lng=${lng}`;
  const response = await axios.get(URL);
  res.send(response.data);
};
