import { NowRequest, NowResponse } from "@now/node";
import axios from "axios";

export default async (req: NowRequest, res: NowResponse) => {
  const URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${req.query.input}&inputtype=textquery&fields=geometry&key=${process.env.GOOGLE_API_KEY}`;
  const response = await axios.get(URL);
  const location = response.data.candidates[0].geometry.location;
  const coordinates = {
    latitude: location.lat,
    longitude: location.lng,
  };
  res.send(coordinates);
};
